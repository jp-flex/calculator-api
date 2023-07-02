module.exports = {
   "env": {
    "browser": true,
    "es2021": true
  },
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/test/",
    "/coverage/"
  ],
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    }
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "indent": ["error", 2]
  }
}
