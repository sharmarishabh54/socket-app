const uuid = require('uuid').v4;
const mysqlManager = require('../../libs/mysql.manager');

const getEmployerDetails = async (employer_id) => {
    const params = [employer_id, "Employer"];
    const query = `SELECT * FROM users WHERE id=? AND user_type=?`;
    const [rows] = await mysqlManager.execute(query, params);
    return rows;
};

const saveSocketChats = async (sender_id, reciever_id, candidate_id, employer_id, message, time) => {
    const id = uuid();
    const params = [candidate_id, employer_id];
    const query = `SELECT * FROM chats_mapping WHERE chat_candidate_id=? AND chat_employer_id=?`;
    const [rows] = await mysqlManager.execute(query, params);
    console.log('rows::', rows);

    if (!rows) {
        const args = [candidate_id, employer_id, id, time];
        const sql = `INSERT INTO chats_mapping(chat_candidate_id, chat_employer_id, chat_message_id, time) VALUES(?,?,?,?)`;
        const exec = await mysqlManager.execute(sql, args);

        const args2 = [id, message, sender_id, reciever_id, time];
        const sql2 = `INSERT INTO chats(_id, message_content, sendBy, recievedBy, time) VALUES(?,?,?,?,?)`;
        const exec2 = await mysqlManager.execute(sql2, args2);

        const msg_id = uuid();
        const args3 = [msg_id, id];
        const sql3 = `INSERT INTO message(message_id, message_content) VALUES(?,${JSON_ARRAY(id)}?)`;
        const exec3 = await mysqlManager.execute(sql3, args3);

        return {
            exec,
            exec2,
            exec3
        }
    }
    // const id = uuid();
    // const msg = {
    //     "message": `${message}`,
    //     "sendBy": `${sender_id}`,
    //     "recievedBy": `${reciever_id}`,
    //     "time": `${Date.now()}`
    // };

    // const params = [id, msg];
    // const query = `INSERT INTO message(message_id, message) VALUES(?,?)`;
    // const [rows] = await mysqlManager.execute(query, params);
    // return rows;

//     const args = [candidate_id, employer_id, id];
//     const sql = `INSERT INTO chats_mapping(chat_candidate_id, chat_employer_id, chat_message_id) VALUES(?,?,?)`;
//     const [result] = await mysqlManager.execute(sql, args);
//     return {rows, result};
};

const getChatLists = async (candidate_id) => {
    const params = [candidate_id];
    const query = `SELECT 
                    chats_mapping.chat_id, 
                    chats_mapping.chat_candidate_id, 
                    chats_mapping.chat_employer_id, 
                    chats_mapping.chat_message_id,
                    users.id,
                    users.name,
                    users.job_title,
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
    saveSocketChats,
    getChatLists,
    getEmployerChatLists,
    getCandidateDetails
};
