/**
 * File conversion utility functions
 * @module converter
 */

import { SUPPORTED_MIME_TYPES, HTTP_STATUS } from './constants.js';
import { createJsonResponse } from './auth.js';

/**
 * Validate that all uploaded files are of supported types
 * @param {File[]} files - Array of files to validate
 * @returns {Response|null} - Error response if validation fails, null if valid
 */
export function validateFileTypes(files) {
	for (const file of files) {
		if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
			return createJsonResponse(
				{
					error: `不支持的文件类型: ${file.name}。请上传 PDF、图片、HTML、XML、Office 文档、CSV 或 Numbers 文件。`,
				},
				HTTP_STATUS.BAD_REQUEST
			);
		}
	}
	return null;
}

/**
 * Log information about uploaded files to console
 * @param {File[]} files - Array of files to log
 */
export function logFileInfo(files) {
	console.log(`[${new Date().toISOString()}] 收到 ${files.length} 个文件`);
	files.forEach((file) => {
		console.log(`- ${file.name}, 大小: ${file.size} 字节, 类型: ${file.type}`);
	});
}

/**
 * Prepare files for the Cloudflare AI conversion API
 * @param {File[]} files - Array of files to prepare
 * @returns {object[]} - Array of file objects formatted for the API
 */
export function prepareFilesForConversion(files) {
	return files.map((file) => ({
		name: file.name,
		blob: file,
	}));
}

/**
 * Format raw conversion results into a user-friendly structure
 * @param {object[]} results - Raw conversion results from the AI API
 * @param {File[]} files - Original files array for naming
 * @returns {object} - Formatted results object with file names and markdown content
 */
export function formatConversionResults(results, files) {
	return {
		markdowns: results.map((result, index) => ({
			name: files[index].name,
			markdown: result.data,
		})),
	};
}

