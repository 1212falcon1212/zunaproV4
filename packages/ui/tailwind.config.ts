import type { Config } from "tailwindcss";
import basePreset from "../config/tailwind/base";

const config: Config = {
  presets: [basePreset as Config],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
