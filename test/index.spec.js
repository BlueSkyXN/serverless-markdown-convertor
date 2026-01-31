import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect, beforeEach } from 'vitest';
import worker from '../src';

// Mock AI binding
const mockEnv = {
	...env,
	AI: {
		toMarkdown: async (files) => {
			return files.map((file) => ({
				data: `# Markdown for ${file.name}`,
			}));
		},
	},
	ASSETS: {
		fetch: async (request) => {
			return new Response('OK', { status: 200 });
		},
	},
};

describe('Serverless Markdown Converter', () => {
	let ctx;

	beforeEach(() => {
		ctx = createExecutionContext();
	});

	describe('GET requests', () => {
		it('should redirect to login when accessing home without auth cookie', async () => {
			const request = new Request('http://example.com/');
			const response = await worker.fetch(request, mockEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(302);
			expect(response.headers.get('Location')).toContain('/login');
		});

		it('should serve static assets for other paths', async () => {
			const request = new Request('http://example.com/login');
			const response = await worker.fetch(request, mockEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(200);
		});
	});

	describe('POST /auth', () => {
		it('should return success when no password is set', async () => {
			const request = new Request('http://example.com/auth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password: 'any-password' }),
			});

			const testEnv = { ...mockEnv, PASSWORD: undefined };
			const response = await worker.fetch(request, testEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.success).toBe(true);
		});

		it('should return 401 for invalid password', async () => {
			const request = new Request('http://example.com/auth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password: 'wrong-password' }),
			});

			const testEnv = { ...mockEnv, PASSWORD: 'correct-password' };
			const response = await worker.fetch(request, testEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(401);
			const data = await response.json();
			expect(data.success).toBe(false);
		});

		it('should return 200 for valid password', async () => {
			const request = new Request('http://example.com/auth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password: 'correct-password' }),
			});

			const testEnv = { ...mockEnv, PASSWORD: 'correct-password' };
			const response = await worker.fetch(request, testEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.success).toBe(true);
		});
	});

	describe('POST /logout', () => {
		it('should clear auth cookie', async () => {
			const request = new Request('http://example.com/logout', {
				method: 'POST',
			});

			const response = await worker.fetch(request, mockEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(200);
			const setCookie = response.headers.get('Set-Cookie');
			expect(setCookie).toContain('auth=');
			expect(setCookie).toContain('Max-Age=0');
		});
	});

	describe('POST /convert', () => {
		it('should return 401 when not authenticated', async () => {
			const formData = new FormData();
			const request = new Request('http://example.com/convert', {
				method: 'POST',
				body: formData,
			});

			const testEnv = { ...mockEnv, PASSWORD: 'test-password' };
			const response = await worker.fetch(request, testEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(401);
			const data = await response.json();
			expect(data.error).toBe('请先登录');
		});

		it('should return 400 when no files uploaded', async () => {
			const formData = new FormData();
			const request = new Request('http://example.com/convert', {
				method: 'POST',
				headers: { Cookie: 'auth=test-password' },
				body: formData,
			});

			const testEnv = { ...mockEnv, PASSWORD: 'test-password' };
			const response = await worker.fetch(request, testEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.error).toBe('请上传文件');
		});
	});

	describe('Error handling', () => {
		it('should return 404 for unknown routes', async () => {
			const request = new Request('http://example.com/unknown', {
				method: 'POST',
			});

			const response = await worker.fetch(request, mockEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(404);
		});
	});
});


