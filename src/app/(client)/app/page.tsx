'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Plus } from 'lucide-react';
import Link from 'next/link';
import { UserDeleteDialog, UserManagementDialog } from '@/components/dialogs';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import axios from 'axios';
import { gamesSlice, studentSlice, teachersSlice, usersSlice } from '@/lib/features';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';

export default function App() {
	const currentUserRole = useAppSelector(state => state.user.user?.role);
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 auto-rows-[300px] gap-6">
			{(currentUserRole === 'SUPER_ADMIN' || currentUserRole === 'ADMIN') && (
				<>
					<UserPanel />
					<GamePanel />
					<TeacherPanel />
				</>
			)}
			<StudentPanel />
		</div>
	);
}

function UserPanel() {
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);
	const users = useAppSelector(state => state.users.users);
	const fetchUsers = useCallback((take?: number, skip?: number) => {
		setLoading(true);
		axios
			.get('/api/users', { params: { take, skip } })
			.then(res => dispatch(usersSlice.actions.appendUsers(res.data.users)))
			.finally(() => setLoading(false));
	}, [dispatch]);
	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle>Users</CardTitle>
				<div className="flex gap-2">
					<UserManagementDialog>
						<Button size="sm">
							<Plus className="h-4 w-4 mr-1" />
							Add New
						</Button>
					</UserManagementDialog>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => fetchUsers(users.length, 0)}
					>
						<RefreshCw className={cn('h-4 w-4', { 'animate-spin': loading })} />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="overflow-y-auto h-full">
				{users && users.length > 0 ? (
					<div className="space-y-2">
						{users.map(user => (
							<div
								key={user.id}
								className="flex justify-between items-center px-4 py-2 cursor-pointer rounded-lg border border-gray-600 hover:border-gray-400"
							>
								<span>{user.username.toLowerCase()}</span>
								<div className="flex gap-2 items-center">
									<Badge variant="secondary">
										{user.role.split('_').join(' ').toUpperCase()}
									</Badge>
									<UserManagementDialog data={user} role="Update">
										<Button variant="ghost" size="sm">
											Edit
										</Button>
									</UserManagementDialog>
									<UserDeleteDialog username={user.username}>
										<Button variant="destructive" size="sm">
											Delete
										</Button>
									</UserDeleteDialog>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-8 text-muted-foreground">
						No users found
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function GamePanel() {
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);
	const games = useAppSelector(state => state.games.games);
	const fetchGames = useCallback((take?: number, skip?: number) => {
		setLoading(true);
		axios
			.get('/api/games', { params: { take, skip } })
			.then(res => dispatch(gamesSlice.actions.appendGames(res.data.games)))
			.finally(() => setLoading(false));
	}, [dispatch]);
	useEffect(() => {
		fetchGames();
	}, [fetchGames]);
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle>Games</CardTitle>
				<div className="flex gap-2">
					<Link href="/app/games/new">
						<Button size="sm">
							<Plus className="h-4 w-4 mr-1" />
							Add New
						</Button>
					</Link>
					<Button onClick={() => fetchGames(games.length, 0)} variant="ghost" size="icon">
						<RefreshCw className={cn("h-4 w-4", { 'animate-spin': loading })} />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					{games && games.length > 0 ? (
						games.map(game => (
							<div
								key={game.id}
								className="flex justify-between items-center px-4 py-2 cursor-pointer rounded-lg border border-gray-600 hover:border-gray-400"
							>
								<span>{game.name}</span>
								<Link href={`/app/games/edit/${game.id}`}>
									<Button variant="ghost" size="sm">
										Edit
									</Button>
								</Link>
							</div>
						))
					) : (
						<div className="text-center py-8 text-muted-foreground">
							No games found
						</div>
					)}
					<Link
						href="/app/games"
						className="text-sm text-primary hover:underline block text-center mt-4"
					>
						View all games
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}

function TeacherPanel() {
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);
	const teachers = useAppSelector(state => state.teachers.teachers);
	const fetchTeachers = useCallback((take?: number, skip?: number) => {
		setLoading(true);
		axios
			.get('/api/teachers', { params: { take, skip } })
			.then(res => dispatch(teachersSlice.actions.appendTeachers(res.data.teachers)))
			.finally(() => setLoading(false));
	}, [dispatch]);
	useEffect(() => {
		fetchTeachers();
	}, [fetchTeachers]);
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle>Teachers</CardTitle>
				<div className="flex gap-2">
					<Link href="/app/teachers/new">
						<Button size="sm">
							<Plus className="h-4 w-4 mr-1" />
							Add New
						</Button>
					</Link>
					<Button onClick={() => fetchTeachers(teachers.length, 0)} variant="ghost" size="icon">
						<RefreshCw className={cn("h-4 w-4", { 'animate-spin': loading })} />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{teachers && teachers.length > 0 ? (
					<div className="space-y-2">
						{teachers.map(teacher => (
							<div
								key={teacher.id}
								className="flex justify-between items-center px-4 py-2 cursor-pointer rounded-lg border border-gray-600 hover:border-gray-400"
							>
								<span>{teacher.name}</span>
								<Link href={`/app/teachers/edit/${teacher.id}`}>
									<Button variant="ghost" size="sm">
										Edit
									</Button>
								</Link>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-8 text-muted-foreground">
						No teachers found
					</div>
				)}
				<Link
					href="/app/teachers"
					className="text-sm text-primary hover:underline block text-center mt-4"
				>
					Manage teachers
				</Link>
			</CardContent>
		</Card>
	);
}

function StudentPanel() {
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);
	const students = useAppSelector(state => state.students.students);
	const fetchStudents = useCallback((take?: number, skip?: number) => {
		setLoading(true);
		axios
			.get('/api/students', { params: { take, skip } })
			.then(res => dispatch(studentSlice.actions.appendStudents(res.data.students)))
			.finally(() => setLoading(false));
	}, [dispatch]);
	useEffect(() => {
		fetchStudents();
	}, [fetchStudents]);
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle>Students</CardTitle>
				<div className="flex gap-2">
					<Link href="/app/students/new">
						<Button size="sm">
							<Plus className="h-4 w-4 mr-1" />
							Add New
						</Button>
					</Link>
					<Button onClick={() => fetchStudents(students.length, 0)} variant="ghost" size="icon">
						<RefreshCw className={cn("h-4 w-4", { 'animate-spin': loading })} />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{students && students.length > 0 ? (
					<div className="space-y-2">
						{students.map(student => (
							<div
								key={student.id}
								className="flex justify-between items-center px-4 py-2 cursor-pointer rounded-lg border border-gray-600 hover:border-gray-400"
							>
								<span>{student.name}</span>
								<Link href={`/app/students/edit/${student.id}`}>
									<Button variant="ghost" size="sm">
										Edit
									</Button>
								</Link>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-8 text-muted-foreground">
						No students found
					</div>
				)}
				<Link
					href="/app/students"
					className="text-sm text-primary hover:underline block text-center mt-4"
				>
					Manage students
				</Link>
			</CardContent>
		</Card>
	);
}
