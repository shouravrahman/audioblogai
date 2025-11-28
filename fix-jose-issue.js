const fs = require('fs-extra');
const path = require('path');

const filePath = path.join(__dirname, 'node_modules', 'jwks-rsa', 'package.json');

async function fixJose() {
  try {
    if (await fs.pathExists(filePath)) {
      const packageJson = await fs.readJson(filePath);
      // Remove the problematic "browser" field which causes resolution issues in worker environments
      if (packageJson.exports && packageJson.exports['.'] && packageJson.exports['.'].browser) {
        delete packageJson.exports['.'].browser;
        await fs.writeJson(filePath, packageJson, { spaces: 2 });
        console.log('Successfully patched jwks-rsa/package.json to fix jose resolution.');
      } else {
        console.log('jwks-rsa/package.json does not have the expected structure to patch. Skipping.');
      }
    } else {
      console.log('Could not find jwks-rsa/package.json to patch. Skipping.');
    }
  } catch (error) {
    console.error('Error patching jwks-rsa for jose issue:', error);
    // exit with non-zero to indicate failure if needed, but for CI might be better to just log
    // process.exit(1); 
  }
}

fixJose();
