# HeadWater

A lightweight, zero-dependency CSS utility generator and compiler for modern web development.

## What is HeadWater?

HeadWater is a dual-purpose CSS utility system that works both as a **ready-to-use utility framework** (like Tailwind CSS) and a **programmable CSS generator** for complete customization.

Unlike traditional CSS frameworks, HeadWater gives you three ways to work:

1. **Drop-in CSS** - Use pre-built `hw.css` directly in your browser without any build step
2. **Custom Generation** - Generate tailored utility CSS with your own design tokens via CLI
3. **Component Compilation** - Write component styles using the HWC DSL for modular, maintainable CSS

## Key Features

### Ready-to-Use Utilities

Include `hw.css` in your HTML and start using utility classes immediately:

```html
<link rel="stylesheet" href="hw.css">
<button class="p-4 bg-primary-500 rounded hover:bg-primary-600">
  Click me
</button>
```

No build tools required. No configuration needed. Just plain CSS.

### Custom CSS Generation

Generate optimized CSS with your brand colors and preferences:

```bash
hw build --minify -o dist/custom.css
```

Configure once in `hwconf.json`:

```json
{
  "colorMap": {
    "brand": "#ff6b6b",
    "dark": "#1a1a2e"
  },
  "ignore": ["animations"]
}
```

### Component-Based CSS (HWC)

Write maintainable component styles using the HeadWater Component (HWC) language:

```hwc
$btnBase = px-4 py-2 rounded font-medium;

.btn-primary = bg-blue-500 text-white $btnBase;
.btn-primary:hover = bg-blue-600;
```

Compile to standard CSS:

```bash
hw compile button.hwc -o button.css
```

### Production Optimization

Scan your project and extract only the utilities you actually use:

```bash
hw scan ./src -o final.css
```

This typically reduces CSS size by 80-90% compared to full utility frameworks.

## Installation

```bash
npm install -g @uniantaradev/headwater
```

Or use it directly without installation:

```bash
npx @uniantaradev/headwater init
```

## Quick Start

### 1. Initialize Project

```bash
hw init
```

Creates `hwconf.json` with sensible defaults.

### 2. Generate CSS

```bash
hw build
```

Outputs `headwater.css` ready for production.

### 3. Add Interactive Variants

```bash
hw build --interactive --group-hover --dark-mode
```

Generates hover, focus, active states and more.

### 4. Optimize for Production

```bash
hw scan ./src -o dist/final.css
```

Extracts only used classes from your codebase.

## CLI Commands

### `hw build`

Generate utility CSS from configuration.

```bash
hw build [config] -o output.css --minify
```

**Options:**
- `-o, --output` - Output file path
- `--minify` - Minify CSS output
- `--interactive` - Generate hover, focus, active variants
- `--group-hover` - Enable group-hover utilities
- `--dark-mode` - Enable dark mode variants

### `hw scan`

Extract and bundle only used utilities.

```bash
hw scan <path> -o final.css --ext "html,jsx,vue"
```

**Options:**
- `-o, --output` - Output file path
- `--ext` - File extensions to scan
- `--dry` - Preview found classes without generating CSS

### `hw compile`

Compile HWC component files to CSS.

```bash
hw compile button.hwc -o button.css
```

**Options:**
- `-o, --output` - Output file path
- `--base` - Custom base CSS file
- `--strict` - Fail on unknown utilities

### `hw info`

Display configuration and statistics.

```bash
hw info
```

Shows size information, active generators, and color palette.

## Configuration

Edit `hwconf.json` to customize your build:

```json
{
  "colorMap": {
    "primary": "#3b82f6",
    "secondary": "#8b5cf6"
  },
  "ignore": ["animations", "filters"],
  "minify": false,
  "comments": true
}
```

**Available Options:**

- `colorMap` - Define custom colors (merged with defaults)
- `ignore` - Skip specific generator modules
- `minify` - Compress output CSS
- `comments` - Include section comments

**Available Generators:**

`reset`, `colors`, `spacing`, `sizing`, `positioning`, `border`, `display`, `flex`, `grid`, `typography`, `effects`, `filters`, `animations`, `interaction`, `media`, `gradients`

## HWC Language

HeadWater Component (HWC) is a minimal DSL for writing component-scoped CSS using utility tokens.

### Syntax

```hwc
// Define reusable mixins
$spacing = p-4 m-2;

// Assign utilities to selectors
.card = bg-white rounded shadow $spacing;

// Add state variants
.card:hover = shadow-lg;
```

### Features

- **Mixins** - Reusable utility groups with `$name`
- **Variants** - Pseudo-classes like `:hover`, `:focus`, `:active`
- **Composition** - Combine utilities and mixins freely
- **Type Safety** - Validates utilities against your base CSS

### Example

```hwc
// Button system
$btn = px-4 py-2 rounded font-medium transition;

.btn-primary = $btn bg-blue-500 text-white;
.btn-primary:hover = bg-blue-600;
.btn-primary:active = bg-blue-700;

.btn-secondary = $btn bg-gray-200 text-gray-800;
.btn-secondary:hover = bg-gray-300;
```

Compiles to standard CSS with all utilities resolved.

## Programmatic API

Use HeadWater in your Node.js scripts:

```javascript
const { HeadWaterGen, HWCompiler, cssToObject } = require('headwater-cli/headwater');

// Generate CSS
const css = HeadWaterGen.generateCSS({
  colorMap: { brand: '#ff6b6b' },
  minify: true
});

// Compile HWC
const compiler = new HWCompiler();
const result = compiler.compile(hwcSource, baseCss);

console.log(result.css);
```

## Why HeadWater?

### For Prototyping

Drop `hw.css` into any HTML file and start building immediately. No setup, no configuration, no build process.

### For Production

Generate lean, customized CSS that matches your design system. Include only what you need.

### For Component Libraries

Write maintainable component styles with HWC. Keep utility composition explicit and version-controlled.

### For Teams

Configuration-driven generation ensures consistent output across environments. One `hwconf.json`, many builds.

## Comparison

| Feature | HeadWater | Tailwind CSS | Bootstrap |
|---------|-----------|--------------|-----------|
| Browser-ready CSS | Yes | No | Yes |
| Utility generation | Yes | Yes | No |
| Custom DSL | Yes (HWC) | No | No |
| Zero dependencies | Yes | No | No |
| Build-free mode | Yes | No | Yes |
| Tree-shaking | Yes | Yes | Partial |
| JIT compilation | No | Yes | No |

## Performance

**Full Build:**
- Uncompressed: ~156 KB
- Minified: ~99 KB
- Gzipped: ~18 KB

**After Scanning (typical project):**
- Uncompressed: ~23 KB
- Minified: ~15 KB
- Gzipped: ~4 KB

85-90% size reduction for production builds.

## Browser Support

All modern browsers supporting CSS custom properties:
- Chrome/Edge 49+
- Firefox 31+
- Safari 9.1+
- Opera 36+

No polyfills required.


## License

MIT License - see LICENSE file for details.

## Links

- GitHub: https://github.com/yourusername/headwater
- Documentation: https://headwater.dev
- NPM: https://npmjs.com/package/headwater-cli
- Issues: https://github.com/yourusername/headwater/issues