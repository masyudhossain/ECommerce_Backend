export default {
    testEnvironment: "node",
    verbose: true,
    testTimeout: 30000,
    setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
    testMatch: ["<rootDir>/tests/**/*.test.js"],
    transform: {
        "^.+\\.js$": "babel-jest"
    },
    moduleFileExtensions: ["js", "json"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "json", "html"]
};
