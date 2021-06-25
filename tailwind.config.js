module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      translate: ['active', 'group-hover'],
      scale: ['active', 'group-hover'],
      height: ['hover', 'group-hover'],
    },
  },
  plugins: [],
}
