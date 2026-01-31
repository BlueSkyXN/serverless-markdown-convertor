/**
 * Request handlers for different routes
 * @module handlers
 */

import { ROUTES, HTTP_STATUS } from './constants.js';
import { getAuthCookie, verifyPassword, isAuthenticated, createJsonResponse } from './auth.js';
import { validateFileTypes, logFileInfo, prepareFilesForConversion, formatConversionResults } from './converter.js';

/**
 * Handle GET requests for static files and redirects
 * @param {Request} request - The request object
 * @param {object} env - Environment bindings (including ASSETS)
 * @returns {Promise<Response>} - The response
 */
export async function handleGetRequest(request, env) {
	const url = new URL(request.url);
	const authCookie = getAuthCookie(request);

	// Redirect to login if accessing home without auth cookie
	if (url.pathname === ROUTES.HOME && !authCookie) {
		return Response.redirect(new URL(ROUTES.LOGIN, request.url), HTTP_STATUS.FOUND);
	}

	// Serve static assets
	return env.ASSETS.fetch(request);
}

/**
 * Handle user authentication requests
 * @param {Request} request - The request object
 * @param {object} env - Environment bindings (including PASSWORD)
 * @returns {Promise<Response>} - The response with authentication result
 */
export async function handleAuthRequest(request, env) {
	const { password } = await request.json();
	const isValid = verifyPassword(password, env.PASSWORD);

	return createJsonResponse({ success: isValid }, isValid ? HTTP_STATUS.OK : HTTP_STATUS.UNAUTHORIZED);
}

/**
 * Handle user logout requests
 * @returns {Response} - The response with cleared cookie
 */
export function handleLogoutRequest() {
	return createJsonResponse(
		{ success: true },
		HTTP_STATUS.OK,
		{
			'Set-Cookie': 'auth=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
		}
	);
}

/**
 * Handle file conversion requests
 * @param {Request} request - The request object
 * @param {object} env - Environment bindings (including AI and PASSWORD)
 * @param {boolean} [isRawApi=false] - Whether to return raw API response format
 * @returns {Promise<Response>} - The response with conversion results
 */
export async function handleConversionRequest(request, env, isRawApi = false) {
	// Verify authentication
	if (!isAuthenticated(request, env.PASSWORD)) {
		return createJsonResponse({ error: '请先登录' }, HTTP_STATUS.UNAUTHORIZED);
	}

	try {
		const formData = await request.formData();
		const files = formData.getAll('files');

		// Validate files exist
		if (!files || files.length === 0) {
			return createJsonResponse({ error: '请上传文件' }, HTTP_STATUS.BAD_REQUEST);
		}

		// Validate file types
		const validationError = validateFileTypes(files);
		if (validationError) {
			return validationError;
		}

		// Log file information
		logFileInfo(files);

		// Prepare files for conversion
		const fileList = prepareFilesForConversion(files);

		// Convert files using AI binding
		const results = await env.AI.toMarkdown(fileList);

		// Return raw or formatted results
		if (isRawApi) {
			return createJsonResponse(results);
		}

		return createJsonResponse(formatConversionResults(results, files));
	} catch (error) {
		console.error(`[${new Date().toISOString()}] 转换过程中发生错误: ${error.message}`);
		return createJsonResponse({ error: error.message }, HTTP_STATUS.INTERNAL_SERVER_ERROR);
	}
}

