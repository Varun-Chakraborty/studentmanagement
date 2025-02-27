import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/utils/jwt';

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const skip = searchParams.get('skip');
	const take = searchParams.get('take');
	const token = (await cookies()).get('token');
	const currentUser = token && verifyToken(token.value);
	if (!currentUser)
		return NextResponse.json({ message: 'Not logged in' }, { status: 401 });

	const users = await prisma.user.findMany({
		where: {
			NOT: {
				OR: [{ username: currentUser.username }, { role: 'SUPER_ADMIN' }]
			}
		},
		omit: { password: true },
		skip: Number(skip ?? 0),
		take: Number(take ?? 50)
	});
	return NextResponse.json({ users }, { status: 200 });
}

import { hashPassword } from '@/lib/utils/password';

export async function POST(req: NextRequest) {
	const { username, password, role } = await req.json();
	if (!username || !password || !role) {
		return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
	}
	const user = await prisma.user.create({
		data: {
			username,
			password: await hashPassword(password),
			role: role
		}
	});
	return NextResponse.json(
		{ user: { id: user.id, username: user.username, role: user.role } },
		{ status: 200 }
	);
}

export async function PUT(req: NextRequest) {
	const token = (await cookies()).get('token');
	const currentUser = token && verifyToken(token.value);
	if (!currentUser)
		return NextResponse.json({ message: 'Not logged in' }, { status: 401 });

	if (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')
		return NextResponse.json({ message: 'Not authorized' }, { status: 403 });

	const { username, password, role } = await req.json();

	const user = await prisma.user.update({
		where: { username },
		data: { password: await hashPassword(password), role: role }
	});

	if (!user)
		return NextResponse.json({ message: 'User not found' }, { status: 404 });

	return NextResponse.json(
		{ message: 'Data update successful' },
		{ status: 200 }
	);
}

export async function DELETE(req: NextRequest) {
	const token = (await cookies()).get('token');
	const currentUser = token && verifyToken(token.value);
	if (!currentUser)
		return NextResponse.json({ message: 'Not logged in' }, { status: 401 });

	if (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')
		return NextResponse.json({ message: 'Not authorized' }, { status: 403 });

	const { username } = await req.json();
	const user = await prisma.user.delete({ where: { username } });
	if (!user)
		return NextResponse.json({ message: 'User not found' }, { status: 404 });
	return NextResponse.json({ message: 'User deleted' }, { status: 200 });
}

export const dynamic = "force-dynamic";
