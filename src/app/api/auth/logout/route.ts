import { verifyToken } from '@/lib/utils/jwt';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
	const cookiesList = await cookies();
	const token = cookiesList.get('token');
	if (!token) {
		return NextResponse.json({ message: 'Not logged in' }, { status: 401 });
	}
	const user = token && verifyToken(token.value);
	if (!user) {
		return NextResponse.json({ message: 'Not logged in' }, { status: 401 });
	}
	cookiesList.delete('token');
	return NextResponse.json({ message: 'Logged out' }, { status: 200 });
}
