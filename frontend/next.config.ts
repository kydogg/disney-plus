import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "links.papareact.com" },
			{
				protocol: "http",
				hostname: "image.tmdb.org",
			},
		],
	},
};

export default nextConfig;
