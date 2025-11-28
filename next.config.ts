import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: 'standalone',
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "placehold.co",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "picsum.photos",
				port: "",
				pathname: "/**",
			},
		],
	},
	serverExternalPackages: [
		'genkit',
		'@genkit-ai/core',
		'firebase-admin',
		'@opentelemetry/api',
		'express',
    'inngest'
	]
};

export default nextConfig;
