"use client";
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

const formSchema = z.object({
	name: z.string({
		required_error: 'Name must be at least 2 characters.'
	}),
	maxParticipants: z.number({
		required_error: 'Max participants is required.'
	}).min(1, {
		message: 'A game must have at least 1 participant.'
	})
});

export default function NewGamePage() {
	const router = useRouter();
	type FormData = z.infer<typeof formSchema>;

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema)
	});

	const onSubmit = async (data: FormData) => {
		// In a real application, you would upload the avatar file to a storage service
		// and save the student data to your database

		console.log('Form values:', data);

		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1000));

		// Redirect to students list
		router.push('/app/games');
	};

	return (
		<div className="container mx-auto py-6">
			<div className="flex items-center mb-6">
				<Link href="/app/games">
					<Button variant="ghost" size="sm" className="mr-4">
						<ArrowLeft className="h-4 w-4 mr-1" />
						Back to Games
					</Button>
				</Link>
				<h1 className="text-2xl font-bold">Add New Game</h1>
			</div>

			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle>Game Details</CardTitle>
					<CardDescription>Enter the game details.</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="grid gap-3">
										<FormLabel>Game Name</FormLabel>
										<FormControl>
											<Input placeholder="Enter game name" {...field} />
										</FormControl>
									</FormItem>
									
								)}
							/>
							<FormField
								control={form.control}
								name="maxParticipants"
								render={({ field }) => (
									<FormItem className="grid gap-3">
										<FormLabel htmlFor="category">Category</FormLabel>
										<FormControl>
											<Input placeholder="Enter category" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<div className="flex justify-between">
								<Link href="/app/games">
									<Button variant="outline">Cancel</Button>
								</Link>
								<Button>Save Game</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
