# Tiny Scaffold

A config based scaffolder ideal for generating repeatable code and updating an existing codebase.

## Usage

```js
import TinyScaffold from 'tiny-scaffold';

const templates = {
  'path/to/my-template.ts': 'destination/path.ts', // Copy the template to a new file
  'path/to/another-template-partial.cs': {
    target: 'destination/file/toupdate.cs', // Existing file to update
    selector: '// inject', // location for the template to be added in a new line after, automatically regex escaped
    insertBefore: false // default
  }
};

// Key-value pairs to replace in the template files
const replacements = {
  '{ name }': 'Test',
  '{ project }': 'TinyScaffold'
};

await TinyScaffold(templates, replacements);
```

`TinyScaffold` accepts two arguments:

`templates`: `Template | Template[]`

`replacements`: `{[key: string]: string}`

A Template is a key-value pair where the key is the template file to use and the value is either the path to be copied to, or a config for updating an existing file.

The config can be:
```js
{
    target: 'destination/file/toupdate.cs', // Existing file to update
    selector: '// inject', // location for the template to be inserted after
    insertBefore: false // default
}
```

The selector is automatically regex escaped and will be used to determine where a new line should be inserted after.

## Coming soon
- Support for custom regex selectors
- Directories
- Custom replacer functions
