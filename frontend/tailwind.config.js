/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'hsl(250, 84%, 54%)',
                    light: 'hsl(250, 84%, 64%)',
                    dark: 'hsl(250, 84%, 44%)',
                },
                secondary: 'hsl(340, 82%, 52%)',
                accent: 'hsl(180, 77%, 47%)',
                background: {
                    DEFAULT: 'hsl(240, 21%, 15%)',
                    light: 'hsl(240, 15%, 20%)',
                    lighter: 'hsl(240, 10%, 25%)',
                },
                surface: 'hsl(240, 15%, 18%)',
                success: 'hsl(142, 76%, 36%)',
                error: 'hsl(0, 84%, 60%)',
                warning: 'hsl(38, 92%, 50%)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-in': 'slideIn 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            }
        },
    },
    plugins: [],
}
