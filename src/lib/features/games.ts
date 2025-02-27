import { Game } from '@prisma/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GamesState {
	games: Game[];
	status: 'loading' | 'idle' | 'failed';
}

const initialState: GamesState = {
	games: [],
	status: 'idle'
};

export const gamesSlice = createSlice({
	name: 'games',
	initialState,
	reducers: {
		appendGames: function (state, action: PayloadAction<GamesState['games']>) {
			return { games: [...state.games, ...action.payload], status: 'idle' };
		},
		appendGame: function (
			state,
			action: PayloadAction<GamesState['games'][0]>
		) {
			return { games: [...state.games, action.payload], status: 'idle' };
		},
		setStatus: function (state, action: PayloadAction<GamesState['status']>) {
			state.status = action.payload;
		}
	}
});
