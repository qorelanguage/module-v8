import { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: ['json-summary', 'text', 'lcov'],
  testTimeout: 60000,
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^core/(.*)$': '<rootDir>/core/$1',
    '^global/(.*)$': '<rootDir>/global/$1',
    '^src/(.*)$': '<rootDir>/$1',
    '^i18n/(.*)$': '<rootDir>/i18n/$1',
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['<rootDir>/**/*.(spec|test).ts'],
};

export default config;
