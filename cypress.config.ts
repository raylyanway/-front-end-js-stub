import codeCoverage from "@cypress/code-coverage/task";
import { initPlugin } from "@frsource/cypress-plugin-visual-regression-diff/plugins";
import { defineConfig } from "cypress";

export default defineConfig({
  video: false,
  env: {
    pluginVisualRegressionCleanupUnusedImages: false,
  },
  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
    setupNodeEvents(on, config) {
      initPlugin(on, config);
      codeCoverage(on, config);

      return config;
    },
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      initPlugin(on, config);
      codeCoverage(on, config);

      return config;
    },
  },
});
