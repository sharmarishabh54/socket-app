const express = require("express");
const { chatRoutes } = require("./chat");
const apiRoutes = express.Router({ mergeParams: true });

apiRoutes.use('/chats', chatRoutes);

module.exports = apiRoutes;
