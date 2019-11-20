module.exports = {
    reporters: [ 'default', 'jest-junit' ],
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy'
    },
    snapshotSerializers: [ 'enzyme-to-json/serializer' ],
    roots: [
        '<rootDir>/src/test/javascript'
    ],
    testMatch: [
        '**/*.test.js?(x)'
    ],
    collectCoverage: true,
    coverageReporters: [
        'lcov'
    ],
    testEnvironment: 'configured-custom-test-environment',
    collectCoverageFrom: [
        '<rootDir>/src/**/*.{js,jsx}'
    ],
    setupFilesAfterEnv: [
        '<rootDir>/src/test/javascript/setup-tests.js'
    ],
    "moduleFileExtensions": [ "js", "jsx", "json" ],
    transform: {
    '^.+\\.(js)$': 'babel-jest'
    }
};
