const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        glassTTYVT220: ['Glass TTY VT220'],
      },
    },
    screens: {
      'xs': '300px',
      ...defaultTheme.screens,
    },
  },
  plugins: [],
}
