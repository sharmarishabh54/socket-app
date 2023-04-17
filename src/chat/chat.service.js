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
    const msg_id = uuid();
    const params = [candidate_id, employer_id];
    const query = `SELECT * FROM chats_mapping WHERE chat_candidate_id=? AND chat_employer_id=?`;
    const [rows] = await mysqlManager.execute(query, params);

    if (Object.keys(rows).length === 0) {
        const args = [candidate_id, employer_id, msg_id, time];
        const sql = `INSERT INTO chats_mapping(chat_candidate_id, chat_employer_id, chat_message_id, time) VALUES(?,?,?,?)`;
        const exec = await mysqlManager.execute(sql, args);

        const args2 = [id, message, sender_id, reciever_id, time];
        const sql2 = `INSERT INTO chats(_id, message_content, sendBy, recievedBy, time) VALUES(?,?,?,?,?)`;
        const exec2 = await mysqlManager.execute(sql2, args2);


        const args3 = [msg_id, id];
        const sql3 = `INSERT INTO message(message_id, message_content) VALUES(?,JSON_ARRAY(?))`;
        const exec3 = await mysqlManager.execute(sql3, args3);

        return {
            exec,
            exec2,
            exec3
        }
    }
    else {
        const msgId = rows[0].chat_message_id;

        const chatId = uuid();
        const params2 = [chatId, message, sender_id, reciever_id, time];
        const query2 = `INSERT INTO chats(_id, message_content, sendBy, recievedBy, time) VALUES(?,?,?,?,?)`;
        const [result2] = await mysqlManager.execute(query2, params2);

        const params3 = [msgId];
        const query3 = `SELECT * FROM message WHERE message_id=?`;
        const [result3] = await mysqlManager.execute(query3, params3);

        const data = JSON.parse(result3[0].message_content);
        data.push(chatId);
        const final_data = JSON.stringify(data);
        const params4 = [final_data, msgId];
        const patch = `UPDATE message SET message_content=JSON_ARRAY(?) WHERE message_id=?`;
        const [result4] = await mysqlManager.execute(patch, params4);
        return {
            result2,
            result3,
            result4
        };
    }
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

    const args = [candidate_id, candidate_id];
    const sql = `SELECT * FROM chats where sendBy=? OR recievedBy=?`;
    const [result] = await mysqlManager.execute(sql, args);

    const recievedByArray = [];

    result.forEach(element => {
        recievedByArray.push(element.recievedBy);
    });

    const newrecievedByArraySet = new Set(recievedByArray);

    const ddata = Array.of(...newrecievedByArraySet);

    const newArr = [];
    for (let i = 0; i < ddata.length; i++) {
        const element = ddata[i];
        const arg2 = [candidate_id, element, element, candidate_id];
        const sql2 = `SELECT message_content, sendBy, recievedBy, time time FROM chats WHERE ((sendBy=? and recievedBy=?)  or (sendby=? and recievedBy=?)) 
        ORDER BY time DESC LIMIT 1`;
        const [response] = await mysqlManager.execute(sql2, arg2);
        newArr.push(response[0]);
        // for (let a = 0; a < rows.length; a++) {
        //     for (let b = 0; b < response.length; b++) {
        //         const t = rows[a];
        //         rows[a].message = response[b].message_content;
        //         console.log('t', t);
        //         newArr.push(t);
        //     }
        // }
        // // {
        // //     rows,
        // //     rows[0].message = response[0].message_content
        // // }
        // // console.log(rows, response[0].message_content);
    }
    const binder = (usr, rec, uniqeData, cid) => {
        // console.log('usr', usr);
        // console.log('rec', rec);
        // console.log('uniqeData', uniqeData);
        // console.log('cid', cid);
        rec.forEach(element => {
            element.
        });
Object.keys().values
    };
    binder(rows, newArr, ddata, candidate_id);
    // const args = [candidate_id, candidate_id];
    // const sql = `SELECT message_content, sendBy, recievedBy, time FROM chats WHERE sendBy=3 OR recievedBy=3 ORDER BY time DESC LIMIT 1`;
    // const result = await mysqlManager.execute(sql, args);
    // rows[0].message = result[0][0].message_content;
    // rows[0].sendBy = result[0][0].sendBy;
    // rows[0].recievedBy = result[0][0].recievedBy;
    // rows[0].time = result[0][0].time;
    // return rows;
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

const getMessageHistory = async (employer_id, candidate_id) => {
    const params = [employer_id, candidate_id, employer_id, candidate_id];
    const query = `SELECT * FROM chats WHERE ((sendBy=? AND recievedBy=?) || (recievedBy=? AND sendBy=?))`;
    const [rows] = await mysqlManager.execute(query, params);
    return rows;
};

module.exports = {
    getEmployerDetails,
    saveSocketChats,
    getChatLists,
    getEmployerChatLists,
    getCandidateDetails,
    getMessageHistory
};
