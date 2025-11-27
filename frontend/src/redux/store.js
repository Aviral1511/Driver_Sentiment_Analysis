import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import configReducer from './slices/configSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    config: configReducer,
  },
});

export default store;
