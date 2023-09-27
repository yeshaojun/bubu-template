module.exports = {
  plugins: {
    <%_ if (data.isTailWindCss) { _%>
    tailwindcss: {},
    autoprefixer: {},
    <%_ } _%>
  },
}
