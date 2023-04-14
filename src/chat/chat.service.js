const uuid = require('uuid').v4;
const mysqlManager = require('../../libs/mysql.manager');

const getEmployerDetails = async (employer_id) => {
    const params = [employer_id, "Employer"];
    const query = `SELECT * FROM users WHERE id=? AND user_type=?`;
    const [rows] = await mysqlManager.execute(query, params);
    return rows;
};

// const saveSocketChats = async (sender_id, reciever_id, candidate_id, employer_id, message) => {
//     const id = uuid();
//     const today = new Date();
//     const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
//     const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
//     const dateTime = date+' '+time;

//     const params = [sender_id, reciever_id, message, dateTime];
//     const query = `INSERT INTO message(sender_id, reciever_id, message, createdAt) VALUES(?,?,?,?)`;
//     const [rows] = await mysqlManager.execute(query, params);

//     // const args = ;
//     const sql = `INSERT INTO message() VALUES()`;
//     return rows;
// };

const getChatLists = async (candidate_id) => {
    const params = [candidate_id];
    const query = `SELECT 
                    chats_mapping.chat_id, 
                    chats_mapping.chat_candidate_id, 
                    chats_mapping.chat_employer_id, 
                    chats_mapping.chat_message_id,
                    users.id,
                    users.name,
                    users.user_type,
                    users.status,
                    users.experience,
                    users.qualification,
                    users.city,
                    users.state
                FROM chats_mapping INNER JOIN users ON chats_mapping.chat_employer_id = users.id
                WHERE chat_candidate_id=?`;
    const [rows] = await mysqlManager.execute(query, params);
    return rows;
};

const getEmployerChatLists = async (employer_id) => {
    const params = [employer_id];
    const query = `SELECT 
                    chats_mapping.chat_id, 
                    chats_mapping.chat_candidate_id, 
                    chats_mapping.chat_employer_id, 
                    chats_mapping.chat_message_id,
                    users.id,
                    users.name,
                    users.user_type,
                    users.status,
                    users.experience,
                    users.qualification,
                    users.city,
                    users.state
                FROM chats_mapping INNER JOIN users ON chats_mapping.chat_candidate_id = users.id
                WHERE chat_employer_id=?`;
    const [rows] = await mysqlManager.execute(query, params);
    return rows;
};

const getCandidateDetails = async (candidate_id) => {
    const params = [candidate_id, "Candidate"];
    const query = `SELECT * FROM users WHERE id=? AND user_type=?`;
    const [rows] = await mysqlManager.execute(query, params);
    return rows;
};

module.exports = {
    getEmployerDetails,
    // saveSocketChats,
    getChatLists,
    getEmployerChatLists,
    getCandidateDetails
};
