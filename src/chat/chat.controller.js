const chatService = require('./chat.service');
const { successHandler } = require("../../common/handlers");
const { errorUtils } = require("../../common/utils");

const getEmployerDetails = async (req, res, next) => {
    try {
        const { employer_id } = req.params;
        const getEmployerDetailsPayload = await chatService.getEmployerDetails(employer_id);

        if(Object.keys(getEmployerDetailsPayload).length === 0) {
            return errorUtils.throwNotFound("Employer");
        }
        return successHandler(
            {
                data: getEmployerDetailsPayload
            },
            req,
            res,
            next
        );
    } catch (err) {
        next(err);
    }
};

const saveSocketChats = async (req, res, next) => {
    try{
        const { sender_id, reciever_id, candidate_id, employer_id, message, time } = req.body;
        const saveSocketChatsPayload = await chatService.saveSocketChats(sender_id, reciever_id, candidate_id, employer_id, message, time);
        return successHandler(
            {
                data: saveSocketChatsPayload
            },
            req,
            res,
            next
        );
    }catch (err) {
        next(err);
    }
};

const getChatLists = async (req, res, next) => {
    try {
        const { candidate_id } = req.params;
        const getChatListsPayload = await chatService.getChatLists(candidate_id);
        return successHandler(
            {
                data: getChatListsPayload
            },
            req,
            res,
            next
        );
    } catch (err) {
        next(err);
    }
};

const getEmployerChatLists = async (req, res, next) => {
    try {
        const { employer_id } = req.params;
        const getEmployerChatListsPayload = await chatService.getEmployerChatLists(employer_id);
        return successHandler(
            {
                data: getEmployerChatListsPayload
            },
            req,
            res,
            next
        );
    } catch (err) {
        next(err);
    }
};

const getCandidateDetails = async (req, res, next) => {
    try {
        const { candidate_id } = req.params;
        const getCandidateDetailsPayload = await chatService.getCandidateDetails(candidate_id);
        return successHandler(
            {
                data: getCandidateDetailsPayload
            },
            req,
            res,
            next
        )
    } catch(err) {
        next(err);
    }
};

module.exports = {
    getEmployerDetails,
    saveSocketChats,
    getChatLists,
    getEmployerChatLists,
    getCandidateDetails
};
