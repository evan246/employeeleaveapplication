/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          hover: '#1d4ed8', // blue-700
        },
        background: '#f8fafc', // slate-50
        card: '#ffffff',
        text: {
          primary: '#1e293b', // slate-800
          muted: '#64748b', // slate-500
        },
        border: '#e2e8f0', // slate-200
        status: {
          approved: {
            bg: '#ecfdf5', // emerald-50
            text: '#059669', // emerald-600
          },
          pending: {
            bg: '#fffbeb', // amber-50
            text: '#d97706', // amber-600
          },
          rejected: {
            bg: '#fef2f2', // rose-50
            text: '#dc2626', // rose-600
          },
          info: '#0ea5e9', // sky-500
        },
      },
    },
  },
  plugins: [],
}