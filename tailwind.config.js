const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Roboto', '"Segoe UI"', '"Noto Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Arial', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
    },
    boxShadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 17px 50px -12px rgba(0, 0, 0, 0.25)',
      '3xl': '0 25px 20px -15px rgba(0, 0, 0, 0.3)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      none: 'none',
    },
    extend: {
      width: {
        100: '25rem',
        108: '27rem',
        112: '29rem',
        116: '31rem',
      },
      maxWidth: {
        ...defaultTheme.spacing,
        100: '25rem',
        108: '27rem',
        112: '29rem',
        116: '31rem',
      },
      height: {
        100: '25rem',
        108: '27rem',
        112: '29rem',
        116: '31rem',
      },
      maxHeight: {
        100: '25rem',
        108: '27rem',
        112: '29rem',
        116: '31rem',
      },
      fontSize: {
        xxs: '0.6rem',
        min: '0.4rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      transitionDelay: {
        0: '0ms',
      },
      scale: {
        25: '.25',
      },
    },
  },
  variants: {
    extend: {
      translate: ['active', 'group-hover', 'group-focus', 'focus'],
      scale: ['active', 'group-hover', 'group-focus'],
      height: ['hover', 'group-hover', 'group-focus', 'focus'],
      width: ['hover', 'group-hover', 'group-focus', 'focus'],
      opacity: ['focus', 'group-focus', 'dark'],
      borderRadius: ['hover', 'group-hover', 'group-focus'],
      maxWidth: ['group-hover', 'hover'],
      padding: ['hover', 'group-hover'],
      transitionDelay: ['group-hover'],
      pointerEvents: ['focus', 'hover', 'group-hover', 'group-focus'],
      invert: ['dark'],
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
