import nextPlugin from "@next/eslint-plugin-next";

const eslintConfig = [
  nextPlugin.configs["core-web-vitals"],
  {
    ignores: [".next/**", "node_modules/**", "portfolio/**", "Sanity/**"],
  },
];

export default eslintConfig;

