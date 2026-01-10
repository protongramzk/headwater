# HeadWater CLI - API Documentation

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Commands](#commands)
  - [hw init](#hw-init)
  - [hw build](#hw-build)
  - [hw scan](#hw-scan)
  - [hw compile](#hw-compile)
  - [hw info](#hw-info)
- [Configuration](#configuration)
- [HWC Language Reference](#hwc-language-reference)
- [Programmatic API](#programmatic-api)
- [Examples](#examples)

---

## Installation

### NPM (Global)
```bash
npm install -g @uniantaradev/headwater
```

### NPM (Local)
```bash
npm install --save-dev @uniantaradev/headwater
```

---

## Quick Start

```bash
# Initialize project
hw init

# Generate CSS
hw build

# Scan project and extract used classes
hw scan ./src

# Compile component CSS
hw compile button.hwc
```

---

## Commands

### `hw init`

Initialize a new HeadWater project by creating `hwconf.json` and updating `.gitignore`.

#### Usage
```bash
hw init
```

#### Output Files
- `hwconf.json` - Configuration file with default settings
- `.gitignore` - Updated with HeadWater output files

#### Example
```bash
$ hw init

🚀 Initialize HeadWater
───────────────────────

✓ Created hwconf.json
✓ Updated .gitignore

Next steps:
  1. Edit hwconf.json to customize
  2. Run "hw build" to generate CSS
  3. Run "hw info" for details

✓ Initialization complete!
```

---

### `hw build`

Generate CSS from HeadWaterGen configuration.

#### Usage
```bash
hw build [config] [options]
```

#### Arguments
| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| `config` | string | `./hwconf.json` | Path to configuration file |

#### Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `-o, --output <file>` | string | `headwater.css` | Output CSS file path |
| `--minify` | boolean | `false` | Minify output CSS |
| `--no-comments` | boolean | - | Strip comments from CSS |
| `--interactive` | boolean | `false` | Generate interactive variants (hover, focus, etc) |
| `--interactive-ignore <list>` | string | - | Comma-separated variants to ignore |
| `--group-hover` | boolean | `false` | Enable group-hover variant |
| `--dark-mode` | boolean | `false` | Enable dark mode variant |

#### Examples

**Basic build:**
```bash
hw build
```

**Custom config and output:**
```bash
hw build theme.json -o dist/theme.css
```

**Minified build:**
```bash
hw build --minify --no-comments -o dist/styles.min.css
```

**With interactive variants:**
```bash
hw build --interactive --group-hover --dark-mode
```

**Interactive with ignored variants:**
```bash
hw build --interactive --interactive-ignore "visited,checked,disabled"
```

#### Output
```
🌊 HeadWater Build
──────────────────

✓ Loaded: hwconf.json

Generating CSS...

✓ Output: headwater.css
✓ Size: 156.42 KB
✓ Minified: No

Ignored: animations, filters

✓ Build complete!
```

---

### `hw scan`

Scan project files and generate minimal CSS containing only used utility classes.

#### Usage
```bash
hw scan <path> [options]
```

#### Arguments
| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `path` | string | ✅ | Project directory to scan |

#### Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `-o, --output <file>` | string | `final.css` | Output CSS file path |
| `--ext <list>` | string | `html,js,jsx,ts,tsx,vue` | File extensions to scan (comma-separated) |
| `--dry` | boolean | `false` | Dry run - show found classes only |

#### Examples

**Basic scan:**
```bash
hw scan ./src
```

**Custom output:**
```bash
hw scan ./src -o dist/final.css
```

**Scan specific file types:**
```bash
hw scan ./src --ext "html,vue,svelte"
```

**Dry run (preview):**
```bash
hw scan ./src --dry
```

#### Output (Normal)
```
🔍 HeadWater Scan
─────────────────

✓ Loaded: hwconf.json

Generating base CSS...
✓ Base CSS generated
Scanning project files...
✓ Found 247 unique classes

Filtering CSS...
✓ CSS filtered

✓ Output: final.css
✓ Original: 156.42 KB
✓ Final: 23.18 KB
✓ Saved: 85.18%
✓ Classes: 247 / 1842

✓ Scan complete!
```

#### Output (Dry Run)
```
🔍 HeadWater Scan
─────────────────

✓ Loaded: hwconf.json
✓ Base CSS generated
✓ Found 247 unique classes

Classes found:
  ✓ p-2
  ✓ bg-primary-500
  ✓ rounded
  ✓ flex
  ✓ items-center
  ✗ unknown-class
  ✓ text-white
  ...
```

---

### `hw compile`

Compile `.hwc` component files to CSS using the HWC DSL.

#### Usage
```bash
hw compile <file> [options]
```

#### Arguments
| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `file` | string | ✅ | Input `.hwc` file path |

#### Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `-o, --output <file>` | string | `component.css` | Output CSS file path |
| `--base <file>` | string | - | Custom base CSS file (overrides HeadWaterGen) |
| `--strict` | boolean | `false` | Throw error if utility not found |

#### Examples

**Basic compile:**
```bash
hw compile button.hwc
```

**Custom output:**
```bash
hw compile components/card.hwc -o dist/card.css
```

**With custom base CSS:**
```bash
hw compile button.hwc --base custom-base.css
```

**Strict mode:**
```bash
hw compile button.hwc --strict
```

#### Input Example (`button.hwc`)
```hwc
// Button base
$btnBase = p-2 rounded font-medium;
$btnHover = bg-primary-600;

// Primary button
.btn-primary = bg-primary-500 text-white $btnBase;
.btn-primary:hover = $btnHover;
.btn-primary:active = bg-primary-700;

// Secondary button
.btn-secondary = bg-gray-200 text-gray-800 $btnBase;
.btn-secondary:hover = bg-gray-300;
```

#### Output
```
⚙️  HeadWater Compile
────────────────────

✓ Loaded: hwconf.json

Loading base CSS...
✓ Generated base from HeadWaterGen
Reading .hwc file...
✓ .hwc file loaded
Compiling...
✓ Compilation successful

✓ Output: component.css
✓ Size: 1.24 KB

✓ Compile complete!
```

#### Generated CSS
```css
.btn-primary {
  background-color: #3b82f6;
  color: #ffffff;
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-primary:active {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #1f2937;
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}
```

---

### `hw info`

Display HeadWater configuration and statistics.

#### Usage
```bash
hw info
```

#### Example Output
```
ℹ️  HeadWater Info
──────────────────

✓ Loaded: hwconf.json

📊 Size Information
  Full CSS:        156.42 KB
  Minified:        98.73 KB
  Compression:     36.89%

🎨 Color Map
  primary      ███ #3b82f6
  secondary    ███ #8b5cf6
  success      ███ #10b981
  danger       ███ #ef4444
  warning      ███ #f59e0b
  info         ███ #06b6d4

🔧 Generators
  Total:       18
  Active:      16
  Ignored:     2
  animations, filters

⚙️  Settings
  Minify:      No
  Comments:    Yes
```

---

## Configuration

### `hwconf.json` Structure

```json
{
  "$schema": "https://headwater.dev/schema.json",
  "colorMap": {
    "primary": "#3b82f6",
    "secondary": "#8b5cf6",
    "success": "#10b981",
    "danger": "#ef4444",
    "warning": "#f59e0b",
    "info": "#06b6d4"
  },
  "ignore": ["animations", "filters"],
  "minify": false,
  "comments": true
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `colorMap` | object | `{}` | Custom color definitions (merged with defaults) |
| `ignore` | array | `[]` | Generator modules to exclude |
| `minify` | boolean | `false` | Minify generated CSS |
| `comments` | boolean | `true` | Include comments in CSS |

### Available Generators

You can ignore any of these generators:

- `reset` - CSS reset/preflight
- `colors` - Color utilities
- `spacing` - Padding and margin
- `sizing` - Width and height
- `positioning` - Position utilities
- `border` - Border and border-radius
- `display` - Display utilities
- `flex` - Flexbox utilities
- `flex-gap` - Flex gap utilities
- `grid` - Grid utilities
- `typography` - Font and text utilities
- `typography-advanced` - Line height, letter spacing, etc
- `effects` - Box shadows, opacity, transitions
- `filters` - Blur, brightness, grayscale
- `animations` - Keyframe animations
- `interaction` - Cursor, pointer-events
- `media` - Aspect ratio, object-fit
- `gradients` - Gradient utilities

### Default Color Map

If `colorMap` is empty or not provided, these defaults are used:

```json
{
  "white": "#ffffff",
  "black": "#000000",
  "gray": "#6b7280",
  "primary": "#3b82f6",
  "secondary": "#8b5cf6",
  "accent": "#06b6d4",
  "success": "#10b981",
  "warning": "#f59e0b",
  "danger": "#ef4444",
  "info": "#3b82f6",
  "red": "#ef4444",
  "orange": "#f97316",
  "amber": "#f59e0b",
  "yellow": "#eab308",
  "lime": "#84cc16",
  "green": "#22c55e",
  "emerald": "#10b981",
  "teal": "#14b8a6",
  "cyan": "#06b6d4",
  "sky": "#0ea5e9",
  "blue": "#3b82f6",
  "indigo": "#6366f1",
  "violet": "#8b5cf6",
  "purple": "#a855f7",
  "fuchsia": "#d946ef",
  "pink": "#ec4899",
  "rose": "#f43f5e"
}
```

---

## HWC Language Reference

### Syntax Overview

```hwc
// Comments
// Single line comments start with //

// Mixin Declaration
$mixinName = utility1 utility2 utility3;

// Selector Assignment
.selector = utility1 utility2;
.selector:variant = utility1;

// All statements end with semicolon
```

### Mixin Declaration

```hwc
$name = <utility-list>;
```

**Rules:**
- Must start with `$`
- Can only contain utility tokens
- Cannot contain selectors
- Can reference other mixins

**Examples:**
```hwc
$spacing = p-4 m-2;
$button = $spacing rounded bg-primary-500;
$hover = bg-primary-600 shadow-lg;
```

### Selector Assignment

```hwc
<selector> = <utility-list>;
```

**Selectors:**
- Class: `.btn`, `.card`, `.container`
- ID: `#header`, `#main`
- Element: `button`, `div`, `a`

**Examples:**
```hwc
.btn = p-2 bg-blue-500 rounded;
#header = bg-white shadow;
button = cursor-pointer;
```

### Variant Selectors

```hwc
<selector>:<variant> = <utility-list>;
```

**Supported Variants:**
- `:hover`
- `:focus`
- `:active`
- `:disabled`
- `:visited`
- Any valid CSS pseudo-class

**Examples:**
```hwc
.btn:hover = bg-blue-600;
.input:focus = outline-none border-blue-500;
.link:visited = text-purple-600;
```

### Using Mixins

```hwc
.selector = utility1 $mixin utility2;
```

**Examples:**
```hwc
$card = bg-white rounded shadow p-4;
$cardHover = shadow-lg;

.card = $card;
.card:hover = $cardHover;

.card-primary = $card bg-blue-50;
```

### Complete Example

```hwc
// Mixins for reusability
$baseBtn = px-4 py-2 rounded font-medium transition;
$primaryColors = bg-blue-500 text-white;
$secondaryColors = bg-gray-200 text-gray-800;

// Primary Button
.btn-primary = $baseBtn $primaryColors;
.btn-primary:hover = bg-blue-600 shadow-md;
.btn-primary:active = bg-blue-700;
.btn-primary:disabled = opacity-50 cursor-not-allowed;

// Secondary Button
.btn-secondary = $baseBtn $secondaryColors;
.btn-secondary:hover = bg-gray-300;

// Large variant
.btn-lg = px-6 py-3 text-lg;

// Card component
$cardBase = bg-white rounded-lg shadow p-6;

.card = $cardBase;
.card:hover = shadow-xl;

.card-header = text-xl font-bold mb-4;
.card-body = text-gray-700;
```

### Error Handling

**Unknown utility (warning):**
```hwc
.test = unknown-utility p-2;
```
Output: Warning, but continues compilation

**Unknown mixin (error):**
```hwc
.test = $unknownMixin p-2;
```
Output: Error, compilation fails

**Circular mixin (error):**
```hwc
$a = $b p-2;
$b = $a m-2;
```
Output: Error, circular reference detected

---

## Programmatic API

### Node.js Usage

```javascript
const { HeadWaterGen, HWCompiler, cssToObject, sizeCalculate } = require('headwater-cli/headwater');
```

### HeadWaterGen API

#### `generateCSS(options)`

Generate utility CSS.

```javascript
const css = HeadWaterGen.generateCSS({
  colorMap: {
    primary: '#3b82f6',
    secondary: '#8b5cf6'
  },
  ignore: ['animations', 'filters'],
  minify: false,
  comments: true
});

console.log(css);
```

#### `generateInteractive(baseCss, options)`

Generate interactive variants.

```javascript
const baseCss = cssToObject(HeadWaterGen.generateCSS());

const interactive = HeadWaterGen.generateInteractive(baseCss, {
  ignore: ['visited', 'checked'],
  groupHover: true,
  darkMode: true
});

console.log(interactive);
```

#### `generateWithInteractive(config, interactiveOptions)`

Generate base + interactive in one call.

```javascript
const fullCss = HeadWaterGen.generateWithInteractive(
  {
    colorMap: { primary: '#3b82f6' },
    ignore: ['animations']
  },
  {
    ignore: ['visited'],
    groupHover: true,
    darkMode: true
  }
);
```

#### `listGenerators()`

Get list of available generators.

```javascript
const generators = HeadWaterGen.listGenerators();
// ['reset', 'colors', 'spacing', 'sizing', ...]
```

#### `getSize(options)`

Get size information.

```javascript
const size = HeadWaterGen.getSize({
  colorMap: { primary: '#3b82f6' }
});

console.log(size.formatted); // "156.42 KB"
```

### HWCompiler API

#### `compile(source, baseCssObject, options)`

Compile HWC source to CSS.

```javascript
const compiler = new HWCompiler({
  strict: false,
  warnings: true
});

const baseCss = cssToObject(HeadWaterGen.generateCSS());

const result = compiler.compile(hwcSource, baseCss);

if (result.success) {
  console.log(result.css);
} else {
  console.error('Errors:', result.errors);
}

if (result.warnings.length > 0) {
  console.warn('Warnings:', result.warnings);
}
```

### Utility Functions

#### `cssToObject(css)`

Convert CSS string to object.

```javascript
const css = `.p-2 { padding: 0.5rem; }`;
const obj = cssToObject(css);
// { 'p-2': { padding: '0.5rem' } }
```

#### `sizeCalculate(str, options)`

Calculate string size.

```javascript
const size = sizeCalculate(cssString);

console.log(size.bytes);      // 160234
console.log(size.kb);          // 156.48
console.log(size.mb);          // 0.15
console.log(size.formatted);   // "156.48 KB"
console.log(String(size));     // "156.48 KB"
```

Options:
```javascript
const size = sizeCalculate(str, {
  decimals: 3,           // Number of decimal places
  binary: true,          // Use 1024 instead of 1000
  returnObject: false    // Return string instead of object
});
```

---

## Examples

### Example 1: Minimal Production Build

```bash
hw build --minify --no-comments -o dist/styles.min.css
```

### Example 2: Theme with Custom Colors

**hwconf.json:**
```json
{
  "colorMap": {
    "brand": "#ff6b6b",
    "dark": "#1a1a2e",
    "light": "#f7f7f7"
  },
  "ignore": ["animations", "filters"]
}
```

```bash
hw build -o dist/theme.css
```

### Example 3: Component Library

**button.hwc:**
```hwc
$btn = px-4 py-2 rounded font-medium;

.btn-primary = $btn bg-brand text-white;
.btn-primary:hover = bg-brand-600;

.btn-secondary = $btn bg-gray-200;
.btn-secondary:hover = bg-gray-300;
```

```bash
hw compile button.hwc -o components/button.css
```

### Example 4: Scan and Optimize

```bash
# Scan React project
hw scan ./src --ext "jsx,tsx" -o dist/optimized.css

# Scan Vue project
hw scan ./src --ext "vue" -o dist/optimized.css
```

### Example 5: Full Workflow

```bash
# 1. Initialize
hw init

# 2. Edit hwconf.json with your colors

# 3. Generate full CSS for development
hw build --interactive --group-hover --dark-mode

# 4. Compile components
hw compile components/*.hwc

# 5. Scan and optimize for production
hw scan ./src --minify -o dist/final.min.css
```

---

## License

MIT

---

## Support

- GitHub Issues: https://github.com/yourusername/headwater-cli/issues
- Documentation: https://headwater.dev
- Discord: https://discord.gg/headwater
