/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile our workspace SDK (TS source, no build step).
  transpilePackages: ["@goldem/sdk"],
  // Keep the heavy, Node-only 0G SDKs out of the bundle — run them in the server runtime.
  experimental: {
    serverComponentsExternalPackages: [
      "@0gfoundation/0g-storage-ts-sdk",
      "@0gfoundation/0g-compute-ts-sdk",
      "openai",
    ],
  },
};

export default nextConfig;
