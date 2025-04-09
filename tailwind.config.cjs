/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a1f',
        'accent-neon': '#00fff7',
        'glass': 'rgba(255, 255, 255, 0.1)',
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.accent-neon), 0 0 20px theme(colors.accent-neon)',
      },
    },
  },
  plugins: [],
}
