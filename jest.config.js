module.exports = {
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
      'node_modules/(?!(axios|@mui|x-charts|d3-shape)/)', // Explicitly transform certain node_modules
      '/node_modules/(?!@mui/x-charts|@mui/material|@babel/runtime|d3-(color|format|interpolate|scale|shape|time|time-format|path|array)|internmap)',
    ],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    testEnvironment: 'jsdom',
  };
  