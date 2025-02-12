import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../providers/AuthProvider";

import User from "../components/User";
import { formatChatUsername, senderIsCurrentUser } from "../utils/userUtils";
import "./root.css";

const SOCKET_SERVER_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:7002/api";

export const Chat = () => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const room = searchParams.get("room");
  const [chatUsers, setChatUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  // const messageIds = useRef(new Set());
  const navigate = useNavigate();
  navigate;

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      msg: "",
    },
  });
  const currentMsg = watch("msg");
  useEffect(() => {
    // Connect to the server
    const newSocket = io(SOCKET_SERVER_URL, {
      withCredentials: true,
      query: {
        userId: user?._id,
      },
    });
    newSocket.emit("joinRoom", { room: room });
    setSocket(newSocket);

    // immedeately join the room

    // Clean up on component unmount
    return () => newSocket.close();
  }, [room, user?._id]);

  useEffect(() => {
    if (socket) {
      // Listen for messages from the server
      socket.on("message", (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
        // if (typeof msg === "string") {
        //   setMessages((prevMessages) => [...prevMessages, msg]);
        // } else {
        //   msg.forEach((curMsg) => {
        //     setMessages((prevMessages) => [...prevMessages, curMsg]);
        //   });
        // }
      });
      socket.on("roomUsers", ({ users }) => {
        setChatUsers(users);
      });

      socket.on("userStatusUpdate", ({ userId: id, online, lastSeen }) => {
        setChatUsers((prevUsers) => {
          return prevUsers.map((user) => {
            if (user._id === id) {
              return { ...user, online, lastSeen };
            }
            return user;
          });
        });
      });
    }
  }, [socket]);

  const formatUsername = (username) => {
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  const onSubmit = async () => {
    socket.emit("chatMessage", {
      room,
      msg: currentMsg,
    });
    setValue("msg", "");
  };

  const handleLeaveRoom = () => {
    socket.emit("leaveRoom", { roomName: room });
    navigate("/");
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>
          <i className="fas fa-smile"></i> Simple Chat
        </h1>
        <button
          type="button"
          className="btn"
          id="leave-room"
          onClick={handleLeaveRoom}
        >
          Leave Room
        </button>
      </header>
      <main className="chat-main">
        <div className="chat-sidebar">
          <h3>
            <i className="fas fa-comments"></i> Room Name:
          </h3>
          <h2 id="room-name">{room}</h2>
          <h3>
            <i className="fas fa-users"></i> Users
          </h3>
          <div
            id="users"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              fontSize: "1.2rem",
            }}
          >
            {chatUsers.map((chatUser) => (
              <User
                key={chatUser._id + chatUser.username}
                // status={chatUser.online ? "online" : "offline"}
                username={chatUser?.username || ""}
              />
            ))}
          </div>
        </div>
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              className={`${
                senderIsCurrentUser(
                  message.username,
                  formatUsername(user.username)
                )
                  ? "current-user-message"
                  : "message"
              }`}
              style={{
                backgroundColor:
                  message.username === "ReedlyChat Bot" ? "#5dc9714a" : "",
              }}
              key={message.id}
            >
              <p className="meta">
                {formatChatUsername(message, formatUsername(user.username))}{" "}
                <span>{message.time}</span>
              </p>
              <p className="text">{message.text}</p>
            </div>
          ))}
        </div>
      </main>
      <div className="chat-form-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            id="msg"
            type="text"
            placeholder="Enter Message"
            autoComplete="off"
            {...register("msg", { required: "Message is required" })}
            value={currentMsg}
          />
          <button type="submit" className="btn">
            <i className="fas fa-paper-plane"></i> Send
          </button>
        </form>
      </div>
    </div>
  );
};
