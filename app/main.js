const net = require("net");
const fs = require('fs');
const zlib = require('zlib');

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    try {
        const req = data.toString();
        const reqLines = req.split('\r\n');
        const reqMethod = req.split(' ')[0];
        const reqPath = req.split(' ')[1];
        if(reqPath === '/'){
            const res = "HTTP/1.1 200 OK\r\n\r\n";
            socket.write(res);
        } else if(reqPath.startsWith('/echo/')){
            const echoString = reqPath.split('echo/')[1];
            const acceptEncoding = req.split("Accept-Encoding: ")[1];
            const isGzip = acceptEncoding && acceptEncoding.includes("gzip");
            // Compress the response using zlib.gzipSync() if gzip is present in Accept-Encoding header
            const compressedOrUncompressedEchoString = isGzip
                ? zlib.gzipSync(echoString)
                : echoString;
            const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${compressedOrUncompressedEchoString.length}\r\n${isGzip ? "Content-Encoding: gzip\r\n" : ""}\r\n`;
            socket.write(response); // Write the response header
            socket.write(compressedOrUncompressedEchoString); // Write the compressed or uncompressed response
            socket.end();
        }else if(reqPath.startsWith('/user-agent')) {
            const userAgent = reqLines.find(e => e.includes('User-Agent')).split(': ')[1];
            const res = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`;
            socket.write(res);
        } else if(reqPath.startsWith('/files/')){
            const dirName = process.argv[3];
            const fileName = reqPath.split('/files/')[1];
            if(reqMethod === "GET"){
                if(fs.existsSync(`${dirName}/${fileName}`)){
                    const content = fs.readFileSync(`${dirName}/${fileName}`).toString();
                    const res = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}`;
                    socket.write(res);
                } else {
                    const res = "HTTP/1.1 404 Not Found\r\n\r\n";
                    socket.write(res);
                }
            } else if (reqMethod === "POST"){
                const content = reqLines[reqLines.length - 1];
                fs.writeFileSync(`${dirName}/${fileName}`, content);
                socket.write(`HTTP/1.1 201 Created\r\n\r\n`);
            }
        } else {
            const res = "HTTP/1.1 404 Not Found\r\n\r\n";
            socket.write(res);
        }
    } catch (error) {
        socket.write(`HTTP/1.1 500 Internal Server Error\r\n\r\n`);
    }
  });
  socket.on("close", () => {
    socket.end();
  });
});

server.listen(4221, "localhost");
