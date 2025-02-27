'use client';
import axios, { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { userSlice } from '@/lib/features';
import { User } from '@prisma/client';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';

export default function Login() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const dispatch = useAppDispatch();

	const formSchema = z.object({
		username: z.string().min(1, 'Username is required'),
		password: z.string().min(1, 'Password is required')
	});

	type FormData = z.infer<typeof formSchema>;
	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: '',
			password: ''
		}
	});

	async function onSubmit(formData: FormData) {
		setLoading(true);
		try {
			const { user } = (
				await axios.post<{
					message: string;
					user: Omit<User, 'password'>;
				}>('/api/auth/login', formData)
			).data;
			dispatch(userSlice.actions.setUser(user));
			router.push('/app');
		} catch (error) {
			if (error instanceof AxiosError)
				form.setError('root', error.response?.data ?? 'Something went wrong');
			throw error; // Rethrow all other errors
		} finally {
			setLoading(false);
		}
	}
	return (
		<main className="bg-slate-50 dark:bg-slate-900">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="h-screen flex justify-center items-center"
				>
					<Card className="w-full max-w-md">
						<CardHeader className="space-y-1">
							<CardTitle className="text-2xl font-bold">Log in</CardTitle>
							<CardDescription>
								Enter your email and password to access your account
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4 ">
							<FormField
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										{form.formState.errors.username && (
											<FormMessage>
												{form.formState.errors.username.message}
											</FormMessage>
										)}
									</FormItem>
								)}
							/>
							<FormField
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										{form.formState.errors.password && (
											<FormMessage>
												{form.formState.errors.password.message}
											</FormMessage>
										)}
									</FormItem>
								)}
							/>
							<FormMessage className="text-red-600">
								{form.formState.errors.root?.message}
							</FormMessage>
						</CardContent>
						<CardFooter>
							<Button disabled={loading} type="submit" className="w-full">
								{loading ? 'Logging in...' : 'Log In'}
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>
		</main>
	);
}
