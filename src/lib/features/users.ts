import { User } from '@prisma/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UsersState {
	users: Omit<User, 'password'>[];
	status: 'loading' | 'idle' | 'failed';
}

const initialState: UsersState = {
	users: [],
	status: 'idle'
};

export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		appendUsers: function (state, action: PayloadAction<UsersState['users']>) {
			const users = action.payload;
			// find users with unique ids
			const uniqueUsers = users.filter(
				(user, index) =>
					users.findLastIndex(u => u.id === user.id) === index &&
					state.users.findLastIndex(u => u.id === user.id) === -1
			);
			return { users: [...state.users, ...uniqueUsers], status: 'idle' };
		},
		appendUser: function (
			state,
			action: PayloadAction<UsersState['users'][0]>
		) {
			return { users: [...state.users, action.payload], status: 'idle' };
		},
		removeUser: function (state, action: PayloadAction<{ username: string }>) {
			return {
				users: state.users.filter(u => u.username !== action.payload.username),
				status: 'idle'
			};
		},
		setStatus: function (state, action: PayloadAction<UsersState['status']>) {
			state.status = action.payload;
		}
	}
});
