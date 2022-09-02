/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        "./partials/**/*.hbs",
        "./templates/**/*.hbs",
        "./src/**/*.js",
        "./src/**/*.ts",
    ],
    theme: {
        container: {
            center: true,
        },
        colors: {
            'transparent': 'transparent',
            'white': '#ffffff',
            'black': '#000000',
            'red': '#ac4639',
            'grey': '#F6F6F4',
            'light_grey': '#FBFBFB',
            'dark_grey': '#707070',
            'border_grey': '#D4D4D4',
            'text_646464': '#646464',
            'color_f5f5f5': '#F5F5F5'
        },

        fontFamily: {
            'lato': ['"Lato", Georgia, Arial, sans-serif'],
            'chrisfo-icon': ['christofle-icons']
        },
        extend: {
            backgroundImage: {
                'weibo': "url('images/weibo.png')",
                'wechat': "url('images/wechat.png')",
            }
        },
    },
    plugins: [],
}