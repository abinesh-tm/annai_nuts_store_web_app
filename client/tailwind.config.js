/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Storefront theme (brown/cream)
        primary: {
          DEFAULT: '#6B3A1E',
          dark: '#4A2614',
        },
        cream: '#FFF6EC',
        peach: '#FFE0CC',
        accent: '#F97316',
        // Admin theme (blue)
        admin: {
          primary: '#2563EB',
          sidebar: '#020617',
          bg: '#F9FAFB',
        },
      },
    },
  },
  plugins: [],
}

