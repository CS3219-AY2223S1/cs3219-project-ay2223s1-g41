const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    darkMode: "class",
    content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            height: {
                "10v": "10vh",
                "20v": "20vh",
                "30v": "30vh",
                "40v": "40vh",
                "50v": "50vh",
                "60v": "60vh",
                "70v": "70vh",
                "80v": "80vh",
                "90v": "90vh",
                "100v": "100vh",
            },
            width: {
                "10w": "10vw",
                "20w": "20vw",
                "30w": "30vw",
                "40w": "40vw",
                "50w": "50vw",
                "60w": "60vw",
                "70w": "70vw",
                "80w": "80vw",
                "90w": "90vw",
                "100w": "100vw",
            },
            colors: {
                blue: {
                    50: "#cae4fc",
                    60: "#87b0d6",
                    100: "#EDF4FE",
                    500: "#3E6CFF",
                    600: "#3989F7",
                    700: "#131F38",
                    800: "#13192B",
                    850: "#121828",
                    900: "#0C1122",
                    950: "#0A0F1F",
                    1000: "#060D1D",
                    1050: "#0b1c2c",
                },
                red: {
                    400: "#ff616d",
                    500: "#ff4d5b",
                },
                yellow: {
                    100: "#ebcc34",
                },
                green: {
                    100: "#EDF5E1",
                    200: "#4ECCA3",
                    400: "#00ec96",
                    500: "#00c27b",
                    600: "#8EE4AF",
                    700: "#5CDB95",
                    800: "#379693",
                    900: "#05386B",
                },
                navy: {
                    100: "#3808a6",
                    900: "#0f0333",
                },
                dark: {
                    100: "#393E46",
                    200: "#232931",
                },
                light: {
                    100: "#EEEEEE",
                },
            },
            transitionProperty: {
                height: "height",
            },
            spacing: {
                25: "6.25rem",
                26: "6.5rem",
                27: "6.75rem",
                29: "7.25rem",
                30: "7.5rem",
                38: "9.5rem",
                39: "9.75rem",
            },
        },
    },
    plugins: [],
};
