import { verifyToken } from '@/lib/utils/jwt';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
	const token = (await cookies()).get('token');
	const user = token && verifyToken(token.value);
	if (!user)
		return NextResponse.json(
			{ user: null, message: 'Not logged in' },
			{ status: 401 }
		);
	return NextResponse.json(
		{ user: { id: user.id, username: user.username, role: user.role } },
		{ status: 200 }
	);
}

export const dynamic = "force-dynamic";
