export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",     // blue from Figma
        secondary: "#4B5563",
        tertiary: "#92400E",
        error: "#EF4444",
        container: "#F3F4F6",
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}