module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jest-formatting',
    'no-type-assertion',
    'import',
    'unused-imports',
    '@graphql-eslint',
  ],
  root: true,

  overrides: [
    {
      files: ['schema.graphql'],
      parser: '@graphql-eslint/eslint-plugin',
      extends: 'plugin:@graphql-eslint/schema-recommended',
      parserOptions: {
        schema:
          './src/adapter/entry-points/express/handlers/codex-v2/schema.graphql',
      },
      rules: {
        '@graphql-eslint/no-unreachable-types': 'off',
        '@graphql-eslint/require-description': 'off',
        '@graphql-eslint/strict-id-in-types': 'off',
        '@graphql-eslint/no-typename-prefix': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:jest-formatting/recommended',
        'plugin:import/typescript',
      ],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 13,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint', 'import', 'no-type-assertion'],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/require-await': 'off',
        'no-type-assertion/no-type-assertion': 'error',
        'import/no-restricted-paths': [
          'error',
          {
            zones: [
              {
                target: './src/domain',
                from: './src/adapter',
              },
              {
                target: './src/domain/entities',
                from: './src/domain/usecases',
              },
              {
                target: './src/adapter/repositories',
                from: './src/adapter/entry-points',
              },
              {
                target: './**/codex-v2/**/*',
                from: './**/{authentication,classlink,clever,clever-roster-sync,codex,maintenance,playerApi}/**/*',
              },
            ],
          },
        ],
        'lines-between-class-members': ['error', 'always'],
        '@typescript-eslint/padding-line-between-statements': [
          'error',
          {
            blankLine: 'always',
            prev: 'import',
            next: '*',
          },
          {
            blankLine: 'any',
            prev: 'import',
            next: 'import',
          },
          {
            blankLine: 'always',
            prev: 'export',
            next: '*',
          },
          {
            blankLine: 'always',
            prev: 'class',
            next: '*',
          },
          {
            blankLine: 'always',
            prev: ['const', 'let', 'var'],
            next: '*',
          },
          {
            blankLine: 'always',
            prev: '*',
            next: ['const', 'let', 'var'],
          },
          {
            blankLine: 'any',
            prev: ['const', 'let', 'var'],
            next: ['const', 'let', 'var'],
          },
          {
            blankLine: 'always',
            prev: '*',
            next: 'if',
          },
          {
            blankLine: 'always',
            prev: '*',
            next: 'return',
          },
        ],
        'unused-imports/no-unused-imports-ts': 'error',
      },
    },
    {
      files: ['*.test.ts'],
      rules: {
        'no-type-assertion/no-type-assertion': 'off',
      },
    },
  ],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
}
