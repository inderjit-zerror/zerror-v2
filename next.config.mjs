/** @type {import('next').NextConfig} */
const nextConfig = {
  // GLSL files are imported as raw strings (Turbopack is the default bundler in Next 16).
  turbopack: {
    rules: {
      '*.{glsl,vert,frag}': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
  // Kept for `next build --webpack`.
  webpack(config) {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader'],
    });
    return config;
  },
  reactCompiler: true,
};

export default nextConfig;
