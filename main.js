#!/usr/bin/env node
import { program } from "commander";
import commands from "./commands.js";
program
    .name('hw')
    .description('HeadWater CSS utility generator and compiler')
    .version('1.0.0');
// hw build
program
    .command('build')
    .description('Generate CSS from HeadWaterGen')
    .argument('[config]', 'Path to hwconf.json', './hwconf.json')
    .option('-o, --output <file>', 'Output CSS file', 'headwater.css')
    .option('--minify', 'Minify output CSS')
    .option('--no-comments', 'Strip comments from CSS')
    .action(commands.build);
// hw scan
program
    .command('scan')
    .description('Extract used classes from project and generate minimal CSS')
    .argument('<path>', 'Project path to scan')
    .option('-o, --output <file>', 'Output CSS file', 'final.css')
    .option('--ext <list>', 'File extensions to scan (comma-separated)', 'html,js,jsx,ts,tsx,vue')
    .option('--dry', 'Dry run - show found classes only')
    .action(commands.scan);
// hw compile
program
    .command('compile')
    .description('Compile .hwc component file to CSS')
    .argument('<file>', 'Input .hwc file')
    .option('-o, --output <file>', 'Output CSS file', 'component.css')
    .option('--base <file>', 'Base CSS file to override')
    .option('--strict', 'Error if utility not found')
    .action(commands.compile);
// hw init
program
    .command('init')
    .description('Initialize HeadWater project')
    .action(commands.init);
// hw info
program
    .command('info')
    .description('Show HeadWater configuration info')
    .action(commands.info);
program.parse();
