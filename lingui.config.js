module.exports = {
  locales: ["en", "zh", "ja", "ko", "vi", "id"],
  catalogs: [
    {
      path: "src/locales/{locale}",
      include: ["src"],
    },
  ],
  format: "po",
};
