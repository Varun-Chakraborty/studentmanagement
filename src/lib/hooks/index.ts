'use client';
import { useEffect } from 'react';
import { User } from '@prisma/client';
import { useDispatch, useSelector, useStore } from 'react-redux';
import type { RootState, AppDispatch, AppStore } from '../store';
import axios from 'axios';
import { themeSlice, userSlice } from '../features';

export function useFetchUser() {
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(userSlice.actions.setStatus('loading'));
		axios
			.get<{ user: Omit<User, 'password'> }>('/api/user')
			.then(res => dispatch(userSlice.actions.setUser(res.data.user)))
			.catch(() => dispatch(userSlice.actions.setStatus('failed')));
	}, [dispatch]);
}

export function useTheme() {
	const dispatch = useAppDispatch();
	const { theme, status } = useAppSelector(state => state.theme);
	const isLoading = status === 'loading';

	// Runs once on mount to get stored theme
	useEffect(() => {
		dispatch(themeSlice.actions.setStatus('loading'));
		if (typeof window === 'undefined') return; // Ensure client-side execution
		const currentTheme = localStorage.getItem('theme') as typeof theme | null;
		dispatch(themeSlice.actions.setTheme(currentTheme ?? 'system'));
	}, [dispatch]);

	// Handles theme updates and system preference changes
	useEffect(() => {
		if (typeof window === 'undefined') return; // Ensure client-side execution

		const root = document.documentElement;
		const applyTheme = (themeToApply: string) => {
			const isDark =
				themeToApply === 'dark' ||
				(themeToApply === 'system' &&
					window.matchMedia('(prefers-color-scheme: dark)').matches);
			root.classList.toggle('dark', isDark);
			localStorage.setItem('theme', themeToApply);
		};

		applyTheme(theme);

		// Listen for system preference changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = () => {
			if (theme === 'system') applyTheme('system');
		};
		mediaQuery.addEventListener('change', handleChange);

		// Cleanup event listener on unmount
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [theme, isLoading]);
}

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
