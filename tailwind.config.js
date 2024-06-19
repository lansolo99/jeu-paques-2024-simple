const { fontFamily } = require("tailwindcss/defaultTheme");

const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        md2: "960px",
        "3xl": "1920px",
      },
      fontFamily: {
        sans: ["Ubuntu", ...fontFamily.sans],
      },
      colors: {
        blue: {
          300: "#F2F7FB",
          400: "#26308B",
          450: "#08227f",
          500: "#051B71",
          600: "#202F7C",
          800: "#080528",
        },
        cyan: {
          300: "#B2E1FD",
          500: "#369AD4",
        },
        yellow: {
          500: "#FFD744",
          800: "#5B2A2A",
        },
      },
      boxShadow: {
        "3xl":
          " 0px 0px 2.22994px rgba(0, 0, 0, 0.05), 0px 0px 17.8395px rgba(0, 0, 0, 0.08);",
        gameImage: "box-shadow: inset 0px 0px 0px 11px #FFFFFF",
      },
    },
  },
  plugins: [],
});
