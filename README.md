# Tiny Scaffold

A config based scaffolder ideal for generating repeatable code and updating an existing codebase.

## Usage

```js
import TinyScaffold from 'tiny-scaffold';

const templates = {
  'path/to/my-template.ts': 'destination/path.ts', // Copy the template to a new file
  'path/to/another-template-partial.cs': {
    target: 'destination/file/toupdate.cs', // Existing file to update
    pattern: '// inject', // location for the template to be added
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
