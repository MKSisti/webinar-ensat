module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height:{
        100:'25rem',
        108:'27rem',
        112:'29rem',
        116:'31rem'
      }
    },
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
