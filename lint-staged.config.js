const config = {
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
  '*.{ts}': ['yarn lint'],
  '*.{md,json}': 'prettier --write'
};

module.exports = config;
