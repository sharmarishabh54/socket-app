create table chats_mapping (
	chat_id int(10) primary key auto_increment,
	chat_candidate_id int(10),
	chat_employer_id int(10),
	chat_conversations int(10)
);

create table message(
	_id int(10) primary key auto_increment,
	sender_id int(10),
	reciever_id int(10),
	message longtext
);
