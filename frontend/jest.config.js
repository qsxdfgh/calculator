module.exports = {
    transform: {
        '^.+\\.(t|j)sx?$': '@swc/jest',
    },
    testMatch: [
        '**/__tests__/**/*.test.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)'
    ],
}