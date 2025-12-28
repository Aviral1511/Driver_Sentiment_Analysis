# 🏥 RAG-Powered Insurance Claims Query Assistant

Natural Language Search for Healthcare Insurance Claims.

A smart claims search system that lets users query insurance claims using natural language like:

- "Show me denied claims last year"
- "Find pending claims for diabetes patients"
- "CLM-1204" (direct lookup)

### No SQL. No dashboards. Just ask.
**This project was built as a hackathon-ready MVP, with a scalable design to support RAG, embeddings, LLM reasoning & enterprise workflows.**

## 🚀 Features

| Feature | Status |
|---|---|
|Natural language claim search (NLP intent extraction)|	✔️ Done|
|Filter by status (approved/denied/pending)|	✔️ Done|
|Date range filters (last quarter, last year, etc.)|	✔️ Done|
|View claim details with timeline|	✔️ Done|
|Summary insights (count, distribution, total amount)|	✔️ Done|
|"Show All Claims" browser mode|	✔️ Done|
|Mock Dataset ETL from CSV|	✔️ Done|
|RAG + Embeddings + LLM summaries|	🔜 Next Phase|
|Semantic similarity search|	🔜 Future|
|Role-based access, dashboards, export|	🔜 Future|

## 🏗 Tech Stack

| Category | Tech |
|---|---|
|Frontend| React + TailwindCSS|
|Backend| Node.js + Express|
|Database| MongoDB (Mongoose ORM)|
|ETL| CSV → cleaned → loaded into DB|
|Potential Extensions| Pinecone / Chroma / Weaviate + GPT/Gemini for RAG|

## 📦 Project Structure
- 📁 backend
- ├─ src/
- │  ├─ models/Claim.js
- │  ├─ controllers/
- │  ├─ routes/
- │  ├─ utils/etl_load_csv.js
- │  ├─ server.js
- │  └─ ...
- 📁 frontend
- ├─ src/components/
- │  ├─ QueryBox.jsx
- │  ├─ Results.jsx
- │  ├─ ClaimDetail.jsx
- ├─ App.jsx
- └─ ...
-📄 README.md (You are here)


## ⚙️ Setup Instructions
### 1. Install dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment
Create .env inside backend:
```bash
MONGO_URI=mongodb://localhost:27017/claimsDB
PORT=4000
```

### 3. Load Mock Data (ETL)
```bash
node backend/src/utils/etl_load_csv.js
```

**Imports 1000+ synthetic claims from /data/mock_claims.csv**

### 4. Start Servers

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run dev
```

## 🖥 Usage

### Query examples:
- show denied claims last year
- approved claims above 10000
- pending claims last quarter
- CLM-2099               // direct lookup
- show all claims        // via button

## UI Features:

- ✔ Shows matching claims with match scores
- ✔ Displays summaries — total claims, total amount, status split
- ✔ Inline Details Panel opens below selected row
- ✔ Clicking Ask/Show All auto-closes previous details

## 🔥 Future Enhancements
- Upcoming Feature	Why it Matters
- Convert claims into embeddings	Enables semantic search
- Vector Database (Pinecone/Chroma)	Faster intelligent retrieval
- RAG pipeline integration	Ask complex questions & get summaries
- Gemini/ChatGPT reasoning layer	Explain denial causes, trends
- Dashboards + Analytics	Provider-wise, disease-wise summaries
- Access Control + Audit Logs	Production readiness
  
## 📌 Demo Presentation Points

- Built for insurance payer workflows
- Removes manual filtering & SQL dependency
- Search → Rank → Insights → Detailed View
- Architecture is LLM-ready & scalable
- Designed for real production evolution

## 🤝 Contributions

PRs welcome!
Ideas welcome!
Reach out if you want to contribute or expand RAG integration.

## 📬 Author

- **Name - Aviral Tiwari**
- Contact: aviral.legend520@gmail.com
- Linkedin - https://www.linkedin.com/in/aviral-tiwari-78620524b/
