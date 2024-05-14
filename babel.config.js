module.exports = {
    presets: [
      ['@babel/preset-env', {
        targets: {
          node: 'current', // Important for Jest to use the version of Node that is currently running
        }
      }],
      '@babel/preset-react',
      '@babel/preset-typescript', // Include this only if you're using TypeScript
    ],
    plugins: [
      '@babel/plugin-transform-runtime'
    ],
  };
  