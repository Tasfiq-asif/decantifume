// src/redux/selectors/index.ts
import { RootState } from '../store';


// Auth selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
// ... rest of your selectors