/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: '#F5880F',
        ink: '#101010',
        surface: '#f9f4ed'
      },
      boxShadow: {
        card: '0 12px 28px rgba(16, 16, 16, 0.12)'
      }
    }
  },
  plugins: []
};

