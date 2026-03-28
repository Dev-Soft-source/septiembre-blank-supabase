module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/audit'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/audit/setup.ts'],
  testTimeout: 30000,
  collectCoverage: true,
  coverageDirectory: 'coverage/audit',
  coverageReporters: ['text', 'json', 'html'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/audit/setup.ts',
    '/tests/audit/jest.config.js'
  ],
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
};