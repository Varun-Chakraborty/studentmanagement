import { Student } from '@prisma/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StudentsState {
	students: Student[];
	status: 'loading' | 'idle' | 'failed';
}

const initialState: StudentsState = {
	students: [],
	status: 'idle'
};

export const studentSlice = createSlice({
	name: 'students',
	initialState,
	reducers: {
		appendStudents: function (
			state,
			action: PayloadAction<StudentsState['students']>
		) {
			return {
				students: [...state.students, ...action.payload],
				status: 'idle'
			};
		},
		appendStudent: function (
			state,
			action: PayloadAction<StudentsState['students'][0]>
		) {
			return { students: [...state.students, action.payload], status: 'idle' };
		},
		setStatus: function (
			state,
			action: PayloadAction<StudentsState['status']>
		) {
			state.status = action.payload;
		}
	}
});
