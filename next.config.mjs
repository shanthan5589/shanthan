// @ts-check

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/mesoGPT",
        destination: "/mesoGPT/index.html",
      },
    ];
  },
};

export default config;
