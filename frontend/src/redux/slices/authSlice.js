// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/apiClient.js';
import { toast } from 'react-toastify';

const saved = (() => {
  try { return JSON.parse(localStorage.getItem('auth')) || null; } catch { return null; }
})();

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      // backend should return { token, user: { email, role, ... } }
      return data;
    } catch (e) {
      toast.error('Login Failed');
      return rejectWithValue(e?.response?.data?.error || 'login_failed');
    }
  }
);

const slice = createSlice({
  name: 'auth',
  initialState: {
    token: saved?.token || null,
    user: saved?.user || null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setAuth(state, action) {               // <- named export you used earlier
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('auth', JSON.stringify(action.payload));
    },
    clearAuth(state) {
      state.token = null;
      state.user = null;
      state.error = null;
      state.status = 'idle';
      localStorage.removeItem('auth');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('auth', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'login_failed';
      });
  },
});

export const { setAuth, clearAuth } = slice.actions; // <-- named exports
export default slice.reducer;
