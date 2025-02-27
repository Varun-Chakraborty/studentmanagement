'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Plus, Search, Edit, Trash2, Download } from 'lucide-react';
import Link from 'next/link';
import { useAppSelector } from '@/lib/hooks';

export default function StudentsPage() {
	const students = useAppSelector(state => state.students.students);
	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Students Management</h1>
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
					<CardTitle>Students</CardTitle>
					<div className="flex gap-2">
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search students..."
								className="w-[200px] pl-8"
							/>
						</div>
						<Link href="/students/new">
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
					{students.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Grade</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{students.map((student, index) => (
									<TableRow key={index}>
										<TableCell className="font-medium">
											<div className="flex items-center gap-2">
												<Avatar className="h-8 w-8">
													<AvatarImage
														src={student?.photo}
														alt={student?.name}
													/>
													<AvatarFallback>
														{student?.name?.charAt(0) || 'S'}
													</AvatarFallback>
												</Avatar>
												{student?.aadharnumber || '-'}
											</div>
										</TableCell>
										<TableCell>{student?.class || '-'}</TableCell>
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
							<p className="mb-4">No students found</p>
							<Link href="/app/students/new">
								<Button>
									<Plus className="h-4 w-4 mr-1" />
									Add Your First Student
								</Button>
							</Link>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
