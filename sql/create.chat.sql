create table chats_mapping (
	`chat_id` int(10) primary key auto_increment,
	`chat_candidate_id` int(10),
	`chat_employer_id` int(10),
	`chat_message_id` varchar(255) unique key,
	`time` timestamp
);

create table message(
	`_id` int(10) primary key auto_increment,
	`message_id` varchar(255),
	`message_content` JSON not null
);

create table chats(
	`_id` varchar(255) primary key,
	`message_content` varchar(255) not null,
	`sendBy` int(10) not null,
	`recievedBy` int(10) not null,
	`time` timestamp not null
);
