/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js',
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
    animation: {
      gradient: "gradient 8s linear infinite",
    },
    keyframes: {
      gradient: {
        to: {
          backgroundPosition: "var(--bg-size) 0",
        },
      },
    },
  },
},
plugins: [
  require('flowbite/plugin')
]
}

