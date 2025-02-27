'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ImageDropzone from '@/components/image-dropzone';
import { put } from '@vercel/blob';

// Maximum file size: 500KB
const MAX_FILE_SIZE = 500 * 1024;
// Accepted image types
const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp'
];
// Image dimensions
const MIN_WIDTH = 200;
const MIN_HEIGHT = 200;
const MAX_WIDTH = 1000;
const MAX_HEIGHT = 1000;

const formSchema = z.object({
	aadharnumber: z
		.string()
		.min(16, {
			message: 'Aadhar number must be 16 digits.'
		})
		.max(16, {
			message: 'Aadhar number must be 16 digits.'
		}),
	name: z.string().min(1, {
		message: 'First name is required.'
	}),
	class: z.string({ required_error: 'Class is required.' }),
	srnumber: z.string().min(1, { message: 'SR number is required.' }),
	dateOfBirth: z.date({ required_error: 'Date of birth is required.' }),
	age: z.number(),
	fathersName: z.string().min(1, {
		message: "Father's name is required."
	}),
	schoolName: z.string().min(1, {
		message: 'School name is required.'
	}),
	photo: z.any({ required_error: 'Photo is required.' }),
	mobileNumber: z
		.string()
		.min(10, {
			message: 'Mobile number must be 10 digits.'
		})
		.max(10, {
			message: 'Mobile number must be 10 digits.'
		})
});

export default function NewStudentPage() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const router = useRouter();
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [uploadStatus, setUploadStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	type FormData = z.infer<typeof formSchema>;

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema)
	});

	const handleImageDrop = async (
		acceptedFiles: File[],
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onChange: (value: any) => void
	) => {
		const file = acceptedFiles[0];

		if (!file) return;

		// Reset states
		setUploadStatus('loading');
		setErrorMessage(null);

		// Validate file size
		if (file.size > MAX_FILE_SIZE) {
			setErrorMessage(
				`File size too large. Maximum size is ${MAX_FILE_SIZE / 1024}KB.`
			);
			setUploadStatus('error');
			return;
		}

		// Validate file type
		if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
			setErrorMessage(
				'Invalid file type. Please upload a JPEG, PNG, or WebP image.'
			);
			setUploadStatus('error');
			return;
		}

		// Validate image dimensions
		const image = new Image();
		const objectUrl = URL.createObjectURL(file);

		image.onload = () => {
			URL.revokeObjectURL(objectUrl);

			if (image.width < MIN_WIDTH || image.height < MIN_HEIGHT) {
				setErrorMessage(
					`Image dimensions too small. Minimum size is ${MIN_WIDTH}x${MIN_HEIGHT}px.`
				);
				setUploadStatus('error');
				return;
			}

			if (image.width > MAX_WIDTH || image.height > MAX_HEIGHT) {
				setErrorMessage(
					`Image dimensions too large. Maximum size is ${MAX_WIDTH}x${MAX_HEIGHT}px.`
				);
				setUploadStatus('error');
				return;
			}

			// All validations passed
			setAvatarPreview(objectUrl);
			setUploadStatus('success');
			onChange(file); // Update the form value
		};

		image.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			setErrorMessage('Error loading image. Please try another file.');
			setUploadStatus('error');
		};

		image.src = objectUrl;
	};

	const onSubmit = async (data: FormData) => {
		// In a real application, you would upload the avatar file to a storage service
		// and save the student data to your database

		data.photo = (
			await put(`/pfp/${crypto.randomUUID()}`, data.photo, { access: 'public' })
		).url;
		console.log('Form values:', data);

		// Simulate API call
		// await new Promise(resolve => setTimeout(resolve, 1000));

		// Redirect to students list
		// router.push('/app/students');
	};

	return (
		<div className="container mx-auto py-6">
			<div className="flex items-center mb-6">
				<Link href="/app/students">
					<Button variant="ghost" size="sm" className="mr-4">
						<ArrowLeft className="h-4 w-4 mr-1" />
						Back to Students
					</Button>
				</Link>
				<h1 className="text-2xl font-bold">Add New Student</h1>
			</div>

			<Card className="max-w-4xl mx-auto">
				<CardHeader>
					<CardTitle>Student Information</CardTitle>
					<CardDescription>
						Enter the student details and upload a profile picture.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<div className="flex flex-col md:flex-row gap-8">
								<div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
									<div className="text-center">
										<h3 className="text-base font-medium">Student Avatar</h3>
										<p className="text-sm text-muted-foreground">
											Drag & drop or click to upload
										</p>
									</div>

									<div className="w-full max-w-[250px]">
										<FormField
											control={form.control}
											name="photo"
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<div>
															{avatarPreview ? (
																<div className="relative group">
																	<Avatar className="w-full h-auto aspect-square border-2 border-border">
																		<AvatarImage
																			src={avatarPreview}
																			alt="Preview"
																		/>
																		<AvatarFallback>
																			{form.watch('name')?.charAt(0) || 'S'}
																		</AvatarFallback>
																	</Avatar>
																	<div
																		className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
																		onClick={() => {
																			field.onChange(undefined);
																			setAvatarPreview(null);
																			setUploadStatus('idle');
																		}}
																	>
																		<Button
																			variant="ghost"
																			className="text-white"
																		>
																			Change
																		</Button>
																	</div>
																</div>
															) : (
																<ImageDropzone
																	onDrop={files =>
																		handleImageDrop(files, field.onChange)
																	}
																	accept={ACCEPTED_IMAGE_TYPES}
																	maxSize={MAX_FILE_SIZE}
																/>
															)}
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{uploadStatus === 'loading' && (
										<div className="flex items-center text-muted-foreground">
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Processing image...
										</div>
									)}

									{uploadStatus === 'success' && (
										<div className="flex items-center text-green-600">
											<CheckCircle className="h-4 w-4 mr-2" />
											Image uploaded successfully
										</div>
									)}

									{uploadStatus === 'error' && errorMessage && (
										<Alert variant="destructive" className="mt-2">
											<AlertCircle className="h-4 w-4" />
											<AlertTitle>Error</AlertTitle>
											<AlertDescription>{errorMessage}</AlertDescription>
										</Alert>
									)}

									<div className="text-xs text-muted-foreground text-center">
										<p>Maximum file size: {MAX_FILE_SIZE / 1024}KB</p>
										<p>
											Dimensions: {MIN_WIDTH}x{MIN_HEIGHT}px to {MAX_WIDTH}x
											{MAX_HEIGHT}px
										</p>
										<p>Formats: JPEG, PNG, WebP</p>
									</div>
								</div>

								<div className="w-full md:w-2/3 space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Name</FormLabel>
													<FormControl>
														<Input placeholder="John Doe" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="srnumber"
											render={({ field }) => (
												<FormItem>
													<FormLabel>SR Number</FormLabel>
													<FormControl>
														<Input placeholder="xxx/xx" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="aadharnumber"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Aadhar Number</FormLabel>
													<FormControl>
														<Input
															placeholder="xxxx xxxx xxxx xxxx"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="class"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Grade</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select grade" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="k">Kindergarten</SelectItem>
															<SelectItem value="1">1st Grade</SelectItem>
															<SelectItem value="2">2nd Grade</SelectItem>
															<SelectItem value="3">3rd Grade</SelectItem>
															<SelectItem value="4">4th Grade</SelectItem>
															<SelectItem value="5">5th Grade</SelectItem>
															<SelectItem value="6">6th Grade</SelectItem>
															<SelectItem value="7">7th Grade</SelectItem>
															<SelectItem value="8">8th Grade</SelectItem>
															<SelectItem value="9">9th Grade</SelectItem>
															<SelectItem value="10">10th Grade</SelectItem>
															<SelectItem value="11">11th Grade</SelectItem>
															<SelectItem value="12">12th Grade</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="dateOfBirth"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Date of Birth</FormLabel>
													<FormControl>
														<Input
															type="date"
															{...field}
															value={field.value?.toISOString().split('T')[0]}
															onChange={e => {
																const date = new Date(e.target.value);
																//calculate age
																const today = new Date();
																const age =
																	today.getFullYear() - date.getFullYear();
																form.setValue('age', age);
																field.onChange(date);
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="age"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Age</FormLabel>
													<FormControl>
														<Input disabled {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="fathersName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Father Name</FormLabel>
													<FormControl>
														<Input placeholder="John Doe" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="schoolName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>School Name</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name="mobileNumber"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Mobile Number</FormLabel>
												<FormControl>
													<Input placeholder="1234567890" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>

							<div className="flex justify-between">
								<Link href="/app/students">
									<Button variant="outline" type="button">
										Cancel
									</Button>
								</Link>
								<Button type="submit" disabled={form.formState.isSubmitting}>
									{form.formState.isSubmitting && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Save Student
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
