module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(vue|@vue)/)',
  ],
  moduleFileExtensions: ['js', 'vue'],
  testMatch: ['**/tests/**/*.spec.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};
