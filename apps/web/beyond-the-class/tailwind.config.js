/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        "bg-var-sidebar": "var(--var-bg-sidebar)",
        "bg-var-sidebar-dark": "var(--var-bg-sidebar-dark)",

        "bg-var-navbar": "var(--var-bg-navbar)",
        "bg-var-navbar-dark": "var(--var-bg-navbar-dark)",

        // "bg-var-sidebar-url": "var(--var-bg-sidebar-url-light)",
        // "bg-var-sidebar-url-dark": "var(--var-bg-sidebar-url-dark)",

        // "bg-var-navbar-url": "var(--var-bg-navbar-url-light)",
        // "bg-var-navbar-url-dark": "var(--var-bg-navbar-url-dark)",

        "bg-primary-color": "var(--var-bg-primary-color)",
        "bg-secondary-color": "var(--var-bg-secondary-color)",

        "bg-primary-color-dark": "var(--var-bg-primary-color-dark)",
        "bg-secondary-color-dark": "var(--var-bg-secondary-color-dark)",

        "text-primary": "var(--var-text-primary)",
        "text-primary-dark": "var(--var-text-primary-dark)",

        //end
        "btn-primary": "var(--var-btn-primary)",
        "btn-secondary": "var(--var-btn-secondary)",
        "bg-var-dark": "var(--var-bg-dark)",
      },
      backgroundImage: {
        "sidebar-pattern": "url('https://arc.net/noise-light.png')",
        "navbar-pattern": "url('https://arc.net/noise-light.png')",
      },
    },
  },
  plugins: [],
};
