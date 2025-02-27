import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
	theme: 'light' | 'dark' | 'system';
	status: 'loading' | 'idle';
}

export const themeSlice = createSlice({
	name: 'theme',
	initialState: {
		theme: 'light',
		status: 'idle'
	} as ThemeState,
	reducers: {
		setTheme: (state, action: PayloadAction<ThemeState['theme']>) => {
			state.theme = action.payload;
			state.status = 'idle';
		},
		setStatus: (state, action: PayloadAction<ThemeState['status']>) => {
			state.status = action.payload;
		}
	}
});
