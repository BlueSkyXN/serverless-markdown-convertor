/**
 * Authentication utility functions
 * @module auth
 */

import { HTTP_STATUS } from './constants.js';

/**
 * Get authentication cookie from request
 * @param {Request} request - The request object
 * @returns {string|null} - The authentication cookie value or null if not found
 */
export function getAuthCookie(request) {
	const cookieHeader = request.headers.get('Cookie');
	if (!cookieHeader) return null;

	const match = cookieHeader.match(/auth=([^;]+)/);
	return match ? match[1] : null;
}

/**
 * Verify if the provided password matches the environment password
 * @param {string} password - The password to verify
 * @param {string|undefined} envPassword - The environment password to check against
 * @returns {boolean} - True if password is valid or no environment password is set
 */
export function verifyPassword(password, envPassword) {
	// If no password is set in environment, allow access
	if (!envPassword) return true;

	return password === envPassword;
}

/**
 * Check if user is authenticated based on request cookie
 * @param {Request} request - The request object
 * @param {string|undefined} envPassword - The environment password
 * @returns {boolean} - True if authenticated or no password required
 */
export function isAuthenticated(request, envPassword) {
	// If no password is set, skip authentication
	if (!envPassword) return true;

	const authCookie = getAuthCookie(request);
	if (!authCookie) return false;

	return verifyPassword(authCookie, envPassword);
}

/**
 * Create a JSON response with proper headers
 * @param {object} data - The data to return in the response body
 * @param {number} [status=200] - The HTTP status code
 * @param {object} [additionalHeaders={}] - Additional headers to include
 * @returns {Response} - The response object
 */
export function createJsonResponse(data, status = HTTP_STATUS.OK, additionalHeaders = {}) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'Content-Type': 'application/json',
			...additionalHeaders,
		},
	});
}
