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
      },
      fontSize: {
        xxs:'0.6rem',
        min:'0.4rem'
      },
      borderRadius: {
        '4xl':'2rem',
        '5xl':'2.5rem',
        '6xl':'3rem'
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
