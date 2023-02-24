import { readFileSync, existsSync, writeFileSync } from "fs";

export type TemplateConfig = {
  target: string,
  selector?: string,
  insertBefore?: boolean
}

export type Template = {
  [templateSrc: string]: string | TemplateConfig
}

export type ScaffoldConfig = Template | Template[];


export default function scaffolder(scaffoldConfig: ScaffoldConfig, replacements?: {key: string, value: string}) {
  return new Promise((resolve, reject) => {
    try {
      let config = !Array.isArray(scaffoldConfig) ? [scaffoldConfig] : scaffoldConfig;
      const filesUpdated: string[] = [];
      config.forEach((template) => {
        for (let [templateSrc, templateConfig] of Object.entries(template)) {
          if (typeof templateConfig === "string") {
            templateConfig = { target: templateConfig };
          }

          const { target, selector, insertBefore } = templateConfig as TemplateConfig;
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

function compileTemplate(templateSrc: string, replacements?: {key: string, value: string}) {
  const templateContent = readFileSync(templateSrc, "utf8");
  return replacements ? replaceTokens(templateContent, replacements) : templateContent;
}

function updateTarget(target: string, compiled: string, selector?: string, insertBefore?: boolean) {
  const newContent = getNewTargetContent(target, compiled, selector, insertBefore);
  writeFileSync(target, newContent, { encoding: "utf8" });
}

function replaceTokens(templateContent: string, replacements: {key: string, value: string}) {
  for (const [key, value] of Object.entries(replacements)) {
    templateContent = templateContent.replace(new RegExp(key, "gm"), value);
  }
  return templateContent;
}

function escapeRegex(string: string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function getNewTargetContent(target: string, templateContent: string, selector?: string, insertBefore?: boolean) {
  if (selector) {
    if (existsSync(target)) {
      const targetContent = readFileSync(target, "utf8");
      return targetContent.replace(new RegExp('.*?' + escapeRegex(selector) + '.*' , "gm"), (match) => {
        return insertBefore ? `${templateContent}\n${match}` : `${match}\n${templateContent}`;
      });
    } else {
      throw new Error(`Target file ${target} does not exist`);
    }
  } else {
    return templateContent;
  }
}
