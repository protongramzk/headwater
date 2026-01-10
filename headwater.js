class Color {
    static hexToRgb(hexColor) {
        hexColor = hexColor.replace('#', '');
        return [
            parseInt(hexColor.slice(0, 2), 16),
            parseInt(hexColor.slice(2, 4), 16),
            parseInt(hexColor.slice(4, 6), 16)
        ];
    }
    static rgbToHex(rgb) {
        return `#${rgb[0].toString(16).padStart(2, '0')}${rgb[1].toString(16).padStart(2, '0')}${rgb[2].toString(16).padStart(2, '0')}`;
    }
    static lerpColor(colorRgb, targetRgb, factor) {
        return colorRgb.map((c, i) => Math.round(c + (targetRgb[i] - c) * factor));
    }
    static generateColors(colorMap) {
        let css = "/* --- Color System (Smart Shading) --- */\n";
        const white = [255, 255, 255];
        const black = [0, 0, 0];
        for (const [name, hexVal] of Object.entries(colorMap)) {
            const baseRgb = Color.hexToRgb(hexVal);
            const shades = {};
            shades[100] = Color.lerpColor(baseRgb, white, 0.8);
            shades[200] = Color.lerpColor(baseRgb, white, 0.6);
            shades[300] = Color.lerpColor(baseRgb, white, 0.4);
            shades[400] = Color.lerpColor(baseRgb, white, 0.2);
            shades[500] = baseRgb;
            shades[600] = Color.lerpColor(baseRgb, black, 0.2);
            shades[700] = Color.lerpColor(baseRgb, black, 0.4);
            shades[800] = Color.lerpColor(baseRgb, black, 0.6);
            shades[900] = Color.lerpColor(baseRgb, black, 0.8);
            css += `\n/* Color: ${name} */\n`;
            for (const [level, rgbVal] of Object.entries(shades)) {
                const h = Color.rgbToHex(rgbVal);
                css += `.text-${name}-${level} { color: ${h}; }\n`;
                css += `.bg-${name}-${level} { background-color: ${h}; }\n`;
            }
            css += `.text-${name} { color: ${hexVal}; }\n`;
            css += `.bg-${name} { background-color: ${hexVal}; }\n`;
        }
        return css;
    }
}
class Sizing {
    static generateSizing(limit = 20, step = 0.25) {
        let css = "/* --- Sizing System (Width & Height) --- */\n";
        for (let i = 0; i <= limit; i++) {
            const value = i * step;
            css += `.w-${i} { width: ${value}rem; }\n`;
            css += `.h-${i} { height: ${value}rem; }\n`;
            css += `.min-w-${i} { min-width: ${value}rem; }\n`;
            css += `.min-h-${i} { min-height: ${value}rem; }\n`;
        }
        const fractions = {
            '1/2': '50%', '1/3': '33.333333%', '2/3': '66.666667%',
            '1/4': '25%', '3/4': '75%', 'full': '100%', 'screen': '100vw'
        };
        const hFractions = { ...fractions, 'screen': '100vh' };
        for (const [key, val] of Object.entries(fractions)) {
            css += `.w-${key} { width: ${val}; }\n`;
        }
        for (const [key, val] of Object.entries(hFractions)) {
            css += `.h-${key} { height: ${val}; }\n`;
        }
        css += ".w-auto { width: auto; }\n";
        css += ".h-auto { height: auto; }\n";
        return css;
    }
}
class Positioning {
    static generatePositioning(limit = 10, step = 0.25) {
        let css = "/* --- Positioning System --- */\n";
        const types = ['static', 'fixed', 'absolute', 'relative', 'sticky'];
        types.forEach(t => css += `.${t} { position: ${t}; }\n`);
        for (let i = 0; i <= limit; i++) {
            const value = i * step;
            css += `.top-${i} { top: ${value}rem; }\n`;
            css += `.right-${i} { right: ${value}rem; }\n`;
            css += `.bottom-${i} { bottom: ${value}rem; }\n`;
            css += `.left-${i} { left: ${value}rem; }\n`;
            css += `.inset-${i} { top: ${value}rem; right: ${value}rem; bottom: ${value}rem; left: ${value}rem; }\n`;
        }
        const zIndexes = [0, 10, 20, 30, 40, 50, 'auto'];
        zIndexes.forEach(z => {
            css += `.z-${z} { z-index: ${z}; }\n`;
        });
        return css;
    }
}
class Effects {
    static generateEffects() {
        let css = "/* --- Effects System --- */\n";
        css += `
.shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.shadow { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); }
.shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
.shadow-xl { box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
.shadow-2xl { box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); }
.shadow-inner { box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05); }
.shadow-none { box-shadow: none; }
`;
        const opacities = [0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100];
        opacities.forEach(o => {
            css += `.opacity-${o} { opacity: ${o / 100}; }\n`;
        });
        css += `
.transition { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.transition-opacity { transition-property: opacity; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.duration-75 { transition-duration: 75ms; }
.duration-100 { transition-duration: 100ms; }
.duration-150 { transition-duration: 150ms; }
.duration-200 { transition-duration: 200ms; }
.duration-300 { transition-duration: 300ms; }
.duration-500 { transition-duration: 500ms; }
.duration-700 { transition-duration: 700ms; }
.duration-1000 { transition-duration: 1000ms; }
.ease-linear { transition-timing-function: linear; }
.ease-in { transition-timing-function: cubic-bezier(0.4, 0, 1, 1); }
.ease-out { transition-timing-function: cubic-bezier(0, 0, 0.2, 1); }
.ease-in-out { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
`;
        for (let i = 0; i <= 100; i += 50) { 
            css += `.scale-${i} { transform: scale(${i / 100}); }\n`;
        }
        for (let i = 0; i <= 100; i += 50) {
            css += `.scale-x-${i} { transform: scaleX(${i / 100}); }\n`;
            css += `.scale-y-${i} { transform: scaleY(${i / 100}); }\n`;
        }
        const rotateDegrees = [0, 1, 2, 3, 6, 12, 45, 90, 180]; 
        rotateDegrees.forEach(deg => {
            css += `.rotate-${deg} { transform: rotate(${deg}deg); }\n`;
            css += `.-rotate-${deg} { transform: rotate(-${deg}deg); }\n`; 
        });
        for (let i = 0; i <= 10; i++) { 
            const val = i * 0.25;
            css += `.translate-x-${i} { transform: translateX(${val}rem); }\n`;
            css += `.-translate-x-${i} { transform: translateX(-${val}rem); }\n`;
            css += `.translate-y-${i} { transform: translateY(${val}rem); }\n`;
            css += `.-translate-y-${i} { transform: translateY(-${val}rem); }\n`;
        }
        css += `.translate-x-full { transform: translateX(100%); }\n`;
        css += `.-translate-x-full { transform: translateX(-100%); }\n`;
        css += `.translate-y-full { transform: translateY(100%); }\n`;
        css += `.-translate-y-full { transform: translateY(-100%); }\n`;
        return css;
    }
}
class Spacing {
    static generateSpacing(limit = 20, step = 0.25) {
        let css = "/* --- Spacing System (Padding & Margin) --- */\n";
        css += ".mx-auto { margin-left: auto; margin-right: auto; }\n";
        css += ".w-100 { width: 100%; }\n";
        css += ".w-full { width: 100%; }\n";
        for (let i = 0; i <= limit; i++) {
            const value = i * step;
            css += `.p-${i} { padding: ${value}rem; }\n`;
            css += `.px-${i} { padding-left: ${value}rem; padding-right: ${value}rem; }\n`;
            css += `.py-${i} { padding-top: ${value}rem; padding-bottom: ${value}rem; }\n`;
            css += `.m-${i} { margin: ${value}rem; }\n`;
            css += `.mt-${i} { margin-top: ${value}rem; }\n`;
            css += `.mb-${i} { margin-bottom: ${value}rem; }\n`;
            css += `.mr-${i} { margin-right: ${value}rem; }\n`;
            css += `.ml-${i} { margin-left: ${value}rem; }\n`;
        }
        return css;
    }
}
class Flex {
    static generateFlex() {
        let css = "/* --- Flexbox System --- */\n";
        css += ".flex { display: flex; }\n";
        css += ".inline-flex { display: inline-flex; }\n";
        const directions = { row: 'row', 'row-rev': 'row-reverse', col: 'column', 'col-rev': 'column-reverse' };
        for (const [key, val] of Object.entries(directions)) {
            css += `.flex-${key} { flex-direction: ${val}; }\n`;
        }
        const justify = { start: 'flex-start', end: 'flex-end', center: 'center', between: 'space-between', around: 'space-around' };
        for (const [key, val] of Object.entries(justify)) {
            css += `.justify-${key} { justify-content: ${val}; }\n`;
        }
        const items = { start: 'flex-start', end: 'flex-end', center: 'center', baseline: 'baseline', stretch: 'stretch' };
        for (const [key, val] of Object.entries(items)) {
            css += `.items-${key} { align-items: ${val}; }\n`;
        }
        css += ".flex-1 { flex: 1 1 0%; }\n";
        css += ".flex-auto { flex: 1 1 auto; }\n";
        return css;
    }
}
class Grid {
    static generateGrid() {
        let css = " /* --- Grid System --- */\n";
        css += ".grid { display: grid; }\n";
        for (let i = 1; i <= 12; i++) {
            css += `.grid-cols-${i} { grid-template-columns: repeat(${i}, minmax(0, 1fr)); }\n`;
        }
        for (let i = 1; i <= 12; i++) {
            css += `.col-span-${i} { grid-column: span ${i} / span ${i}; }\n`;
        }
        for (let i = 0; i < 11; i++) {
            const value = i * 0.25;
            css += `.gap-${i} { gap: ${value}rem; }\n`;
        }
        return css;
    }
}
class Typography {
    static generateTypography() {
        let css = "/* --- Typography System --- */\n";
        const sizes = { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem' };
        for (const [label, val] of Object.entries(sizes)) {
            css += `.text-${label} { font-size: ${val}; }\n`;
        }
        for (let weight = 100; weight <= 900; weight += 100) {
            css += `.fw-${weight} { font-weight: ${weight}; }\n`;
        }
        css += ".font-bold { font-weight: 700; }\n";
        css += ".font-medium { font-weight: 500; }\n";
        css += ".font-normal { font-weight: 400; }\n";
        for (const align of ['left', 'center', 'right', 'justify']) {
            css += `.text-${align} { text-align: ${align}; }\n`;
        }
        return css;
    }
}
class Border {
    static generateBorder() {
        let css = "/* --- Border System --- */\n";
        const widths = [0, 1, 2, 4, 8];
        widths.forEach(w => {
            css += `.border-${w} { border-width: ${w}px; }\n`;
            css += `.border-t-${w} { border-top-width: ${w}px; }\n`;
            css += `.border-r-${w} { border-right-width: ${w}px; }\n`;
            css += `.border-b-${w} { border-bottom-width: ${w}px; }\n`;
            css += `.border-l-${w} { border-left-width: ${w}px; }\n`;
        });
        const styles = ['solid', 'dashed', 'dotted', 'double', 'none'];
        styles.forEach(s => css += `.border-${s} { border-style: ${s}; }\n`);
        const radii = {
            'none': '0px', 'sm': '0.125rem', 'DEFAULT': '0.25rem',
            'md': '0.375rem', 'lg': '0.5rem', 'xl': '0.75rem',
            '2xl': '1rem', '3xl': '1.5rem', 'full': '9999px'
        };
        for (const [key, val] of Object.entries(radii)) {
            const suffix = key === 'DEFAULT' ? '' : `-${key}`;
            css += `.rounded${suffix} { border-radius: ${val}; }\n`;
            css += `.rounded-t${suffix} { border-top-left-radius: ${val}; border-top-right-radius: ${val}; }\n`;
            css += `.rounded-r${suffix} { border-top-right-radius: ${val}; border-bottom-right-radius: ${val}; }\n`;
            css += `.rounded-b${suffix} { border-bottom-left-radius: ${val}; border-bottom-right-radius: ${val}; }\n`;
            css += `.rounded-l${suffix} { border-top-left-radius: ${val}; border-bottom-left-radius: ${val}; }\n`;
        }
        return css;
    }
}
class Display {
    static generateDisplay() {
        let css = "/* --- Display & Visibility --- */\n";
        const displays = ['block', 'inline-block', 'inline', 'flex', 'inline-flex',
            'grid', 'inline-grid', 'hidden', 'none', 'table', 'table-cell'];
        displays.forEach(d => {
            const val = d === 'hidden' ? 'none' : d;
            css += `.${d} { display: ${val}; }\n`;
        });
        css += `.visible { visibility: visible; }\n`;
        css += `.invisible { visibility: hidden; }\n`;
        const overflows = ['auto', 'hidden', 'visible', 'scroll'];
        overflows.forEach(o => {
            css += `.overflow-${o} { overflow: ${o}; }\n`;
            css += `.overflow-x-${o} { overflow-x: ${o}; }\n`;
            css += `.overflow-y-${o} { overflow-y: ${o}; }\n`;
        });
        return css;
    }
}
class Filters {
    static generateFilters() {
        let css = "/* --- Filters & Effects --- */\n";
        const blurs = {
            'none': '0', 'sm': '4px', 'DEFAULT': '8px',
            'md': '12px', 'lg': '16px', 'xl': '24px', '2xl': '40px'
        };
        for (const [key, val] of Object.entries(blurs)) {
            const suffix = key === 'DEFAULT' ? '' : `-${key}`;
            css += `.blur${suffix} { filter: blur(${val}); }\n`;
            css += `.backdrop-blur${suffix} { backdrop-filter: blur(${val}); }\n`;
        }
        const brightness = [0, 50, 75, 90, 95, 100, 105, 110, 125, 150, 200];
        brightness.forEach(b => {
            css += `.brightness-${b} { filter: brightness(${b / 100}); }\n`;
        });
        css += `.grayscale { filter: grayscale(100%); }\n`;
        css += `.grayscale-0 { filter: grayscale(0%); }\n`;
        return css;
    }
}
class Animation {
    static generateAnimations() {
        let css = "/* --- Animations --- */\n";
        css += `
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes ping {
  75%, 100% { transform: scale(2); opacity: 0; }
}
@keyframes pulse {
  50% { opacity: .5; }
}
@keyframes bounce {
  0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
  50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
}
`;
        const animations = {
            'spin': 'spin 1s linear infinite',
            'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
            'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            'bounce': 'bounce 1s infinite'
        };
        for (const [name, value] of Object.entries(animations)) {
            css += `.animate-${name} { animation: ${value}; }\n`;
        }
        return css;
    }
}
class Interaction {
    static generateInteraction() {
        let css = "/* --- Cursor & Interaction --- */\n";
        const cursors = ['auto', 'default', 'pointer', 'wait', 'text',
            'move', 'help', 'not-allowed', 'none', 'grab', 'grabbing'];
        cursors.forEach(c => css += `.cursor-${c} { cursor: ${c}; }\n`);
        css += `.pointer-events-none { pointer-events: none; }\n`;
        css += `.pointer-events-auto { pointer-events: auto; }\n`;
        css += `.select-none { user-select: none; }\n`;
        css += `.select-text { user-select: text; }\n`;
        css += `.select-all { user-select: all; }\n`;
        css += `.select-auto { user-select: auto; }\n`;
        return css;
    }
}
class Media {
    static generateMedia() {
        let css = "/* --- Media Utilities --- */\n";
        const ratios = {
            'auto': 'auto', 'square': '1/1', 'video': '16/9',
            'portrait': '3/4', 'wide': '21/9'
        };
        for (const [key, val] of Object.entries(ratios)) {
            css += `.aspect-${key} { aspect-ratio: ${val}; }\n`;
        }
        const fits = ['contain', 'cover', 'fill', 'none', 'scale-down'];
        fits.forEach(f => css += `.object-${f} { object-fit: ${f}; }\n`);
        const positions = ['bottom', 'center', 'left', 'right', 'top'];
        positions.forEach(p => css += `.object-${p} { object-position: ${p}; }\n`);
        return css;
    }
}
class FlexExtended {
    static generateFlexGap() {
        let css = "/* --- Flex Gap --- */\n";
        for (let i = 0; i <= 20; i++) {
            const value = i * 0.25;
            css += `.gap-${i} { gap: ${value}rem; }\n`;
            css += `.gap-x-${i} { column-gap: ${value}rem; }\n`;
            css += `.gap-y-${i} { row-gap: ${value}rem; }\n`;
        }
        css += `.flex-wrap { flex-wrap: wrap; }\n`;
        css += `.flex-nowrap { flex-wrap: nowrap; }\n`;
        css += `.flex-wrap-reverse { flex-wrap: wrap-reverse; }\n`;
        return css;
    }
}
class Gradient {
    static generateGradients(colorMap) {
        let css = "/* --- Gradient Utilities --- */\n";
        const directions = {
            't': 'to top', 'tr': 'to top right', 'r': 'to right',
            'br': 'to bottom right', 'b': 'to bottom', 'bl': 'to bottom left',
            'l': 'to left', 'tl': 'to top left'
        };
        for (const [key, val] of Object.entries(directions)) {
            css += `.bg-gradient-${key} { background-image: linear-gradient(${val}, var(--tw-gradient-stops)); }\n`;
        }
        for (const [name, hexVal] of Object.entries(colorMap)) {
            css += `.from-${name} { --tw-gradient-from: ${hexVal}; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent); }\n`;
            css += `.via-${name} { --tw-gradient-stops: var(--tw-gradient-from), ${hexVal}, var(--tw-gradient-to, transparent); }\n`;
            css += `.to-${name} { --tw-gradient-to: ${hexVal}; }\n`;
        }
        return css;
    }
}
class Breakpoints {
    static generateBreakpoints(cssGenerators) {
        let css = "/* --- Responsive Breakpoints --- */\n";
        const breakpoints = {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px'
        };
        for (const [name, width] of Object.entries(breakpoints)) {
            css += `@media (min-width: ${width}) {\n`;
            css += `}\n`;
        }
        return css;
    }
}
class TypographyExtended {
    static generateAdvancedTypography() {
        let css = "/* --- Advanced Typography --- */\n";
        const lineHeights = {
            'none': '1', 'tight': '1.25', 'snug': '1.375',
            'normal': '1.5', 'relaxed': '1.625', 'loose': '2'
        };
        for (const [key, val] of Object.entries(lineHeights)) {
            css += `.leading-${key} { line-height: ${val}; }\n`;
        }
        const tracking = {
            'tighter': '-0.05em', 'tight': '-0.025em', 'normal': '0em',
            'wide': '0.025em', 'wider': '0.05em', 'widest': '0.1em'
        };
        for (const [key, val] of Object.entries(tracking)) {
            css += `.tracking-${key} { letter-spacing: ${val}; }\n`;
        }
        css += `.underline { text-decoration-line: underline; }\n`;
        css += `.line-through { text-decoration-line: line-through; }\n`;
        css += `.no-underline { text-decoration-line: none; }\n`;
        css += `.uppercase { text-transform: uppercase; }\n`;
        css += `.lowercase { text-transform: lowercase; }\n`;
        css += `.capitalize { text-transform: capitalize; }\n`;
        css += `.normal-case { text-transform: none; }\n`;
        return css;
    }
}
class Reset {
    static generateReset() {
        return `                                      
*, ::before, ::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: currentColor;
}
html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -moz-tab-size: 4;
  tab-size: 4;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
body {
  margin: 0;
  line-height: inherit;
}
hr {
  height: 0;
  color: inherit;
  border-top-width: 1px;
}
img, svg, video, canvas, audio {
  display: block;
  vertical-align: middle;
  max-width: 100%;
  height: auto;
}
button, input, optgroup, select, textarea {
  font-family: inherit;
  font-size: 100%;
  margin: 0;
  padding: 0;
  line-height: inherit;
  color: inherit;
}
button {
  background-color: transparent;
  background-image: none;
  cursor: pointer;
}
ul, ol {
  list-style: none;
  margin: 0;
  padding: 0;
}
/* --- PyWind Reset & Preflight --- */
*, ::before, ::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: currentColor;
}
html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -moz-tab-size: 4;
  tab-size: 4;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
body {
  margin: 0;
  line-height: inherit;
}
hr {
  height: 0;
  color: inherit;
  border-top-width: 1px;
}
img, svg, video, canvas, audio {
  display: block;
  vertical-align: middle;
  max-width: 100%;
  height: auto;
}
button, input, optgroup, select, textarea {
  font-family: inherit;
  font-size: 100%;
  margin: 0;
  padding: 0;
  line-height: inherit;
  color: inherit;
}
button {
  background-color: transparent;
  background-image: none;
  cursor: pointer;
}
ul, ol {
  list-style: none;
  margin: 0;
  padding: 0;
}
`;
    }
}
class HeadWaterGen {
    static defaultColorMap = {
        white: '#ffffff',
        black: '#000000',
        gray: '#6b7280',
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
        red: '#ef4444',
        orange: '#f97316',
        amber: '#f59e0b',
        yellow: '#eab308',
        lime: '#84cc16',
        green: '#22c55e',
        emerald: '#10b981',
        teal: '#14b8a6',
        cyan: '#06b6d4',
        sky: '#0ea5e9',
        blue: '#3b82f6',
        indigo: '#6366f1',
        violet: '#8b5cf6',
        purple: '#a855f7',
        fuchsia: '#d946ef',
        pink: '#ec4899',
        rose: '#f43f5e'
    };
    static generators = {
        'reset': () => Reset.generateReset(),
        'colors': (colorMap) => Color.generateColors(colorMap),
        'spacing': () => Spacing.generateSpacing(),
        'sizing': () => Sizing.generateSizing(),
        'positioning': () => Positioning.generatePositioning(),
        'border': () => Border.generateBorder(),
        'display': () => Display.generateDisplay(),
        'flex': () => Flex.generateFlex(),
        'flex-gap': () => FlexExtended.generateFlexGap(),
        'grid': () => Grid.generateGrid(),
        'typography': () => Typography.generateTypography(),
        'typography-advanced': () => TypographyExtended.generateAdvancedTypography(),
        'effects': () => Effects.generateEffects(),
        'filters': () => Filters.generateFilters(),
        'animations': () => Animation.generateAnimations(),
        'media': () => Media.generateMedia(),
        'gradients': (colorMap) => Gradient.generateGradients(colorMap)
    };
    static generateCSS(options = {}) {
        const { colorMap = {}, ignore = [], include = null, minify = false, comments = true, interactive = false } = options;
        const finalColorMap = {
            ...this.defaultColorMap,
            ...colorMap
        };
        const normalizedIgnore = ignore.map(i => i.startsWith('-') ? i.slice(1) : i);
        let resetCSS = '';
        let baseCSS = '';
        if (!normalizedIgnore.includes('reset') &&
            (include === null || include.includes('reset'))) {
            resetCSS = this.generators.reset();
        }
        for (const [name, generator] of Object.entries(this.generators)) {
            if (name === 'reset')
                continue;
            if (normalizedIgnore.includes(name))
                continue;
            if (include !== null && !include.includes(name))
                continue;
            try {
                if (name === 'colors' || name === 'gradients') {
                    baseCSS += generator(finalColorMap);
                }
                else {
                    baseCSS += generator();
                }
            }
            catch (err) {
                console.error(`Error generating ${name}:`, err);
            }
        }
        let interactiveCSS = '';
        if (interactive) {
            const interactiveOptions = typeof interactive === 'object' ? interactive : {};
            interactiveCSS = this.generateInteractive(cssToObject(baseCSS), interactiveOptions);
        }
        let css = resetCSS + baseCSS + interactiveCSS;
        if (!comments) {
            css = css.replace(/\/\*[\s\S]*?\*\//g, '');
        }
        if (minify) {
            css = this.minifyCSS(css);
        }
        return css;
    }
    static generateInteractive(baseCss, options = {}) {
        const { ignore = [], only = null, groupHover = false, darkMode = false } = options;
        const allVariants = {
            'hover': (selector, rules) => this._generateVariant(selector, 'hover', rules, ':hover'),
            'focus': (selector, rules) => this._generateVariant(selector, 'focus', rules, ':focus'),
            'active': (selector, rules) => this._generateVariant(selector, 'active', rules, ':active'),
            'focus-visible': (selector, rules) => this._generateVariant(selector, 'focus-visible', rules, ':focus-visible'),
            'focus-within': (selector, rules) => this._generateVariant(selector, 'focus-within', rules, ':focus-within'),
            'disabled': (selector, rules) => this._generateVariant(selector, 'disabled', rules, ':disabled'),
            'visited': (selector, rules) => this._generateVariant(selector, 'visited', rules, ':visited'),
            'checked': (selector, rules) => this._generateVariant(selector, 'checked', rules, ':checked'),
            'first': (selector, rules) => this._generateVariant(selector, 'first', rules, ':first-child'),
            'last': (selector, rules) => this._generateVariant(selector, 'last', rules, ':last-child'),
            'odd': (selector, rules) => this._generateVariant(selector, 'odd', rules, ':nth-child(odd)'),
            'even': (selector, rules) => this._generateVariant(selector, 'even', rules, ':nth-child(even)'),
        };
        if (groupHover) {
            allVariants['group-hover'] = (selector, rules) => this._generateGroupVariant(selector, 'group-hover', rules, ':hover');
        }
        if (darkMode) {
            allVariants['dark'] = (selector, rules) => this._generateDarkVariant(selector, 'dark', rules);
        }
        let activeVariants = {};
        if (only && Array.isArray(only)) {
            only.forEach(variant => {
                if (allVariants[variant]) {
                    activeVariants[variant] = allVariants[variant];
                }
            });
        }
        else {
            activeVariants = { ...allVariants };
            ignore.forEach(variant => {
                delete activeVariants[variant];
            });
        }
        let css = '/* --- Interactive Variants --- */\n\n';
        for (const [variantName, generator] of Object.entries(activeVariants)) {
            css += `/* ${variantName} */\n`;
            for (const [className, rules] of Object.entries(baseCss)) {
                css += generator(className, rules);
            }
            css += '\n';
        }
        return css;
    }
    static _generateVariant(className, variantName, rules, pseudoClass) {
        const escapedVariant = this._escapeSelector(variantName);
        let css = `.${escapedVariant}\\:${className}${pseudoClass} {\n`;
        for (const [prop, value] of Object.entries(rules)) {
            css += `  ${prop}: ${value};\n`;
        }
        css += '}\n';
        return css;
    }
    static _generateGroupVariant(className, variantName, rules, pseudoClass) {
        const escapedVariant = this._escapeSelector(variantName);
        let css = `.group${pseudoClass} .${escapedVariant}\\:${className} {\n`;
        for (const [prop, value] of Object.entries(rules)) {
            css += `  ${prop}: ${value};\n`;
        }
        css += '}\n';
        return css;
    }
    static _escapeSelector(str) {
        return str.replace(/:/g, '\\:').replace(/\//g, '\\/');
    }
    static minifyCSS(css) {
        return css
            .replace(/\/\*[\s\S]*?\*\//g, '') 
            .replace(/\s+/g, ' ') 
            .replace(/\s*{\s*/g, '{') 
            .replace(/\s*}\s*/g, '}') 
            .replace(/\s*:\s*/g, ':') 
            .replace(/\s*;\s*/g, ';') 
            .replace(/;\s*}/g, '}') 
            .trim();
    }
    static getSize(options = {}) {
        const css = this.generateCSS(options);
        return sizeCalculate(css);
    }
    static listGenerators() {
        return Object.keys(this.generators);
    }
    static generateOnly(generatorNames, options = {}) {
        return this.generateCSS({
            ...options,
            include: Array.isArray(generatorNames) ? generatorNames : [generatorNames]
        });
    }
    static generateExcept(generatorNames, options = {}) {
        return this.generateCSS({
            ...options,
            ignore: Array.isArray(generatorNames) ? generatorNames : [generatorNames]
        });
    }
}
function compareGeneratorSizes(colorMap = {}) {
    const generators = HeadWaterGen.listGenerators();
    const results = [];
    console.log('=== Analisis Ukuran Per Generator ===\n');
    generators.forEach(gen => {
        const css = HeadWaterGen.generateOnly(gen, { colorMap });
        const size = sizeCalculate(css);
        results.push({
            generator: gen,
            size: size.kb,
            formatted: size.formatted
        });
    });
    results.sort((a, b) => b.size - a.size);
    results.forEach((r, i) => {
        console.log(`${i + 1}. ${r.generator.padEnd(20)} - ${r.formatted}`);
    });
    const totalSize = HeadWaterGen.getSize({ colorMap });
    console.log(`\nTotal: ${totalSize.formatted}`);
    return results;
}
function generateReport(options = {}) {
    const fullCSS = HeadWaterGen.generateCSS(options);
    const fullSize = sizeCalculate(fullCSS);
    const minifiedCSS = HeadWaterGen.generateCSS({
        ...options,
        minify: true,
        comments: false
    });
    const minifiedSize = sizeCalculate(minifiedCSS);
    const savedBytes = fullSize.bytes - minifiedSize.bytes;
    const savedPercent = ((savedBytes / fullSize.bytes) * 100).toFixed(2);
    const report = {
        full: {
            size: fullSize.formatted,
            bytes: fullSize.bytes,
            lines: fullCSS.split('\n').length
        },
        minified: {
            size: minifiedSize.formatted,
            bytes: minifiedSize.bytes
        },
        compression: {
            saved: sizeCalculate(String(savedBytes)).formatted,
            percent: savedPercent + '%'
        },
        generators: {
            total: HeadWaterGen.listGenerators().length,
            active: HeadWaterGen.listGenerators().length - (options.ignore?.length || 0),
            ignored: options.ignore || []
        }
    };
    return report;
}
function printReport(options = {}) {
    const report = generateReport(options);
    console.log('\n╔══════════════════════════════════════╗');
    console.log('║     HEADWATER CSS GENERATOR REPORT   ║');
    console.log('╚══════════════════════════════════════╝\n');
    console.log('📦 Full Version:');
    console.log(`   Size:  ${report.full.size}`);
    console.log(`   Lines: ${report.full.lines}`);
    console.log('\n⚡ Minified Version:');
    console.log(`   Size:  ${report.minified.size}`);
    console.log('\n💾 Compression:');
    console.log(`   Saved: ${report.compression.saved} (${report.compression.percent})`);
    console.log('\n🔧 Generators:');
    console.log(`   Total:   ${report.generators.total}`);
    console.log(`   Active:  ${report.generators.active}`);
    if (report.generators.ignored.length > 0) {
        console.log(`   Ignored: ${report.generators.ignored.join(', ')}`);
    }
    console.log('\n' + '─'.repeat(40) + '\n');
}
function cssToObject(css) {
    const result = {};
    css = css.replace(/\/\*[\s\S]*?\*\//g, "");
    const blocks = css.matchAll(/\.([a-zA-Z0-9-_]+)\s*\{([^}]+)\}/g);
    for (const match of blocks) {
        const className = match[1];
        const body = match[2].trim();
        const rules = {};
        body.split(";").forEach(line => {
            const l = line.trim();
            if (!l)
                return;
            const [prop, value] = l.split(":").map(s => s.trim());
            if (!prop || !value)
                return;
            rules[prop] = value;
        });
        result[className] = rules;
    }
    return result;
}
function getCategorized(cssObj, prefixMap) {
    const result = {};
    const entries = Object.entries(cssObj);
    for (const [className, rules] of entries) {
        let matchedCategory = null;
        for (const [prefix, category] of Object.entries(prefixMap)) {
            if (className.startsWith(prefix)) {
                matchedCategory = category;
                break;
            }
        }
        if (!matchedCategory)
            continue;
        if (!result[matchedCategory]) {
            result[matchedCategory] = {};
        }
        result[matchedCategory][className] = rules;
    }
    return result;
}
function sizeCalculate(str) {
    const bytes = new Blob([str]).size;
    const kb = bytes / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;
    let size, unit;
    if (gb >= 1) {
        size = gb;
        unit = 'GB';
    }
    else if (mb >= 1) {
        size = mb;
        unit = 'MB';
    }
    else if (kb >= 1) {
        size = kb;
        unit = 'KB';
    }
    else {
        size = bytes;
        unit = 'Bytes';
    }
    return {
        bytes: bytes,
        kb: parseFloat(kb.toFixed(2)),
        mb: parseFloat(mb.toFixed(2)),
        gb: parseFloat(gb.toFixed(4)),
        formatted: `${size.toFixed(2)} ${unit}`,
        auto: size.toFixed(2),
        unit: unit
    };
}
const TokenType = {
    IDENT: 'IDENT',
    SELECTOR: 'SELECTOR',
    EQUALS: 'EQUALS',
    SEMICOLON: 'SEMICOLON',
    COLON: 'COLON',
    DOLLAR: 'DOLLAR',
    EOF: 'EOF',
    COMMENT: 'COMMENT'
};
class Lexer {
    constructor(input) {
        this.input = input;
        this.pos = 0;
        this.line = 1;
        this.col = 1;
    }
    peek() {
        return this.input[this.pos];
    }
    advance() {
        const ch = this.input[this.pos];
        this.pos++;
        if (ch === '\n') {
            this.line++;
            this.col = 1;
        }
        else {
            this.col++;
        }
        return ch;
    }
    skipWhitespace() {
        while (this.peek() && /\s/.test(this.peek())) {
            this.advance();
        }
    }
    skipComment() {
        if (this.peek() === '/' && this.input[this.pos + 1] === '/') {
            while (this.peek() && this.peek() !== '\n') {
                this.advance();
            }
            return true;
        }
        return false;
    }
    readIdent() {
        let result = '';
        while (this.peek() && /[a-zA-Z0-9_-]/.test(this.peek())) {
            result += this.advance();
        }
        return result;
    }
    nextToken() {
        this.skipWhitespace();
        while (this.skipComment()) {
            this.skipWhitespace();
        }
        if (!this.peek()) {
            return { type: TokenType.EOF, value: null, line: this.line, col: this.col };
        }
        const ch = this.peek();
        const line = this.line;
        const col = this.col;
        if (ch === '=') {
            this.advance();
            return { type: TokenType.EQUALS, value: '=', line, col };
        }
        if (ch === ';') {
            this.advance();
            return { type: TokenType.SEMICOLON, value: ';', line, col };
        }
        if (ch === ':') {
            this.advance();
            return { type: TokenType.COLON, value: ':', line, col };
        }
        if (ch === '$') {
            this.advance();
            return { type: TokenType.DOLLAR, value: '$', line, col };
        }
        if (ch === '.' || ch === '#') {
            const prefix = this.advance();
            const ident = this.readIdent();
            return { type: TokenType.SELECTOR, value: prefix + ident, line, col };
        }
        if (/[a-zA-Z0-9_-]/.test(ch)) {
            const ident = this.readIdent();
            return { type: TokenType.IDENT, value: ident, line, col };
        }
        throw new Error(`Unexpected character '${ch}' at line ${line}, col ${col}`);
    }
    tokenize() {
        const tokens = [];
        let token;
        do {
            token = this.nextToken();
            if (token.type !== TokenType.COMMENT) {
                tokens.push(token);
            }
        } while (token.type !== TokenType.EOF);
        return tokens;
    }
}
class ASTNode {
    constructor(type) {
        this.type = type;
    }
}
class MixinNode extends ASTNode {
    constructor(name, utilities, line, col) {
        super('Mixin');
        this.name = name;
        this.utilities = utilities;
        this.line = line;
        this.col = col;
    }
}
class RuleNode extends ASTNode {
    constructor(selector, variant, utilities, line, col) {
        super('Rule');
        this.selector = selector;
        this.variant = variant;
        this.utilities = utilities;
        this.line = line;
        this.col = col;
    }
}
class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
    }
    peek() {
        return this.tokens[this.pos];
    }
    advance() {
        return this.tokens[this.pos++];
    }
    expect(type) {
        const token = this.peek();
        if (token.type !== type) {
            throw new Error(`Expected ${type} but got ${token.type} at line ${token.line}, col ${token.col}`);
        }
        return this.advance();
    }
    parse() {
        const statements = [];
        while (this.peek().type !== TokenType.EOF) {
            statements.push(this.parseStatement());
        }
        return statements;
    }
    parseStatement() {
        const token = this.peek();
        if (token.type === TokenType.DOLLAR) {
            return this.parseMixinDecl();
        }
        if (token.type === TokenType.SELECTOR || token.type === TokenType.IDENT) {
            return this.parseRuleDecl();
        }
        throw new Error(`Unexpected token ${token.type} at line ${token.line}, col ${token.col}`);
    }
    parseMixinDecl() {
        const dollarToken = this.expect(TokenType.DOLLAR);
        const nameToken = this.expect(TokenType.IDENT);
        this.expect(TokenType.EQUALS);
        const utilities = this.parseUtilityList();
        this.expect(TokenType.SEMICOLON);
        return new MixinNode(nameToken.value, utilities, dollarToken.line, dollarToken.col);
    }
    parseRuleDecl() {
        const { selector, variant, line, col } = this.parseSelector();
        this.expect(TokenType.EQUALS);
        const utilities = this.parseUtilityList();
        this.expect(TokenType.SEMICOLON);
        return new RuleNode(selector, variant, utilities, line, col);
    }
    parseSelector() {
        const token = this.peek();
        let selector = '';
        let variant = null;
        const line = token.line;
        const col = token.col;
        if (token.type === TokenType.SELECTOR) {
            selector = this.advance().value;
        }
        else if (token.type === TokenType.IDENT) {
            selector = this.advance().value;
        }
        if (this.peek().type === TokenType.COLON) {
            this.advance(); 
            const variantToken = this.expect(TokenType.IDENT);
            variant = variantToken.value;
        }
        return { selector, variant, line, col };
    }
    parseUtilityList() {
        const utilities = [];
        while (this.peek().type === TokenType.IDENT ||
            this.peek().type === TokenType.DOLLAR) {
            if (this.peek().type === TokenType.DOLLAR) {
                this.advance(); 
                const name = this.expect(TokenType.IDENT);
                utilities.push('$' + name.value);
            }
            else {
                const ident = this.advance();
                utilities.push(ident.value);
            }
        }
        return utilities;
    }
}
class HWCompiler {
    constructor(options = {}) {
        this.options = {
            warnings: options.warnings !== false, 
            strict: options.strict || false,
            ...options
        };
        this.mixins = new Map();
        this.warnings = [];
        this.errors = [];
    }
    compile(source, baseCssObject = {}) {
        try {
            const lexer = new Lexer(source);
            const tokens = lexer.tokenize();
            const parser = new Parser(tokens);
            const ast = parser.parse();
            this.collectMixins(ast);
            const rules = this.processRules(ast, baseCssObject);
            const css = this.emitCSS(rules);
            return {
                success: this.errors.length === 0,
                css,
                warnings: this.warnings,
                errors: this.errors,
                ast 
            };
        }
        catch (error) {
            this.errors.push(error.message);
            return {
                success: false,
                css: '',
                warnings: this.warnings,
                errors: this.errors
            };
        }
    }
    collectMixins(ast) {
        for (const node of ast) {
            if (node.type === 'Mixin') {
                if (this.mixins.has(node.name)) {
                    this.warn(`Mixin $${node.name} redefined at line ${node.line}`);
                }
                this.mixins.set(node.name, node.utilities);
            }
        }
    }
    processRules(ast, baseCssObject) {
        const rulesMap = new Map();
        for (const node of ast) {
            if (node.type === 'Rule') {
                const expandedUtilities = this.expandMixins(node.utilities, node.line);
                const cssProps = this.resolveUtilities(expandedUtilities, baseCssObject, node.line);
                const selectorKey = node.variant
                    ? `${node.selector}:${node.variant}`
                    : node.selector;
                if (rulesMap.has(selectorKey)) {
                    const existing = rulesMap.get(selectorKey);
                    rulesMap.set(selectorKey, { ...existing, ...cssProps });
                }
                else {
                    rulesMap.set(selectorKey, cssProps);
                }
            }
        }
        return rulesMap;
    }
    expandMixins(utilities, line, visited = new Set()) {
        const result = [];
        for (const util of utilities) {
            if (util.startsWith('$')) {
                const mixinName = util.slice(1);
                if (visited.has(mixinName)) {
                    this.error(`Circular mixin reference: $${mixinName} at line ${line}`);
                    continue;
                }
                if (!this.mixins.has(mixinName)) {
                    this.error(`Unknown mixin: $${mixinName} at line ${line}`);
                    continue;
                }
                visited.add(mixinName);
                const mixinUtils = this.mixins.get(mixinName);
                const expanded = this.expandMixins(mixinUtils, line, new Set(visited));
                result.push(...expanded);
                visited.delete(mixinName);
            }
            else {
                result.push(util);
            }
        }
        return result;
    }
    resolveUtilities(utilities, baseCssObject, line) {
        const cssProps = {};
        for (const util of utilities) {
            if (baseCssObject[util]) {
                Object.assign(cssProps, baseCssObject[util]);
            }
            else {
                this.warn(`Unknown utility: ${util} at line ${line}`);
            }
        }
        return cssProps;
    }
    emitCSS(rulesMap) {
        let css = '';
        for (const [selector, props] of rulesMap) {
            css += `${selector} {\n`;
            for (const [prop, value] of Object.entries(props)) {
                css += `  ${this.camelToKebab(prop)}: ${value};\n`;
            }
            css += '}\n\n';
        }
        return css.trim();
    }
    camelToKebab(str) {
        return str.replace(/([A-Z])/g, '-$1').toLowerCase();
    }
    warn(message) {
        if (this.options.warnings) {
            this.warnings.push(message);
        }
    }
    error(message) {
        if (this.options.strict) {
            throw new Error(message);
        }
        this.errors.push(message);
    }
}
function cssObjectToBaseCSS(cssObj) {
    const base = {};
    for (const [className, rules] of Object.entries(cssObj)) {
        base[className] = rules;
    }
    return base;
}
const HeadWater = {
    HeadWaterGen,
    HWCompiler,
    cssToObject,
    sizeCalculate
};
(function (root, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.HeadWater = factory();
    }
})(typeof self !== 'undefined' ? self : (typeof global !== 'undefined' ? global : this), function () {
    const HeadWater = {
    };
    return HeadWater;
});
export default (typeof module !== 'undefined' && module.exports) ? module.exports : HeadWater;