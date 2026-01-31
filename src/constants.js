/**
 * Application constants
 */

export const SUPPORTED_MIME_TYPES = [
	'application/pdf',
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/svg+xml',
	'text/html',
	'application/xml',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.ms-excel.sheet.macroenabled.12',
	'application/vnd.ms-excel.sheet.binary.macroenabled.12',
	'application/vnd.ms-excel',
	'application/vnd.oasis.opendocument.spreadsheet',
	'text/csv',
	'application/vnd.apple.numbers',
];

export const ROUTES = {
	HOME: '/',
	LOGIN: '/login',
	AUTH: '/auth',
	LOGOUT: '/logout',
	CONVERT: '/convert',
	CF_API: '/cf',
};

export const HTTP_STATUS = {
	OK: 200,
	FOUND: 302,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
};
