/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: { 
      colors: {
        rincon: '#0B1416',
        rinconHover: '#122126',
        rincon2: '#0f1a1c',
        rinconClaro: '#15282B',
        cremaoscuro: '#F5EDE8', // Ajusta el valor hexadecimal según tu preferencia
    },
  },
},
  plugins: [],
}

