'use client';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/lib/hooks';
import { Download, Edit, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function TeachersPage() {
	const teachers = useAppSelector(state => state.teachers.teachers);
	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Teachers Management</h1>
				<div className="flex gap-2">
					<Button variant="outline" size="sm">
						<Download className="h-4 w-4 mr-1" />
						Export
					</Button>
					<Link href="/app">
						<Button variant="outline" size="sm">
							Back to Dashboard
						</Button>
					</Link>
				</div>
			</div>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle>Teachers</CardTitle>
					<div className="flex gap-2">
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search teachers..."
								className="w-[200px] pl-8"
							/>
						</div>
						<Link href="/teachers/new">
							<Button>
								<Plus className="h-4 w-4 mr-1" />
								Add New
							</Button>
						</Link>
						<Button variant="ghost" size="icon">
							<RefreshCw className="h-4 w-4" />
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{teachers.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Photo</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{teachers.map((teacher, index) => (
									<TableRow key={index}>
										<TableCell className="font-medium">
											<div className="flex items-center gap-2">
												<Avatar className="h-8 w-8">
													<AvatarImage
														src={teacher?.photo}
														alt={teacher?.name}
													/>
													<AvatarFallback>
														{teacher?.name?.charAt(0) || 'S'}
													</AvatarFallback>
												</Avatar>
												{teacher?.aadharnumber || '-'}
											</div>
										</TableCell>
										<TableCell>{teacher?.name || '-'}</TableCell>
										<TableCell>
											<Badge
												variant="outline"
												className="bg-green-100 text-green-800 hover:bg-green-100"
											>
												Active
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button variant="ghost" size="sm">
													<Edit className="h-4 w-4 mr-1" />
													Edit
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="text-red-500 hover:text-red-700 hover:bg-red-100"
												>
													<Trash2 className="h-4 w-4 mr-1" />
													Delete
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<div className="text-center py-12 text-muted-foreground">
							<p className="mb-4">No teachers found</p>
							<Link href="/app/teachers/new">
								<Button>
									<Plus className="h-4 w-4 mr-1" />
									Add Your First Teacher
								</Button>
							</Link>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
