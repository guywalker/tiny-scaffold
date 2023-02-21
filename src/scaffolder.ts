import { readFileSync, existsSync, writeFileSync } from "fs";

export type TemplateConfig = {
  target: string,
  pattern?: string,
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

          const { target, pattern, insertBefore } = templateConfig as TemplateConfig;
          const compiled = compileTemplate(templateSrc, replacements);
          updateTarget(target, compiled, pattern, insertBefore);

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

function updateTarget(target: string, compiled: string, pattern?: string, insertBefore?: boolean) {
  const newContent = getNewTargetContent(target, compiled, pattern, insertBefore);
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

function getNewTargetContent(target: string, templateContent: string, pattern?: string, insertBefore?: boolean) {
  if (pattern) {
    if (existsSync(target)) {
      const targetContent = readFileSync(target, "utf8");
      const insert = insertBefore ? `${templateContent}\n\r${pattern}` : `${pattern}\n\r${templateContent}`;
      return targetContent.replace(new RegExp(escapeRegex(pattern), "gm"), insert);
    } else {
      throw new Error(`Target file ${target} does not exist`);
    }
  } else {
    return templateContent;
  }
}
