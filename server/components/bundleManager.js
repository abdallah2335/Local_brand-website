const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');
const extract = require('extract-zip');

class BundleManager {
    constructor() {
        this.bundlePath = path.join(__dirname, '../bundles');
        this.tempPath = path.join(__dirname, '../temp');
    }

    // Create a new bundle
    async createBundle(bundleName, files, options = {}) {
        try {
            const bundleDir = path.join(this.bundlePath, bundleName);
            await fs.mkdir(bundleDir, { recursive: true });

            const manifest = {
                name: bundleName,
                version: options.version || '1.0.0',
                created: new Date().toISOString(),
                files: [],
                metadata: options.metadata || {}
            };

            // Copy files to bundle directory
            for (const file of files) {
                const fileName = path.basename(file);
                const destPath = path.join(bundleDir, fileName);
                await fs.copyFile(file, destPath);
                manifest.files.push({
                    name: fileName,
                    path: destPath,
                    size: (await fs.stat(file)).size
                });
            }

            // Create manifest file
            await fs.writeFile(
                path.join(bundleDir, 'manifest.json'),
                JSON.stringify(manifest, null, 2)
            );

            // Create zip archive
            const archive = archiver('zip', {
                zlib: { level: 9 }
            });

            const zipPath = path.join(this.bundlePath, `${bundleName}.zip`);
            const output = fs.createWriteStream(zipPath);

            archive.pipe(output);
            archive.directory(bundleDir, false);
            await archive.finalize();

            return {
                bundleName,
                manifest,
                zipPath
            };
        } catch (error) {
            throw new Error(`Bundle creation failed: ${error.message}`);
        }
    }

    // Extract a bundle
    async extractBundle(bundlePath, destination) {
        try {
            await extract(bundlePath, { dir: destination });
            const manifestPath = path.join(destination, 'manifest.json');
            const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
            return manifest;
        } catch (error) {
            throw new Error(`Bundle extraction failed: ${error.message}`);
        }
    }

    // Validate bundle
    async validateBundle(bundlePath) {
        try {
            const tempDir = path.join(this.tempPath, `validate_${Date.now()}`);
            await fs.mkdir(tempDir, { recursive: true });

            const manifest = await this.extractBundle(bundlePath, tempDir);
            
            // Validate manifest structure
            if (!manifest.name || !manifest.version || !manifest.files) {
                throw new Error('Invalid manifest structure');
            }

            // Validate files exist
            for (const file of manifest.files) {
                const filePath = path.join(tempDir, file.name);
                try {
                    await fs.access(filePath);
                } catch {
                    throw new Error(`File ${file.name} is missing from bundle`);
                }
            }

            // Cleanup
            await fs.rm(tempDir, { recursive: true, force: true });

            return {
                valid: true,
                manifest
            };
        } catch (error) {
            return {
                valid: false,
                error: error.message
            };
        }
    }

    // List all bundles
    async listBundles() {
        try {
            const bundles = await fs.readdir(this.bundlePath);
            const bundleInfo = [];

            for (const bundle of bundles) {
                if (bundle.endsWith('.zip')) {
                    const bundlePath = path.join(this.bundlePath, bundle);
                    const stats = await fs.stat(bundlePath);
                    bundleInfo.push({
                        name: bundle,
                        size: stats.size,
                        created: stats.birthtime
                    });
                }
            }

            return bundleInfo;
        } catch (error) {
            throw new Error(`Failed to list bundles: ${error.message}`);
        }
    }

    // Delete a bundle
    async deleteBundle(bundleName) {
        try {
            const bundlePath = path.join(this.bundlePath, bundleName);
            await fs.unlink(bundlePath);
            return true;
        } catch (error) {
            throw new Error(`Failed to delete bundle: ${error.message}`);
        }
    }

    // Update bundle metadata
    async updateBundleMetadata(bundleName, metadata) {
        try {
            const bundleDir = path.join(this.bundlePath, bundleName.replace('.zip', ''));
            const manifestPath = path.join(bundleDir, 'manifest.json');
            
            const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
            manifest.metadata = { ...manifest.metadata, ...metadata };
            
            await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
            return manifest;
        } catch (error) {
            throw new Error(`Failed to update bundle metadata: ${error.message}`);
        }
    }
}

module.exports = new BundleManager(); 