import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "#000000",
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#1A1A1A",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#1A1A1A",
          foreground: "#A0A0A0",
        },
        accent: {
          DEFAULT: "#1A1A1A",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#111111",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#111111",
          foreground: "#FFFFFF",
        },
        // Pure colors
        pure: {
          black: "#000000",
          white: "#FFFFFF",
        },
        // Gradient colors - used selectively
        gradient: {
          purple: "rgba(131,58,180,1)",
          red: "rgba(253,29,29,1)", 
          orange: "rgba(252,176,69,1)",
        },
        // Grayscale palette
        gray: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0A0A0A",
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(90deg, #ff3131 0%, #9611ff 100%)',
        'gradient-primary-blur': 'linear-gradient(90deg, rgba(255,49,49,0.8) 0%, rgba(150,17,255,0.8) 100%)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-shift": "gradient-shift 3s ease infinite",
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

export default config;
