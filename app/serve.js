const app = require("../app");
const http = require("http");
const socketio = require("socket.io");
const io = require("./services/io");

const server = http.createServer(app);
io(socketio(server));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
	if (process.env.NODE_ENV !== "production") {
		console.log(`Listening on port ${PORT}`);
	}
});
