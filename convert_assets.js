
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const svgPath = path.join(__dirname, 'ramani_logo.svg');
const mobileAssetsDir = path.join(__dirname, 'frontend/mobile/assets/images');
const webAssetsDir = path.join(__dirname, 'frontend/web/public');

// Ensure directories exist
if (!fs.existsSync(mobileAssetsDir)) fs.mkdirSync(mobileAssetsDir, { recursive: true });
if (!fs.existsSync(webAssetsDir)) fs.mkdirSync(webAssetsDir, { recursive: true });

// Mobile Icons (PNG)
// We need: icon.png (1024x1024), adaptive-icon.png (1024x1024), favicon.png
// Since we don't have sharp, we will use a public specialized online converter or just copy svg where supported.
// WAIT - we can try to use npx to run a converter if we can.
// But for now, let's copy the SVG to web public as favicon.svg

// Web: favicon.svg
fs.copyFileSync(svgPath, path.join(webAssetsDir, 'favicon.svg'));
console.log('Copied favicon.svg to web public dir');

// For Mobile, we really need a PNG.
// Let's check if we can use a temporary approach or ask the user.
// actually, let's try to use `npx sharp-cli` if possible, but that might be heavy.
// A simple hack: read the SVG, and if it's simple, maybe we can render it? No.
// Let's assume the user has `npx` and internet.

const commands = [
    `npx sharp-cli -i "${svgPath}" -o "${path.join(mobileAssetsDir, 'icon.png')}" resize 1024`,
    `npx sharp-cli -i "${svgPath}" -o "${path.join(mobileAssetsDir, 'adaptive-icon.png')}" resize 1024`,
    `npx sharp-cli -i "${svgPath}" -o "${path.join(mobileAssetsDir, 'favicon.png')}" resize 196`,
    `npx sharp-cli -i "${svgPath}" -o "${path.join(mobileAssetsDir, 'splash-icon.png')}" resize 200`
];

// Execute sequentially
const runCommands = async () => {
    for (const cmd of commands) {
        console.log(`Running: ${cmd}`);
        await new Promise((resolve, reject) => {
            exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    console.error(`Error: ${stderr}`);
                    // If sharp-cli fails (network/permissions), we can't do much for PNGs automatically without libs.
                } else {
                    console.log('Success');
                }
                resolve();
            });
        });
    }
};

runCommands();
