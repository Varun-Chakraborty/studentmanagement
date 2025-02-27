'use client';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/lib/hooks';
import Link from 'next/link';

export default function Home() {
	const user = useAppSelector(state => state.user.user);
	return (
		<main className="flex flex-col items-center">
			<div className="flex justify-between items-center w-full p-2">
				<h1 className="uppercase text-3xl font-black">Student Management</h1>
				<Link href={user ? '/app' : '/login'}>
					<Button className="uppercase">
						{user ? 'Continue to app' : 'Login'}
					</Button>
				</Link>
			</div>
		</main>
	);
}
