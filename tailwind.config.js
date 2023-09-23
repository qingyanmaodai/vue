module.exports = {
  purge: {
    content: ['./public/**/*.html', './src/**/*.vue'],
  },
  corePlugins: {
    preflight: false,
  },
  darkMode: false, // or 'media' or 'class'
  mode: 'jit', // 是否开启jit模式，开启以后编译会更快，当然，tailwindcss版本需要在2.1以上
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
