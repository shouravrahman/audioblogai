import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    webpack: (
        config,
        { isServer }
    ) => {
        if (isServer) {
            // express is a dependency of genkit, but not used by the app server
            // we can mark it as external to avoid bundling it
            config.externals.push('express');
        }
        return config
    },
};

export default nextConfig;
