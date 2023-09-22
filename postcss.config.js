module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-px2rem-exclude')({
      remUnit: 14,
      exclude: /node_modules|floder_name/i,
    }),
  ],
};
