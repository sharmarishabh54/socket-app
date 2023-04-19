const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


  
  const crypto = require("crypto");
  const randomId = () => crypto.randomBytes(8).toString("hex");
  
  const { InMemorySessionStore } = require("./sessionStore");
  const sessionStore = new InMemorySessionStore();
  
  const { InMemoryMessageStore } = require("./messageStore");
  const messageStore = new InMemoryMessageStore();
  

const apiRoutes = require("./index.routes.js");
dotenv.config();
const app = express();
const httpServer = require("http").createServer(app);
app.use(express.raw());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(apiRoutes);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});
app.use(cors());
app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:3001'];
    const { origin } = req.headers;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,x-id-token,x-entity-id,x-user-id,x-api-key,X-Amz-User-Agent,X-Entity-Id'
    );
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

io.use((socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
      const session = sessionStore.findSession(sessionID);
      if (session) {
        socket.sessionID = sessionID;
        socket.userID = session.userID;
        socket.username = session.username;
        return next();
      }
    }
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    socket.sessionID = randomId();
    socket.userID = randomId();
    socket.username = username;
    next();
  });
  
  io.on("connection", (socket) => {
    // persist session
    sessionStore.saveSession(socket.sessionID, {
      userID: socket.userID,
      username: socket.username,
      connected: true,
    });
  
    // emit session details
    socket.emit("session", {
      sessionID: socket.sessionID,
      userID: socket.userID,
    });
  
    // join the "userID" room
    socket.join(socket.userID);
  
    // fetch existing users
    const users = [];
    const messagesPerUser = new Map();
    messageStore.findMessagesForUser(socket.userID).forEach((message) => {
      const { from, to } = message;
      const otherUser = socket.userID === from ? to : from;
      if (messagesPerUser.has(otherUser)) {
        messagesPerUser.get(otherUser).push(message);
      } else {
        messagesPerUser.set(otherUser, [message]);
      }
    });
    sessionStore.findAllSessions().forEach((session) => {
      users.push({
        userID: session.userID,
        username: session.username,
        connected: session.connected,
        messages: messagesPerUser.get(session.userID) || [],
      });
    });
    socket.emit("users", users);
  
    // notify existing users
    socket.broadcast.emit("user connected", {
      userID: socket.userID,
      username: socket.username,
      connected: true,
      messages: [],
    });
  
    // forward the private message to the right recipient (and to other tabs of the sender)
    socket.on("private message", ({ content, to }) => {
      const message = {
        content,
        from: socket.userID,
        to,
      };
      socket.to(to).to(socket.userID).emit("private message", message);
      messageStore.saveMessage(message);
    });

    //file sharing socket
    socket.on("upload", (file, callback) => {
      console.log(typeof file, file);// <Buffer 25 50 44 ...>
      //socket.emit("updateImg", file);
      //let base64img = "data:image/jpeg;base64," + file.toString('base64');
      io.emit('download',file);
  
      // save the content to the disk, for example
      writeFile("/tmp/upload", file, (err) => {
        callback({ message: err ? "failure" : "success" });
      });
    });
  
    // notify users upon disconnection
    socket.on("disconnect", async () => {
      const matchingSockets = await io.in(socket.userID).allSockets();
      const isDisconnected = matchingSockets.size === 0;
      if (isDisconnected) {
        // notify other users
        socket.broadcast.emit("user disconnected", socket.userID);
        // update the connection status of the session
        sessionStore.saveSession(socket.sessionID, {
          userID: socket.userID,
          username: socket.username,
          connected: false,
        });
      }
    });
  });
  
  const PORT = process.env.PORT || 3000;
  
  httpServer.listen(PORT, () =>
    console.log(`server listening at http://localhost:${PORT}`)
  );
  




