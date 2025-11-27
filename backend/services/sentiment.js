// Rule-based sentiment (no ML), ESM

const POS_WORDS = new Set([
  'good','great','excellent','nice','fast','polite','clean','happy','awesome','smooth',
  'helpful','kind','on-time','ontime','comfortable','safe','respectful','professional'
]);

const NEG_WORDS = new Set([
  'bad','rude','late','dirty','angry','worst','slow','unsafe','smelly','hate','reckless',
  'unprofessional','harsh','careless','rough','impolite','terrible','poor'
]);

const EMO_POS = new Set(['😊','🙂','😀','😄','😃','😁','👍','✨','💯','👌']);
const EMO_NEG = new Set(['😡','😠','👎','💢','😤','🤬','💀']);

const INTENSIFIERS = new Set(['very','really','extremely','super','highly']);
const DAMPENERS   = new Set(['slightly','somewhat','kinda','little','a-little','bit','a-bit','barely','not-so']);

// Negators: include apostrophe & no-apostrophe variants, plus "hardly"/"never"
const NEGATORS = new Set([
  'not',"isn't","wasn't","aren't","weren't","don't","doesn't","didn't","no","never","hardly","can't","won't","couldn't","shouldn't","wouldn't",
  'isnt','wasnt','arent','werent','dont','doesnt','didnt','cant','wont','couldnt','shouldnt','wouldnt'
]);

function normalize(text) {
  // Preserve emojis and apostrophes; lowercase; collapse whitespace.
  let t = text.replace(/[\r\n]+/g, ' ').toLowerCase();

  // Convert common "n't" into "not" to be robust (keeps semantics even if apostrophe lost later)
  t = t.replace(/\b(\w+)n't\b/g, (_, p1) => (p1 === 'ca' ? 'can not' : p1 === 'wo' ? 'will not' : `${p1} not`));

  // Keep letters, digits, apostrophe, dash, space, !, ? and our emojis
  t = t.replace(/[^a-z0-9\s\-!'?😊🙂😀😄😃😁👍✨💯👌😡😠👎💢😤🤬💀]/g, ' ');
  return t.replace(/\s+/g, ' ').trim();
}

function tokenize(text) {
  const norm = normalize(text);

  // Split off runs of ! and ? so "great!!" -> ["great","!","!"]
  const pieces = norm.split(/\s+/).flatMap(tok => {
    const m = tok.match(/([a-z0-9'\-😊🙂😀😄😃😁👍✨💯👌😡😠👎💢😤🤬💀]+)([!?]+)?$/i);
    if (!m) return [tok];
    const core = m[1];
    const tail = m[2] || '';
    return tail ? [core, ...tail.split('')] : [core];
  });

  // Drop empty cores that came from punctuation-only tokens
  return pieces.filter(Boolean);
}

function isSentimentToken(tk) {
  return POS_WORDS.has(tk) || NEG_WORDS.has(tk) || EMO_POS.has(tk) || EMO_NEG.has(tk);
}

/**
 * Effects last for N subsequent *sentiment-bearing* tokens (not raw tokens).
 * - negation flips sign
 * - intensifier x1.5
 * - dampener x0.5
 */
function scoreTokens(tokens) {
  let score = 0;

  let negateLeft = 0;      // how many sentiment tokens left to flip
  let intensifyLeft = 0;   // how many sentiment tokens left to boost
  let dampenLeft = 0;      // how many sentiment tokens left to dampen

  for (let i = 0; i < tokens.length; i++) {
    const tk = tokens[i];

    if (tk === '!' || tk === '?') {
      if (tk === '!' && score !== 0) score += 0.3 * Math.sign(score);
      continue;
    }

    if (INTENSIFIERS.has(tk)) { intensifyLeft = Math.max(intensifyLeft, 2); continue; }
    if (DAMPENERS.has(tk))   { dampenLeft   = Math.max(dampenLeft,   2); continue; }
    if (NEGATORS.has(tk))    { negateLeft   = Math.max(negateLeft,   2); continue; }

    // compute sentiment delta
    let delta = 0;
    if (POS_WORDS.has(tk)) delta += 1;
    if (NEG_WORDS.has(tk)) delta -= 1;
    if (EMO_POS.has(tk))   delta += 1;
    if (EMO_NEG.has(tk))   delta -= 1;

    if (delta !== 0) {
      if (negateLeft > 0)   delta *= -1;
      if (intensifyLeft > 0) delta *= 1.5;
      if (dampenLeft > 0)    delta *= 0.5;

      score += delta;

      // decrement scopes ONLY when we consumed a sentiment-bearing token
      if (negateLeft > 0)   negateLeft--;
      if (intensifyLeft > 0) intensifyLeft--;
      if (dampenLeft > 0)    dampenLeft--;
    }
  }

  return score;
}

function labelFromScore(score) {
  if (score <= -0.75) return 'negative';
  if (score >=  0.75) return 'positive';
  return 'neutral';
}

// 1..5 true mapping (you can tweak thresholds)
function starsFromScore(score) {
  if (score <= -2.0) return 1;
  if (score <  -0.75) return 2;
  if (score <=  0.75) return 3;
  if (score <   2.0)  return 4;
  return 5;
}

/**
 * Public APIs
 */
export function classifySentiment(text, stars) {
  const tokens = tokenize(text);
  const rawScore = Number(scoreTokens(tokens).toFixed(2));
  const label = labelFromScore(rawScore);
  // const mappedStars = typeof stars === 'number' ? stars : starsFromScore(rawScore);
  let mappedStars;
  if (Number.isFinite(stars) && stars >= 1 && stars <= 5) {
    mappedStars = stars;
  } else {
    // mappedStars = label === 'negative' ? 2 : label === 'neutral' ? 3 : 4;
    mappedStars = starsFromScore(rawScore);
  }
  return { label, score: rawScore, mappedStars };
}

export function analyzeSentimentDetailed(text) {
  const tokens = tokenize(text);
  const score = Number(scoreTokens(tokens).toFixed(2));
  const label = labelFromScore(score);
  return {
    tokens,
    score,
    label,
    mappedStars: starsFromScore(score)
  };
}
