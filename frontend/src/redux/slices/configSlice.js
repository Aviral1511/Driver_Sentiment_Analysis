// src/redux/slices/configSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/apiClient.js';

export const fetchConfig = createAsyncThunk('config/fetch', async () => {
  const { data } = await api.get('/config');
  return data;
});

export const updateConfig = createAsyncThunk('config/update', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/config', payload);
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { error: 'update_failed' });
  }
});

const configSlice = createSlice({
  name: 'config',
  initialState: {
    data: null,
    loading: false,
    error: null,
    saving: false,
    saveError: null,
    saveOk: false,
  },
  reducers: {
    clearSaveState(state) {
      state.saveOk = false;
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchConfig.rejected, (state) => {
        state.loading = false;
        state.error = 'fetch_failed';
      })
      .addCase(updateConfig.pending, (state) => {
        state.saving = true;
        state.saveError = null;
        state.saveOk = false;
      })
      .addCase(updateConfig.fulfilled, (state, action) => {
        state.saving = false;
        state.saveOk = true;
        state.data = action.payload; // server returns updated config
      })
      .addCase(updateConfig.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload?.error || 'update_failed';
      });
  },
});

export const { clearSaveState } = configSlice.actions;
export default configSlice.reducer;
