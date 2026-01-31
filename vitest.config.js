import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
	test: {
		poolOptions: {
			workers: {
				main: './src/index.js',
				miniflare: {
					compatibilityDate: '2024-12-01',
					compatibilityFlags: ['nodejs_compat', 'export_commonjs_default'],
				},
			},
		},
	},
});



