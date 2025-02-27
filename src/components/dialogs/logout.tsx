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
import { userSlice } from '@/lib/features';

export function LogoutDialog({ children }: { children: React.ReactNode }) {
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
					<DialogDescription>You are about to log out.</DialogDescription>
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
								.post('/api/auth/logout')
								.then(() => {
									router.push('/');
									dispatch(userSlice.actions.clearUser());
								})
								.catch(error => {
									router.push('/');
									console.error('Error logging out: ', error);
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
