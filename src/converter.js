import { SUPPORTED_MIME_TYPES, HTTP_STATUS } from './constants.js';
import { createJsonResponse } from './auth.js';

/**
 * File conversion utility functions
 */

/**
 * Validate file types
 * @param {File[]} files - Array of files to validate
 * @returns {object|null} - Error response or null if valid
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
 * Log file information
 * @param {File[]} files - Array of files to log
 */
export function logFileInfo(files) {
	console.log(`[${new Date().toISOString()}] 收到 ${files.length} 个文件`);
	files.forEach((file) => {
		console.log(`- ${file.name}, 大小: ${file.size} 字节, 类型: ${file.type}`);
	});
}

/**
 * Prepare files for conversion
 * @param {File[]} files - Array of files to prepare
 * @returns {object[]} - Array of file objects ready for conversion
 */
export function prepareFilesForConversion(files) {
	return files.map((file) => ({
		name: file.name,
		blob: file,
	}));
}

/**
 * Format conversion results
 * @param {object[]} results - Raw conversion results
 * @param {File[]} files - Original files array
 * @returns {object} - Formatted results object
 */
export function formatConversionResults(results, files) {
	return {
		markdowns: results.map((result, index) => ({
			name: files[index].name,
			markdown: result.data,
		})),
	};
}
