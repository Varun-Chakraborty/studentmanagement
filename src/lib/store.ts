import { configureStore } from '@reduxjs/toolkit';
import {
	studentSlice,
	userSlice,
	usersSlice,
	gamesSlice,
	teachersSlice,
	themeSlice
} from './features';

export const makeStore = () => {
	return configureStore({
		reducer: {
			user: userSlice.reducer,
			users: usersSlice.reducer,
			students: studentSlice.reducer,
			games: gamesSlice.reducer,
			teachers: teachersSlice.reducer,
			theme: themeSlice.reducer
		}
	});
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
