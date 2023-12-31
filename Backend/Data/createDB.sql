-- Create the database
CREATE DATABASE kyrendb;

-- Switch to the new database
USE kyrendb;

-- Create the table for userssh
CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  status INT DEFAULT 1,
  password VARCHAR(255) NOT NULL
);
-- Create the table for friends
CREATE TABLE Friends(
  id INT PRIMARY KEY AUTO_INCREMENT,
  user1_id INT NOT NULL,
  user2_id INT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user1_id) REFERENCES Users(id),
  FOREIGN KEY (user2_id) REFERENCES Users(id)
);
-- Create the table for friend requests
CREATE TABLE Friend_Requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sender_id INT NOT NULL,
  recipient_id INT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES Users(id),
  FOREIGN KEY (recipient_id) REFERENCES Users(id)
);

-- Create the table for private conversations
CREATE TABLE Private_Conversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user1_id INT NOT NULL,
  user2_id INT NOT NULL,
  FOREIGN KEY (user1_id) REFERENCES Users(id),
  FOREIGN KEY (user2_id) REFERENCES Users(id)
);

-- Create the table for private messages
CREATE TABLE Private_Messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
  recipient_id INT NOT NULL,
  message VARCHAR(1000) NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES Private_Conversations(id),
  FOREIGN KEY (sender_id) REFERENCES Users(id),
  FOREIGN KEY (recipient_id) REFERENCES Users(id)
);
