import fs from "fs";
import path from "path";
import { glob } from "glob";
import chalk from "chalk";
import headwater from "./headwater.js";
const { HeadWaterGen, HWCompiler, cssToObject, sizeCalculate } = headwater;
// ============================================
// UTILITIES
// ============================================
function loadConfig(configPath = './hwconf.json') {
    const fullPath = path.resolve(process.cwd(), configPath);
    if (!fs.existsSync(fullPath)) {
        console.log(chalk.yellow(`⚠ Config not found: ${configPath}`));
        console.log(chalk.yellow('Using default configuration\n'));
        return getDefaultConfig();
    }
    try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const config = JSON.parse(content);
        console.log(chalk.green(`✓ Loaded: ${configPath}\n`));
        return { ...getDefaultConfig(), ...config };
    }
    catch (error) {
        console.error(chalk.red(`✗ Failed to parse config: ${error.message}`));
        process.exit(1);
    }
}
function getDefaultConfig() {
    return {
        colorMap: {},
        ignore: [],
        minify: false,
        comments: true
    };
}
function log(symbol, message, value = '') {
    console.log(symbol, chalk.white(message), chalk.cyan(value));
}
function header(title) {
    console.log('\n' + chalk.bold.cyan(title));
    console.log(chalk.cyan('─'.repeat(title.length)) + '\n');
}
// ============================================
// COMMAND: BUILD
// ============================================
async function build(configPath, options) {
    header('🌊 HeadWater Build');
    const config = loadConfig(configPath);
    // Override with CLI options
    if (options.minify)
        config.minify = true;
    if (options.comments === false)
        config.comments = false;
    console.log(chalk.gray('Generating CSS...'));
    try {
        const css = HeadWaterGen.generateCSS(config);
        const size = sizeCalculate(css);
        const outputPath = path.resolve(process.cwd(), options.output);
        fs.writeFileSync(outputPath, css, 'utf-8');
        console.log();
        log(chalk.green('✓'), 'Output:', options.output);
        log(chalk.green('✓'), 'Size:', size.formatted);
        log(chalk.green('✓'), 'Minified:', config.minify ? 'Yes' : 'No');
        if (config.ignore && config.ignore.length > 0) {
            console.log();
            console.log(chalk.gray('Ignored:'), config.ignore.join(', '));
        }
        console.log();
        console.log(chalk.green('✓ Build complete!\n'));
    }
    catch (error) {
        console.error(chalk.red('✗ Build failed:'), error.message);
        process.exit(1);
    }
}
// ============================================
// COMMAND: SCAN
// ============================================
async function scan(targetPath, options) {
    header('🔍 HeadWater Scan');
    if (!fs.existsSync(targetPath)) {
        console.error(chalk.red('✗ Path not found:'), targetPath);
        process.exit(1);
    }
    try {
        // Generate base CSS
        console.log(chalk.gray('Generating base CSS...'));
        const config = loadConfig();
        const fullCSS = HeadWaterGen.generateCSS(config);
        const cssObj = cssToObject(fullCSS);
        // Scan files
        console.log(chalk.gray('Scanning project files...'));
        const extensions = options.ext.split(',').map(e => e.trim());
        const pattern = `${targetPath}/**/*.{${extensions.join(',')}}`;
        const files = await glob(pattern, {
            ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
        });
        const foundClasses = new Set();
        const classPattern = /class(?:Name)?=["'`]([^"'`]+)["'`]/g;
        for (const file of files) {
            const content = fs.readFileSync(file, 'utf-8');
            const matches = content.matchAll(classPattern);
            for (const match of matches) {
                const classList = match[1].split(/\s+/).filter(c => c.trim());
                classList.forEach(cls => foundClasses.add(cls));
            }
        }
        const classes = Array.from(foundClasses);
        console.log(chalk.green(`✓ Found ${classes.length} unique classes\n`));
        // Dry run
        if (options.dry) {
            console.log(chalk.bold('Classes found:'));
            classes.sort().forEach(cls => {
                const exists = cssObj[cls];
                const symbol = exists ? chalk.green('✓') : chalk.red('✗');
                console.log(`  ${symbol} ${cls}`);
            });
            console.log();
            return;
        }
        // Filter CSS
        console.log(chalk.gray('Filtering CSS...'));
        const filtered = {};
        classes.forEach(cls => {
            if (cssObj[cls])
                filtered[cls] = cssObj[cls];
        });
        // Generate CSS
        let finalCSS = '';
        for (const [className, rules] of Object.entries(filtered)) {
            finalCSS += `.${className} {\n`;
            for (const [prop, value] of Object.entries(rules)) {
                finalCSS += `  ${prop}: ${value};\n`;
            }
            finalCSS += '}\n\n';
        }
        // Write output
        const outputPath = path.resolve(process.cwd(), options.output);
        fs.writeFileSync(outputPath, finalCSS.trim(), 'utf-8');
        // Stats
        const originalSize = sizeCalculate(fullCSS);
        const finalSize = sizeCalculate(finalCSS);
        const reduction = ((1 - finalSize.bytes / originalSize.bytes) * 100).toFixed(2);
        console.log();
        log(chalk.green('✓'), 'Output:', options.output);
        log(chalk.green('✓'), 'Original:', originalSize.formatted);
        log(chalk.green('✓'), 'Final:', finalSize.formatted);
        log(chalk.green('✓'), 'Saved:', `${reduction}%`);
        log(chalk.green('✓'), 'Classes:', `${Object.keys(filtered).length} / ${Object.keys(cssObj).length}`);
        console.log();
        console.log(chalk.green('✓ Scan complete!\n'));
    }
    catch (error) {
        console.error(chalk.red('✗ Scan failed:'), error.message);
        process.exit(1);
    }
}
// ============================================
// COMMAND: COMPILE
// ============================================
async function compile(hwcFile, options) {
    header('⚙️  HeadWater Compile');
    if (!fs.existsSync(hwcFile)) {
        console.error(chalk.red('✗ File not found:'), hwcFile);
        process.exit(1);
    }
    try {
        // Load base CSS
        console.log(chalk.gray('Loading base CSS...'));
        let baseCssObject;
        if (options.base) {
            const baseCSS = fs.readFileSync(options.base, 'utf-8');
            baseCssObject = cssToObject(baseCSS);
            console.log(chalk.green(`✓ Loaded base from ${options.base}`));
        }
        else {
            const config = loadConfig();
            const fullCSS = HeadWaterGen.generateCSS(config);
            baseCssObject = cssToObject(fullCSS);
            console.log(chalk.green('✓ Generated base from HeadWaterGen'));
        }
        // Read HWC file
        console.log(chalk.gray('Reading .hwc file...'));
        const hwcSource = fs.readFileSync(hwcFile, 'utf-8');
        // Compile
        console.log(chalk.gray('Compiling...'));
        const compiler = new HWCompiler({
            strict: options.strict || false,
            warnings: true
        });
        const result = compiler.compile(hwcSource, baseCssObject);
        if (!result.success) {
            console.log();
            console.error(chalk.red('✗ Compilation failed\n'));
            result.errors.forEach(err => console.log(chalk.red('  - ' + err)));
            process.exit(1);
        }
        // Write output
        const outputPath = path.resolve(process.cwd(), options.output);
        fs.writeFileSync(outputPath, result.css, 'utf-8');
        const size = sizeCalculate(result.css);
        console.log();
        log(chalk.green('✓'), 'Output:', options.output);
        log(chalk.green('✓'), 'Size:', size.formatted);
        if (result.warnings.length > 0) {
            console.log();
            console.log(chalk.yellow('⚠ Warnings:'));
            result.warnings.forEach(warn => console.log(chalk.yellow('  - ' + warn)));
        }
        console.log();
        console.log(chalk.green('✓ Compile complete!\n'));
    }
    catch (error) {
        console.error(chalk.red('✗ Compilation failed:'), error.message);
        process.exit(1);
    }
}
// ============================================
// COMMAND: INIT
// ============================================
async function init() {
    header('🚀 Initialize HeadWater');
    const configPath = './hwconf.json';
    if (fs.existsSync(configPath)) {
        console.log(chalk.yellow('⚠ hwconf.json already exists'));
        console.log(chalk.yellow('Skipping initialization\n'));
        return;
    }
    const defaultConfig = {
        "$schema": "https://headwater.dev/schema.json",
        "colorMap": {
            "primary": "#3b82f6",
            "secondary": "#8b5cf6",
            "success": "#10b981",
            "danger": "#ef4444",
            "warning": "#f59e0b",
            "info": "#06b6d4"
        },
        "ignore": [],
        "minify": false,
        "comments": true
    };
    try {
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
        console.log(chalk.green('✓ Created hwconf.json'));
        // Add to .gitignore
        const gitignorePath = './.gitignore';
        const gitignoreEntry = '\n# HeadWater\nheadwater.css\nfinal.css\ncomponent.css\n';
        if (fs.existsSync(gitignorePath)) {
            const content = fs.readFileSync(gitignorePath, 'utf-8');
            if (!content.includes('# HeadWater')) {
                fs.appendFileSync(gitignorePath, gitignoreEntry);
                console.log(chalk.green('✓ Updated .gitignore'));
            }
        }
        else {
            fs.writeFileSync(gitignorePath, gitignoreEntry.trim());
            console.log(chalk.green('✓ Created .gitignore'));
        }
        console.log();
        console.log(chalk.bold('Next steps:'));
        console.log(chalk.gray('  1. Edit hwconf.json to customize'));
        console.log(chalk.gray('  2. Run "hw build" to generate CSS'));
        console.log(chalk.gray('  3. Run "hw info" for details'));
        console.log();
        console.log(chalk.green('✓ Initialization complete!\n'));
    }
    catch (error) {
        console.error(chalk.red('✗ Init failed:'), error.message);
        process.exit(1);
    }
}
// ============================================
// COMMAND: INFO
// ============================================
async function info() {
    header('ℹ️  HeadWater Info');
    try {
        const config = loadConfig();
        const fullCSS = HeadWaterGen.generateCSS(config);
        const minCSS = HeadWaterGen.generateCSS({ ...config, minify: true, comments: false });
        const fullSize = sizeCalculate(fullCSS);
        const minSize = sizeCalculate(minCSS);
        const compression = ((1 - minSize.bytes / fullSize.bytes) * 100).toFixed(2);
        console.log(chalk.bold('📊 Size Information'));
        log('  ', 'Full CSS:', fullSize.formatted);
        log('  ', 'Minified:', minSize.formatted);
        log('  ', 'Compression:', `${compression}%`);
        console.log();
        console.log(chalk.bold('🎨 Color Map'));
        const colorCount = Object.keys(config.colorMap || {}).length;
        if (colorCount === 0) {
            console.log(chalk.gray('  Using default colors'));
        }
        else {
            Object.entries(config.colorMap).forEach(([name, hex]) => {
                console.log(`  ${name.padEnd(12)} ${chalk.hex(hex)('███')} ${hex}`);
            });
        }
        console.log();
        console.log(chalk.bold('🔧 Generators'));
        const allGens = HeadWaterGen.listGenerators();
        const activeGens = allGens.filter(g => !config.ignore.includes(g));
        log('  ', 'Total:', allGens.length);
        log('  ', 'Active:', activeGens.length);
        log('  ', 'Ignored:', config.ignore.length);
        if (config.ignore.length > 0) {
            console.log(chalk.gray('  ' + config.ignore.join(', ')));
        }
        console.log();
        console.log(chalk.bold('⚙️  Settings'));
        log('  ', 'Minify:', config.minify ? 'Yes' : 'No');
        log('  ', 'Comments:', config.comments ? 'Yes' : 'No');
        console.log();
    }
    catch (error) {
        console.error(chalk.red('✗ Info failed:'), error.message);
        process.exit(1);
    }
}
export { build };
export { scan };
export { compile };
export { init };
export { info };
export default {
    build,
    scan,
    compile,
    init,
    info
};
