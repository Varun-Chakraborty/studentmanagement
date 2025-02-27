'use client';
import { Button } from '@/components/ui/button';
import {
	GamepadIcon,
	LayoutDashboard,
	LogOut,
	User,
	Users
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { themeSlice } from '@/lib/features';
import { LogoutDialog, SecurityDialog } from '@/components/dialogs';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const loadingStatus = useAppSelector(state => state.user.status);
	const role = useAppSelector(state => state.user.user?.role);
	const router = useRouter();
	useEffect(() => {
		console.log(role, loadingStatus);
		if (!role && loadingStatus != 'loading') router.push('/login');
	}, [role, loadingStatus, router]);
	return (
		<main className="h-screen w-screen flex">
			<div className="flex w-full min-h-screen bg-slate-100 dark:bg-slate-900">
				<LeftPanel />
				<RightPanel>{children}</RightPanel>
			</div>
		</main>
	);
}

function LeftPanel() {
	const role = useAppSelector(state => state.user.user?.role);
	return (
		<div className="w-1/6 bg-slate-200 dark:bg-slate-800 p-4 flex flex-col justify-between">
			<div className="space-y-2">
				<h2 className="text-xl font-bold mb-4">Menu</h2>
				{(role === 'SUPER_ADMIN' || role === 'ADMIN') && (
					<>
						<Link
							href="/app"
							className={"flex items-center gap-2 p-2 bg-slate-300 dark:bg-slate-700 rounded-md"}
						>
							<LayoutDashboard className="h-5 w-5" />
							<span>Dashboard</span>
						</Link>
						<Link
							href="/app/games"
							className="flex items-center gap-2 p-2 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-md"
						>
							<GamepadIcon className="h-5 w-5" />
							<span>Games</span>
						</Link>
						<Link
							href="/app/teachers"
							className="flex items-center gap-2 p-2 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-md"
						>
							<Users className="h-5 w-5" />
							<span>Teachers</span>
						</Link>
					</>
				)}
				<Link
					href="/app/students"
					className="flex items-center gap-2 p-2 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-md"
				>
					<User className="h-5 w-5" />
					<span>Students</span>
				</Link>
			</div>
			<div>
				<SecurityDialog>
					<Button className="flex items-center justify-between p-2 bg-red-100 dark:bg-red-900/20 rounded-md w-full text-white">
						<span>Security</span>
						<span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
							1 issue
						</span>
					</Button>
				</SecurityDialog>
			</div>
		</div>
	);
}

function RightPanel({ children }: { children: React.ReactNode }) {
	const username = useAppSelector(state => state.user.user?.username);
	const theme = useAppSelector(state => state.theme.theme);
	const dispatch = useAppDispatch();
	return (
		<div className="flex-1 p-6 overflow-y-auto h-full">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Dashboard</h1>
				<div className="flex gap-2">
					<Button
						onClick={() =>
							dispatch(
								themeSlice.actions.setTheme(
									theme === 'light'
										? 'dark'
										: theme === 'dark'
											? 'system'
											: 'light'
								)
							)
						}
						variant="outline"
						size="sm"
					>
						{theme.toUpperCase()}
					</Button>
					<LogoutDialog>
						<Button variant="outline" size="sm">
							<LogOut className="h-4 w-4 mr-1" />
							{username?.toUpperCase() ?? 'Not Logged In'}
						</Button>
					</LogoutDialog>
				</div>
			</div>
			{children}
		</div>
	);
}
