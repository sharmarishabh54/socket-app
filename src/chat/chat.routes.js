const express = require("express");
const chatController = require('./chat.controller');
const chatRoutes = express.Router({mergeParams: true});

// candidate
chatRoutes.get('/getEmployerDetails/:employer_id', chatController.getEmployerDetails);
chatRoutes.post('/saveSocketChats', chatController.saveSocketChats);
chatRoutes.get('/getChatLists/:candidate_id', chatController.getChatLists);
chatRoutes.get('/getMessageHistory', chatController.getMessageHistory);
// Employer
chatRoutes.get('/getCandidateDetails/:candidate_id', chatController.getCandidateDetails);
chatRoutes.get('/getEmployerChatLists/:employer_id', chatController.getEmployerChatLists);

module.exports = chatRoutes;
