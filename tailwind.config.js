/** Tailwind is compiled to css/tailwind.css (run `npm run build:css` after adding new classes). */
module.exports = {
  // classes are also built inside the JS templates and the trip data
  content: ["./index.html", "./404.html", "./js/**/*.js", "./tools/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', '"Bricolage Fallback"', "system-ui", "sans-serif"],
        body: ["Outfit", '"Outfit Fallback"', "system-ui", "sans-serif"],
      },
      colors: {
        night: { 950: "#050814", 900: "#0a0f24", 800: "#111834", 700: "#1a2348" },
      },
    },
  },
};
