/**
 * Authentication utilities
 * TODO: Replace with actual auth provider (e.g., Lucia, Auth.js)
 */

export const getCurrentUserId = (): string => {
	// Temporary: hard-coded user ID
	// In production, extract from session/JWT
	return 'user-1';
};

export const getCurrentUserEmail = (): string => {
	// Temporary: hard-coded email
	return 'user@example.com';
};
