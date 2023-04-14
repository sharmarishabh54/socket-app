const express = require("express");
// import { createServer } from "http";
// import { Server } from "socket.io";
const dotenv = require("dotenv");

const apiRoutes = require("./index.routes.js");
dotenv.config();
const app = express();

app.use(express.raw());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(apiRoutes);

const server = app.listen(process.env.PORT, () =>
    console.log(`application running on http://${process.env.HOST}:${process.env.PORT}`)
);

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3001",
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("message", (userData)=>{
        socket.join(userData._id);
        console.log("userData._id", userData._id);
        socket.emit("connected");
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("user jooned room: " + room);
    });

    socket.on('typing',(room)=> socket.in(room).emit("typing"));
    socket.on("stop typing", (room)=> socket.in(room).emit("typing"));

    socket.on("new message", (newMessageRecieved) => {
        const chat = newMessageRecieved.chat;

        if(!chat.users) return console.log("cht");

        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user, _id).emit("message recieved", newMessageRecived);
        })
    });

    socket.off("message", () => {
        console.log("User Disconnected");
        socket.leave(userData._id);
    })
});



// const httpServer = createServer((req, res) => {
//   if (req.url !== "/") {
//     res.writeHead(404);
//     res.end("Not found");
//     return;
//   }
// });

// const io = new Server(httpServer, {
//   cors: {
//     origin: 'http://localhost:3000'
//   }
// });

// io.on("connection", async (socket) => {
//   const count = io.engine.clientsCount;
//   console.log(`connect ${socket.id} with present user ${count}`);

//   // socket.use(([event, ...args], next) => {
//   //   console.log('event::', event);
//   //   console.log('args::', ...args);
//   // });

//   socket.on('message', (event, args) => {
//     socket.broadcast.emit('recieve-message', event, args)
//     console.log('data', event);
//     console.log('args', args);
//   });

//   socket.on("disconnect", (reason) => {
//     console.log(`disconnect ${socket.id} due to ${reason}`);
//   });
// });

// httpServer.listen(process.env.PORT);
