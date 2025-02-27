'use client';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	name: z.string({
		required_error: 'Name must be at least 2 characters.'
	}),
	category: z.string({
		required_error: 'Category must be at least 2 characters.'
	})
});

export default function NewTeacherPage() {
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
				<Link href="/app/teachers">
					<Button variant="ghost" size="sm" className="mr-4">
						<ArrowLeft className="h-4 w-4 mr-1" />
						Back to Teachers
					</Button>
				</Link>
				<h1 className="text-2xl font-bold">Add New Teacher</h1>
			</div>

			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle>Teacher Details</CardTitle>
					<CardDescription>Enter the teacher details.</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								name="name"
								control={form.control}
								render={() => (
									<FormItem className="grid gap-3">
										<FormLabel>Game Name</FormLabel>
										<FormControl>
											<Input id="name" placeholder="Enter game name" />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								name="category"
								control={form.control}
								render={() => (
									<FormItem className="grid gap-3">
										<FormLabel>Game Category</FormLabel>
										<FormControl>
											<Input id="category" placeholder="Enter game category" />
										</FormControl>
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Link href="/app/games">
						<Button variant="outline">Cancel</Button>
					</Link>
					<Button>Save Game</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
