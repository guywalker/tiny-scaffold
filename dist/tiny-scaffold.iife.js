var tinyScaffold = function(fs2, path2, os2) {
  "use strict";
  function scaffolder(scaffoldConfig, replacements) {
    return new Promise((resolve, reject) => {
      try {
        let config = !Array.isArray(scaffoldConfig) ? [scaffoldConfig] : scaffoldConfig;
        const filesUpdated = [];
        config.forEach((template) => {
          for (let [templateSrc, templateConfig] of Object.entries(template)) {
            if (typeof templateConfig === "string") {
              templateConfig = { target: templateConfig };
            }
            const { target, selector, insertBefore } = templateConfig;
            const compiled = compileTemplate(templateSrc, replacements);
            updateTarget(target, compiled, selector, insertBefore);
            filesUpdated.push(target);
          }
        });
        resolve(filesUpdated);
      } catch (e) {
        reject(e);
      }
    });
  }
  function compileTemplate(templateSrc, replacements) {
    const templateContent = fs2.readFileSync(path2.normalize(templateSrc), "utf8");
    return replacements ? replaceTokens(templateContent, replacements) : templateContent;
  }
  function updateTarget(target, compiled, selector, insertBefore) {
    const newContent = getNewTargetContent(target, compiled, selector, insertBefore);
    fs2.writeFileSync(target, newContent, { encoding: "utf8" });
  }
  function replaceTokens(templateContent, replacements) {
    for (const [key, value] of Object.entries(replacements)) {
      templateContent = templateContent.replace(new RegExp(key, "gm"), value);
    }
    return templateContent;
  }
  function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }
  function getNewTargetContent(target, templateContent, selector, insertBefore) {
    if (selector) {
      if (fs2.existsSync(target)) {
        const targetContent = fs2.readFileSync(path2.normalize(target), "utf8");
        return targetContent.replace(new RegExp(".*?" + escapeRegex(selector) + ".*", "gm"), (match) => {
          return insertBefore ? `${templateContent}${os2.EOL}${match}` : `${match}${os2.EOL}${templateContent}`;
        });
      } else {
        throw new Error(`Target file ${target} does not exist`);
      }
    } else {
      return templateContent;
    }
  }
  return scaffolder;
}(fs, path, os);
