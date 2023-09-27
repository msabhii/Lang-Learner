const languageSelector = document.querySelector("#language-selector");

languageSelector.addEventListener("change", function () {
  const language = this.value;

  // Load the language file
  const languageFile = `languages/${language}.js`;
  import(languageFile);
});

// Load the default language file
import("./views/courses.ejs");
