/** @type {import('next').NextConfig} */
const nextConfig = {
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   config.resolve = {
  //     ...config.resolve,
  //     fallback: {
  //       fs: false,
  //       path: false,
  //       os: false,
  //       child_process: false,
  //     },
  //   };
  //   config.plugins.push(
  //     new webpack.DefinePlugin({
  //       'process.env.FLUENTFFMPEG_COV': false,
  //     })
  //   );
  //   return config;
  // },
  // experimental: {
  //   serverComponentsExternalPackages: ['speaker', 'fluent-ffmpeg', 'bindings'],
  // },
};

export default nextConfig;
