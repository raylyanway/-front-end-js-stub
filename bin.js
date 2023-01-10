#!/usr/bin/env node

console.log("Update starts...");

const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const packageJson = require("./package.json");

const root = process.cwd();
const prettierConfig = "{}";
const prettierIgnoreConfig = "# Ignore artifacts:\nbuild\ncoverage";
const gitIgnoreConfig = "/.nyc_output";
const eslintConfig = `{
  "extends": ["react-app", "react-app/jest", "prettier"],
  "plugins": ["simple-import-sort", "import"],
  "rules": {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error"
  },
  "overrides": [
    // override "simple-import-sort" config
    {
      "files": ["*.js", "*.jsx", "*.ts", "*.tsx"],
      "rules": {
        "simple-import-sort/imports": [
          "error",
          {
            "groups": [
              // Packages "react" related packages come first.
              ["^react", "^@?\\\\w"],
              // Side effect imports.
              ["^\\\\u0000"],
              // Internal packages.
              ["^(@|components)(/.*|$)"],
              // Parent imports. Put ".." last.
              ["^\\\\.\\\\.(?!/?$)", "^\\\\.\\\\./?$"],
              // Other relative imports. Put same-folder imports and "." last.
              ["^\\\\./(?=.*/)(?!/?$)", "^\\\\.(?!/?$)", "^\\\\./?$"],
              // Style imports.
              ["^.+\\\\.?(css)$"]
            ]
          }
        ]
      }
    }
  ]
}`;

function updatePackageJson() {
  packageJson.scripts = {
    ...packageJson.scripts,
    cy: "start-server-and-test cy:server 3000 cy:run",
    "cy:dev": "start-server-and-test cy:server 3000 cy:open",
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "cy:server":
      "cross-env NODE_ENV=test BROWSER=none react-scripts -r @cypress/instrument-cra start",
    format: "npm run prettier:fix && npm run lint:fix",
    lint: "npx eslint src",
    "lint:fix": "npm run lint -- --fix",
    prepare: "husky install",
    prettier: "npx prettier src --check",
    "prettier:fix": "npm run prettier -- --write",
  };

  if (packageJson.eslintConfig) {
    delete packageJson.eslintConfig;
  }

  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify(packageJson, null, 2) + os.EOL
  );
}

function createAdditionalFiles() {
  fs.writeFileSync(path.join(root, ".prettierrc"), prettierConfig + os.EOL);

  fs.writeFileSync(path.join(root, ".eslintrc"), eslintConfig + os.EOL);

  fs.writeFileSync(
    path.join(root, ".prettierignore"),
    prettierIgnoreConfig + os.EOL
  );

  fs.appendFile(path.join(root, ".gitignore"), gitIgnoreConfig + os.EOL);
}

updatePackageJson();
createAdditionalFiles();

console.log("Update finished.");
