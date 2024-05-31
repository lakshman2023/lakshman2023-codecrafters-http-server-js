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
        const randomString = req.split('echo/')[1];
        const response = createResponse({
          status: '200 OK',
          headers: {
            'Content-Type': 'text/plain',
            'Content-Length': randomString.length,
          },
          body: randomString,
        });
        socket.write(response);
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
