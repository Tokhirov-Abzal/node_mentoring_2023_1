import type { Config } from '@jest/types';

type JestConfig = Partial<Omit<Config.ProjectConfig, 'moduleNameMapper'> & Config.GlobalConfig> & {
  preset: string;
};

const config: JestConfig = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts'],
  rootDir: './',
  roots: ['<rootDir>/src'],
  testRegex: ['.test.ts$'],
  moduleDirectories: [
    '<rootDir>/node_modules',
    '<rootDir>/node_modules/@types',
    '<rootDir>/src',
    '<rootDir>',
  ],
  verbose: true,
  collectCoverage: true,
};

export default config;
