import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    testMatch: ['**/src/**/*.test.ts'],
    moduleNameMapper: {
        '^@root/(.*)$': '<rootDir>/$1',
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.jest.json'
        }
    }
};

export default config;
