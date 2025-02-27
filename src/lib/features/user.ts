import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@prisma/client';

interface UserState {
	user: Omit<User, 'password'> | undefined;
	status: 'loading' | 'idle' | 'failed';
}

const initialState: UserState = { user: undefined, status: 'loading' };

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: function (_, action: PayloadAction<Omit<User, 'password'>>) {
			return { user: action.payload, status: 'idle' };
		},
		clearUser: function (state) {
			state.user = undefined;
			state.status = 'idle';
		},
		setStatus: function (state, action: PayloadAction<UserState['status']>) {
			state.status = action.payload;
		}
	}
});
