module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: [
        '@testing-library/jest-dom',
        '<rootDir>/jest-setup.js'  // Add this line
    ],
    testMatch: [
        "**/src/**/*.{test,spec}.{js,jsx,ts,tsx}",
        "**/__tests__/**/*.{js,jsx,ts,tsx}"
    ],
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest"
    },
    testPathIgnorePatterns: ['/node_modules/', '/build/'],
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
        // Mock image imports
        "\\.(jpg|jpeg|png|gif|ico|svg)$": "<rootDir>/__mocks__/fileMock.js",
        // Mock video and audio imports
        "\\.(mp4|webm|ogg|mp3|wav|flac|aac)$": "<rootDir>/__mocks__/fileMock.js"
    },
};