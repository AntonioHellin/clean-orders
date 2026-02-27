import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

walkDir('./src', (filePath) => {
    if (filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = content.replace(/from\s+['"](\..*?)(?<!\.js)['"]/g, "from '$1.js'");

        // Also handle dynamic imports and fastify imports if needed.
        if (content !== modified) {
            fs.writeFileSync(filePath, modified, 'utf8');
            console.log('Fixed imports in', filePath);
        }
    }
});
