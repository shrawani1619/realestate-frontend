import type { Config } from 'tailwindcss';
import { COLORS } from './src/constants/css';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: COLORS.primary,
      },
    },
  },
  plugins: [],
};

export default config;