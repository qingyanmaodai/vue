module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-plugin-px2rem')({
      rootValue: 16,
      // exclude: /node_modules/i,
    }),
  ],
};