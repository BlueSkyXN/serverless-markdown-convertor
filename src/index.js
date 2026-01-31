/**
 * Serverless Markdown Converter Worker
 * Main entry point for the Cloudflare Worker application
 * @module index
 */

import { ROUTES, HTTP_STATUS } from './constants.js';
import { handleGetRequest, handleAuthRequest, handleLogoutRequest, handleConversionRequest } from './handlers.js';

/**
 * Main worker entry point
 * Handles all incoming HTTP requests and routes them to appropriate handlers
 */
export default {
	/**
	 * Fetch handler for the Cloudflare Worker
	 * @param {Request} request - The incoming HTTP request
	 * @param {object} env - Environment bindings (AI, ASSETS, PASSWORD)
	 * @param {object} ctx - Execution context
	 * @returns {Promise<Response>} - The HTTP response
	 */
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const method = request.method;

		try {
			// Handle GET requests (static files and redirects)
			if (method === 'GET') {
				return await handleGetRequest(request, env);
			}

			// Handle authentication
			if (method === 'POST' && url.pathname === ROUTES.AUTH) {
				return await handleAuthRequest(request, env);
			}

			// Handle logout
			if (method === 'POST' && url.pathname === ROUTES.LOGOUT) {
				return handleLogoutRequest();
			}

			// Handle file conversion (standard API)
			if (method === 'POST' && url.pathname === ROUTES.CONVERT) {
				return await handleConversionRequest(request, env, false);
			}

			// Handle file conversion (raw Cloudflare API)
			if (method === 'POST' && url.pathname === ROUTES.CF_API) {
				return await handleConversionRequest(request, env, true);
			}

			// Route not found
			return new Response('Not Found', { status: HTTP_STATUS.NOT_FOUND });
		} catch (error) {
			console.error(`[${new Date().toISOString()}] 请求处理错误: ${error.message}`);
			return new Response(JSON.stringify({ error: '服务器内部错误' }), {
				status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
				headers: { 'Content-Type': 'application/json' },
			});
		}
	},
};
