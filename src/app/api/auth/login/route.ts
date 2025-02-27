import { comparePassword, hashPassword } from '@/lib/utils/password';
import { createToken } from '@/lib/utils/jwt';
import { prisma } from '@/lib/utils/db';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
	const { username, password } = await req.json();
	const cookiesList = await cookies();

	if (!username || !password) {
		return NextResponse.json(
			{ message: 'Missing credentials' },
			{ status: 400 }
		);
	}

	// Find user in DB
	let user = await prisma.user.findUnique({
		where: { username }
	});

	if (!user && username !== 'admin')
		return NextResponse.json(
			{ message: 'Invalid credentials' },
			{ status: 401 }
		);
	else if (user) {
		// Compare password
		const isPasswordValid = await comparePassword(password, user.password);

		if (!isPasswordValid)
			return NextResponse.json(
				{ message: 'Invalid credentials' },
				{ status: 401 }
			);
	} else if (password !== process.env.ADMIN_PASSWORD) {
		return NextResponse.json(
			{ message: 'Invalid credentials' },
			{ status: 401 }
		);
	} else {
		user = await prisma.user.create({
			data: {
				username,
				password: await hashPassword(password),
				role: 'SUPER_ADMIN'
			}
		});
	}

	const userInfo = {
		id: user.id,
		username: user.username,
		role: user.role
	};

	// Set JWT cookie
	const token = createToken(userInfo);
	cookiesList.set('token', token, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 24 * 60 * 60
	});

	return NextResponse.json(
		{ message: 'Login successful', user: userInfo },
		{ status: 200 }
	);
}

export const dynamic = "force-dynamic";
