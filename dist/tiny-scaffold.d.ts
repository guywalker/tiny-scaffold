// Generated by dts-bundle-generator v7.2.0

export type TemplateConfig = {
	target: string;
	selector?: string;
	insertBefore?: boolean;
};
export type Template = {
	[templateSrc: string]: string | TemplateConfig;
};
export type ScaffoldConfig = Template | Template[];
declare function scaffolder(scaffoldConfig: ScaffoldConfig, replacements?: {
	key: string;
	value: string;
}): Promise<unknown>;

export {
	scaffolder as default,
};

export {};
