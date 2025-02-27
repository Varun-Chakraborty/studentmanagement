import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/db';

export async function GET(req: NextRequest) {
	// check query params
	const searchParams = req.nextUrl.searchParams;
	const skip = searchParams.get('skip');
	const take = searchParams.get('take');
	const teachers = await prisma.teacher.findMany({
		skip: Number(skip ?? 0),
		take: Number(take ?? 50)
	});
	return NextResponse.json({ teachers }, { status: 200 });
}

export const dynamic = "force-dynamic";
