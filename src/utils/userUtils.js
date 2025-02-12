export const senderIsCurrentUser = (sender, currentUser) => {
  return sender === currentUser;
};

export const formatChatUsername = (msg, currentUser) => {
  const formattedUsername = senderIsCurrentUser(msg.username, currentUser)
    ? "Me"
    : msg.username.charAt(0).toUpperCase() + msg.username.slice(1);
  return formattedUsername;
};
