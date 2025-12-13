import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import * as schema from './db/schema';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			user: schema.users,
			session: schema.sessions,
			account: schema.oauthAccounts,
			verification: schema.verifications
		}
	}),
	plugins: [sveltekitCookies(getRequestEvent)],
	emailAndPassword: {
		enabled: true
	}
});

/**
 * Get user ID from request headers
 * Throws error if no session found
 */
export async function getUserIdFromRequest(headers: Headers): Promise<string> {
	const session = await auth.api.getSession({ headers });
	if (!session) {
		throw new Error('Unauthorized');
	}
	return session.user.id;
}

/**
 * Get full session from request headers
 * Returns null if no session found
 */
export async function getSessionFromRequest(headers: Headers) {
	return auth.api.getSession({ headers });
}
