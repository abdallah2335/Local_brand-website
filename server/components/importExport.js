const fs = require('fs').promises;
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

class ImportExportManager {
    constructor() {
        this.importPath = path.join(__dirname, '../data/imports');
        this.exportPath = path.join(__dirname, '../data/exports');
    }

    // Import data from CSV
    async importFromCSV(filePath, options = {}) {
        try {
            const results = [];
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv(options))
                    .on('data', (data) => results.push(data))
                    .on('end', resolve)
                    .on('error', reject);
            });
            return results;
        } catch (error) {
            throw new Error(`Import failed: ${error.message}`);
        }
    }

    // Export data to CSV
    async exportToCSV(data, fileName, headers) {
        try {
            const csvWriter = createCsvWriter({
                path: path.join(this.exportPath, fileName),
                header: headers
            });

            await csvWriter.writeRecords(data);
            return true;
        } catch (error) {
            throw new Error(`Export failed: ${error.message}`);
        }
    }

    // Import JSON data
    async importFromJSON(filePath) {
        try {
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error(`JSON import failed: ${error.message}`);
        }
    }

    // Export to JSON
    async exportToJSON(data, fileName) {
        try {
            const filePath = path.join(this.exportPath, fileName);
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            throw new Error(`JSON export failed: ${error.message}`);
        }
    }

    // Validate import data
    validateImportData(data, schema) {
        const errors = [];
        data.forEach((item, index) => {
            Object.keys(schema).forEach(key => {
                if (schema[key].required && !item[key]) {
                    errors.push(`Missing required field '${key}' at index ${index}`);
                }
            });
        });
        return errors;
    }
}

module.exports = new ImportExportManager(); 