// @ts-check

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/mesoGPT",
        destination:
          "https://medium.com/@shanthan1000/mesogpt-building-and-training-large-language-models-from-scratch-a0a514cb7a3f?sharedUserId=shanthan1000",
        permanent: true,
      },
    ];
  },
};

export default config;
