module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'subject-max-length': [2, 'always', 120],
    'scope-enum': [2, 'always', []],
    'scope-empty': [2, 'always']
  }
};
