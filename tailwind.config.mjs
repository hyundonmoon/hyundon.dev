import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        terminal: {
          bg: "#0c1014",
          surface: "#121920",
          border: "#1e2a35",
          text: "#c8d6e0",
          dim: "#5a7080",
          faint: "#3a4d5c",
          green: "#39d353",
          amber: "#e3a835",
          purple: "#9382dc",
        },
      },
      typography: {
        terminal: {
          css: {
            "--tw-prose-body": "#c8d6e0",
            "--tw-prose-headings": "#c8d6e0",
            "--tw-prose-lead": "#5a7080",
            "--tw-prose-links": "#39d353",
            "--tw-prose-bold": "#c8d6e0",
            "--tw-prose-counters": "#5a7080",
            "--tw-prose-bullets": "#3a4d5c",
            "--tw-prose-hr": "#1e2a35",
            "--tw-prose-quotes": "#5a7080",
            "--tw-prose-quote-borders": "#39d353",
            "--tw-prose-captions": "#5a7080",
            "--tw-prose-code": "#39d353",
            "--tw-prose-pre-code": "#c8d6e0",
            "--tw-prose-pre-bg": "#121920",
            "--tw-prose-th-borders": "#1e2a35",
            "--tw-prose-td-borders": "#1e2a35",
            a: {
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
