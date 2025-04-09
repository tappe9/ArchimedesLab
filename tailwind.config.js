/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a1f',
        'accent-neon': '#00fff7',
        'glass': 'rgba(255, 255, 255, 0.05)'
      },
      boxShadow: {
        'neon': '0 0 10px theme(colors.accent-neon)'
      }
    }
  },
  plugins: []
}
