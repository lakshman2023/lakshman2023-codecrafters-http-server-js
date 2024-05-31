const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const req = data.toString();
    const reqPath = req.split(' ')[1];
    if(reqPath === '/'){
        const res = "HTTP/1.1 200 OK\r\n\r\n";
        socket.write(res);
    } else if(reqPath.startsWith('/echo/')){
        const content = reqPath.split("echo/")[1];
        const res = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`;
        socket.write(res);
    }else {
        const res = "HTTP/1.1 404 Not Found\r\n\r\n";
        socket.write(res);
    }
  });
  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");
