# import-glocal

Import a globally installed module if your module is installed globally and no local module is found.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Synopsis](#synopsis)
- [Details](#details)
- [API](#api)
- [import-glocal](#import-glocal)
  - [Table of contents](#table-of-contents)
    - [Functions](#functions)
  - [Functions](#functions-1)
    - [default](#default)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Installation

# Synopsis

```ts
import importModule from "import-glocal";

// Try to import "my-plugin" or "awesome-my-plugin" from local or global (if parent model is global or linked) modules.
const imported = await importModule("my-plugin", { prefix: "awesome-" });
const importedTypeScript = await importModule<default: (name: string) => string>("my-plugin");
```

# Details

`import-glocal` asynchronously imports a module from local or global modules installed by `npm` or `yarn`. Local modules are preferred.
Global modules are imported only if your module is also installed globally or linked by `npm` or `yarn` (`options.linked`).

You can provide a prefix to import module with given name or alternative name with a prefix, which my be useful to support plugin modules
with optional short names.

**CAUTION:** In normal conditions, importing a global module is an anti-pattern. Don't import global modules if you don't have a reason.

Possible reasons to use this module:

- Your CLI is installed globally and you want to support a modular plugin structure, so you have to use globally installed plugin modules.
- Your library is installed globally and you want to support optional modules installed globally.

<!-- usage -->

<!-- commands -->

# API

<a name="readmemd"></a>

import-glocal

# import-glocal

## Table of contents

### Functions

- [default](#default)

## Functions

### default

▸ **default**<T\>(`module`: _string_, `__namedParameters?`: { `force?`: _boolean_ ; `linked?`: _boolean_ ; `prefix?`: _string_ \| _string_[] }): _Promise_<T\>

Imports the given module or module prefixed with one of the prefixes. If the module is installed globally,
tries to import globally installed modules by `npm` or `yarn`.

#### Example

```typescript
await importModule("example", { prefix: ["pgen-", "pg-generator-"] }); // Tries to import `example`, `pgen-example`, `pg-generator-example`.
await importModule("example", { force: true }); // Import global module even parnet module is not installed globally.
await importModule<default: (name: string) => string>("example"); // Type of export.
```

**`throws`** an error if the module or prefixed modules cannot be found locally or globally.

#### Type parameters:

| Name | Type      | Default | Description                              |
| ---- | --------- | ------- | ---------------------------------------- |
| `T`  | _unknown_ | _any_   | is the exported value from given module. |

#### Parameters:

• **module**: _string_

is the module to import.

• **\_\_namedParameters**: _object_

| Name      | Type                   | Description                                                                                 |
| --------- | ---------------------- | ------------------------------------------------------------------------------------------- |
| `force?`  | _boolean_              | is whether to import global modules even parent is not a global module.                     |
| `linked?` | _boolean_              | is whether to import global modules for linked modules.                                     |
| `prefix?` | _string_ \| _string_[] | is a prefix or a list of prefixes to get additional module names that begins with a prefix. |

**Returns:** _Promise_<T\>

Defined in: index.ts:22
