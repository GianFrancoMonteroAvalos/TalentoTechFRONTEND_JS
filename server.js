/**
 * Servidor HTTP simple para desarrollo
 * Sirve los archivos estáticos de la aplicación
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Mapeo de extensiones a tipos MIME
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Parsear la URL
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Obtener la extensión del archivo
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Leer el archivo
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Archivo no encontrado
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>404 - No encontrado</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                text-align: center;
                                padding: 50px;
                                background: linear-gradient(#0d0d0d, #212121);
                                color: #d6dfed;
                            }
                            h1 { color: #2CE6C2; }
                            a { color: #632A81; text-decoration: none; }
                            a:hover { text-decoration: underline; }
                        </style>
                    </head>
                    <body>
                        <h1>404 - Página no encontrada</h1>
                        <p>El archivo solicitado no existe.</p>
                        <a href="/">Volver al inicio</a>
                    </body>
                    </html>
                `, 'utf-8');
            } else {
                // Error del servidor
                res.writeHead(500);
                res.end(`Error del servidor: ${error.code}`, 'utf-8');
            }
        } else {
            // Archivo encontrado
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('\n========================================');
    console.log('🚀 Servidor iniciado correctamente');
    console.log('========================================');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📍 URL: http://127.0.0.1:${PORT}`);
    console.log('\n✨ Abre tu navegador en una de las URLs de arriba');
    console.log('\n💡 Presiona Ctrl+C para detener el servidor\n');
});




