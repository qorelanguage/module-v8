import { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: ['json-summary', 'text', 'lcov'],
  testTimeout: 60000,
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^core/(.*)$': '<rootDir>/src/core/$1',
    '^global/(.*)$': '<rootDir>/src/global/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '^i18n/(.*)$': '<rootDir>/src/i18n/$1',
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['<rootDir>/src/tests/**/*.(spec|test).ts'],
};

export default config;
