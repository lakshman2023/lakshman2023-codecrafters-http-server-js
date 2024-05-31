const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const req = data.toString();
    if(req.startsWith("GET / ")){
        const res = "HTTP/1.1 200 OK\r\n\r\n";
        socket.write(res);
    } else if(req.startsWith("GET /echo/")){
        const str = req.split("/echo/")[1];
        const res = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 3\r\n\r\n${str}`;
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
