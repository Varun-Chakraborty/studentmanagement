import { Teacher } from '@prisma/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TeachersState {
	teachers: Teacher[];
	status: 'loading' | 'idle' | 'failed';
}

const initialState: TeachersState = {
	teachers: [],
	status: 'idle'
};

export const teachersSlice = createSlice({
	name: 'teachers',
	initialState,
	reducers: {
		appendTeachers: function (
			state,
			action: PayloadAction<TeachersState['teachers']>
		) {
			return {
				teachers: [...state.teachers, ...action.payload],
				status: 'idle'
			};
		},
		appendTeacher: function (
			state,
			action: PayloadAction<TeachersState['teachers'][0]>
		) {
			return { teachers: [...state.teachers, action.payload], status: 'idle' };
		},
		setStatus: function (
			state,
			action: PayloadAction<TeachersState['status']>
		) {
			state.status = action.payload;
		}
	}
});
