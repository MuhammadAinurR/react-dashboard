module.exports = {
  locales: ["en", "ja", "ar", "cn"],
  catalogs: [
    {
      path: "src/locales/{locale}",
      include: ["src"], //includes all files in the src folder
    },
  ],
  format: "po",
};
