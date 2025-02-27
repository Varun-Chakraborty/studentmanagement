'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { usersSlice } from '@/lib/features';

export function UserDeleteDialog({ username, children }: { username: string; children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const dispatch = useAppDispatch();
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Are you sure?</DialogTitle>
					<DialogDescription>You are about to delete <span className='font-bold bg-gray-200 dark:bg-gray-800 px-2 rounded-lg'>{username}</span>.</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						disabled={loading}
						onClick={() => {
							setLoading(true);
							axios
								.delete('/api/users', { data: { username } })
								.then(() => {
									router.push('/app');
									dispatch(usersSlice.actions.removeUser({ username }));
								})
								.catch(error => {
									router.push('/');
									console.error('Error deleting user: ', error);
								})
								.finally(() => {
									setOpen(false);
									setLoading(false);
								});
						}}
					>
						{loading ? <LoaderCircle className="animate-spin" /> : 'Logout'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
