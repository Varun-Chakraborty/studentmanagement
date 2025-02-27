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
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '../ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { isAxiosError } from 'axios';
import { User } from '@prisma/client';
import { useAppDispatch } from '@/lib/hooks';
import { usersSlice } from '@/lib/features';
import { Loader } from 'lucide-react';

export function UserManagementDialog({
	data,
	role = 'Create',
	children
}: {
	data?: Omit<User, 'password'>;
	role?: 'Create' | 'Update';
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(false);
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(false);

	const formSchema = z.object({
		username: z.string().min(1, 'Username is required'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters long')
			.max(32, 'Password must be at most 32 characters long'),
		role: z.string({ required_error: 'Role is required' })
	});

	type FormData = z.infer<typeof formSchema>;

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: role === 'Update' ? data?.username : '',
			password: '',
			role: role === 'Update' ? data?.role : undefined
		}
	});

	async function createUser(data: FormData) {
		return axios.post<{ user: Omit<User, 'password'> }>('/api/user', data);
	}

	async function updateUser(data: FormData) {
		return axios.put<{ user: Omit<User, 'password'> }>('/api/user', data);
	}

	async function handleSubmit(data: FormData) {
		try {
			setLoading(true);
			const res = role === 'Update' ? await updateUser(data) : await createUser(data);
			if (role === 'Update') dispatch(usersSlice.actions.removeUser({ username: data.username }));
			const user = res.data.user;
			dispatch(usersSlice.actions.appendUser(user));
			setOpen(false);
			form.reset();
		} catch (error) {
			if (isAxiosError(error))
				form.setError('root', error.response?.data ?? 'Something went wrong');
			throw error; // Rethrow all other errors
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={state => {
				setOpen(state);
				// clear errors when dialog is closed
				form.clearErrors();
			}}
		>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<DialogHeader>
							<DialogTitle>
								{role === 'Update' ? 'Edit User' : 'Add New User'}
							</DialogTitle>
							<DialogDescription>
								{role === 'Update'
									? 'Edit user details'
									: 'Create a new user account'}
								. Click save when you&apos;re done.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<FormField
								name="username"
								control={form.control}
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="text-right">
											Username
										</FormLabel>
										<div className="col-span-3">
											<FormControl>
												<Input {...field} disabled={role === 'Update'} />
											</FormControl>
											{form.formState.errors.username && (
												<FormMessage className="col-span-3">
													{form.formState.errors.username.message}
												</FormMessage>
											)}
										</div>
									</FormItem>
								)}
							/>
							<FormField
								name="password"
								control={form.control}
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel htmlFor="email" className="text-right">
											Password
										</FormLabel>
										<div className="col-span-3">
											<FormControl>
												<Input {...field} type="password" />
											</FormControl>
											{form.formState.errors.password && (
												<FormMessage className="col-span-3">
													{form.formState.errors.password.message}
												</FormMessage>
											)}
										</div>
									</FormItem>
								)}
							/>
							<FormField
								name="role"
								control={form.control}
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel htmlFor="role" className="text-right">
											Role
										</FormLabel>
										<div className="col-span-3">
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select role" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="ADMIN">Admin</SelectItem>
													<SelectItem value="SUB_ADMIN">Sub Admin</SelectItem>
												</SelectContent>
											</Select>
											{form.formState.errors.role && (
												<FormMessage className="col-span-3">
													{form.formState.errors.role.message}
												</FormMessage>
											)}
										</div>
									</FormItem>
								)}
							/>
						</div>
						<FormMessage className="col-span-4 text-center">
							{form.formState.errors.root && form.formState.errors.root.message}
						</FormMessage>
						<DialogFooter>
							<Button disabled={loading} type="submit">{loading ? <Loader className="animate-spin" /> : 'Save User'}</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
