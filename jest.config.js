module.exports = {
  roots: ['tests/'],
  testRegex: '\/tests\/.*(test|spec).(jsx?|tsx?)$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'ts', 'tsx'],
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{ts,tsx}'],
  coverageReporters: ['lcov'],
};