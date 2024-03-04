/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: { 
      colors: {
        crema: '#FCFAF7',
        cremaoscuro: '#F5EDE8', // Ajusta el valor hexadecimal según tu preferencia
    },
  },
},
  plugins: [],
}

