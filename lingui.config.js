module.exports = {
  locales: ["en", "ar", "zh", "ja"],
  catalogs: [
    {
      path: "src/locales/{locale}",
      include: ["src"],
    },
  ],
  format: "po",
};
