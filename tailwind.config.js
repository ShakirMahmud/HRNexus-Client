/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Add this line for Material Tailwind
    "node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Color Palette
        primary: {
          50: "#E6F2FF", // Lightest blue
          100: "#B3DFFF", // Light blue
          200: "#80CCFF", // Soft blue
          300: "#4DB8FF", // Medium blue
          400: "#1AA5FF", // Bright blue
          500: "#0091E6", // Main primary blue
          600: "#0078C2", // Dark blue
          700: "#005E9C", // Deeper blue
          800: "#004477", // Navy blue
          900: "#002A4D", // Darkest blue
        },

        // Neutral Color Palette
        neutral: {
          50: "#F9FAFB", // Almost white
          100: "#F3F4F6", // Light gray
          200: "#E5E7EB", // Light cool gray
          300: "#D1D5DB", // Medium gray
          400: "#9CA3AF", // Gray
          500: "#6B7280", // Dark gray
          600: "#4B5563", // Darker gray
          700: "#374151", // Very dark gray
          800: "#1F2937", // Charcoal
          900: "#111827", // Almost black
        },

        // Accent Colors
        success: {
          500: "#10B981", // Emerald green
          600: "#059669", // Darker green
        },

        danger: {
          500: "#EF4444", // Red
          600: "#DC2626", // Darker red
        },

        warning: {
          500: "#F59E0B", // Amber
          600: "#D97706", // Darker amber
        },
      },

      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        elevated:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animated"), require("@material-tailwind/react/utils/withMT")],
};
