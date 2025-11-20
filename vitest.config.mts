import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode || "test", process.cwd(), "");

  console.log("env", env["BIOMCP_URL"]);
  return {
    plugins: [tsconfigPaths(), react()],
    test: {
      environment: "node",
      env,
      exclude: ["*.e2e-spec.ts", "node_modules/**"],
    },
  };
});
