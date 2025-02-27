'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils/cn';

export function SecurityDialog({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Security Issue</DialogTitle>
					<DialogDescription>
						Please resolve following security issues.
					</DialogDescription>
				</DialogHeader>
				<Element
					title="Reset Password"
					description="You are using default password. Please reset your password."
					priority="High"
				/>
			</DialogContent>
		</Dialog>
	);
}

function Element({
	title,
	description,
	priority
}: {
	title: string;
	description: string;
	priority: 'Low' | 'Medium' | 'High';
}) {
	return (
		<Button className="block h-fit bg-transparent hover:bg-accent text-current space-y-2">
			<div className="flex justify-between items-center">
				{title}
				<Badge
					className={cn('text-white', {
						'bg-red-700': priority === 'High',
						'bg-yellow-700': priority === 'Medium',
						'bg-green-700': priority === 'Low'
					})}
				>
					Priority: {priority}
				</Badge>
			</div>
			<DialogDescription className="w-full text-wrap text-left">
				{description}
			</DialogDescription>
		</Button>
	);
}
