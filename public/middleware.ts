// import { NextRequest, NextResponse } from 'next/server';
// import { verifyToken } from '@/lib/utils/jwt';

// export function middleware(req: NextRequest) {
//     console.log(req.nextUrl.pathname, req.cookies);
// 	const token = req.cookies.get('token')?.value;

// 	const authRoutes = ['/api/auth/login'];
// 	const protectedRoutes = ['/api/auth/logout', '/api/users', '/api/students', '/api/teachers', '/api/games', '/api/user'];

// 	const isAuthRoute = authRoutes.some(path => req.nextUrl.pathname.startsWith(path));
// 	const isProtectedRoute = protectedRoutes.some(path => req.nextUrl.pathname.startsWith(path));
//     console.log("req came till here1");

// 	let user = null;
// 	if (token) {
// 		try {
// 			user = verifyToken(token);
// 		} catch (err) {
//             console.error(err);
// 			return NextResponse.json({ message: 'Unauthorized from middleware' }, { status: 401 });
// 		}
// 	}

// 	// If logged in, prevent access to login API
// 	if (user && isAuthRoute) {
// 		return NextResponse.json({ message: 'Already logged in' }, { status: 403 });
// 	}
//     console.log("req came till here2");

// 	// If not logged in, prevent access to protected routes
// 	if (!user && isProtectedRoute) {
// 		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
// 	}

//     req.headers.set('user', JSON.stringify(user));

//     console.log("req came till here3");

// 	// Allow request to continue
// 	return NextResponse.next();
// }

// // Apply middleware to all API routes
// export const config = {
// 	matcher: '/api/:path*',
//     runtime: 'nodejs'
// };
