"use strict";
const fs = require("fs");
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
  const templateContent = fs.readFileSync(templateSrc, "utf8");
  return replacements ? replaceTokens(templateContent, replacements) : templateContent;
}
function updateTarget(target, compiled, selector, insertBefore) {
  const newContent = getNewTargetContent(target, compiled, selector, insertBefore);
  fs.writeFileSync(target, newContent, { encoding: "utf8" });
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
    if (fs.existsSync(target)) {
      const targetContent = fs.readFileSync(target, "utf8");
      return targetContent.replace(new RegExp(".*?" + escapeRegex(selector) + ".*", "gm"), (match) => {
        return insertBefore ? `${templateContent}
${match}` : `${match}
${templateContent}`;
      });
    } else {
      throw new Error(`Target file ${target} does not exist`);
    }
  } else {
    return templateContent;
  }
}
module.exports = scaffolder;
