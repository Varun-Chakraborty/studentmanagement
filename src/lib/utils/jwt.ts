import { sign, verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function createToken(payload: {
	id: string;
	username: string;
	role: string;
}) {
	return sign(payload, JWT_SECRET, {
		expiresIn: '1d'
	});
}

export function verifyToken(token: string) {
	return verify(token, JWT_SECRET) as {
		id: string;
		username: string;
		role: string;
	};
}
