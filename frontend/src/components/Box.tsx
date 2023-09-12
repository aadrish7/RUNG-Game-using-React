import React from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useState, useEffect } from "react";
import "./rang.css";
import "./playing-cards.css";

interface HomePageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export default function Box(props: HomePageProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [text, setText] = useState<string>("Enter your message here");
  let control = false;
  useEffect(() => {
    props.socket.on("receive_message", (data: any) => {
      console.log("received something in box of app", data);
      console.log("print", messages);
      updateMessagesArr(data);
    });

    return () => {
      props.socket.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    props.socket.on("messagelist", (data: any) => {
      console.log("received something in box of app", data);
      console.log("print", messages);
      setMessages(data);
    });
  });

  const sendMessage = () => {
    updateMessagesArr(text);
    props.socket.emit("message", text);
  };

  const updateMessagesArr = (data: any) => {
    setMessages((prevMessages) => [data, ...prevMessages]);
    console.log("after set messages", messages);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const message = event.target.value;
    setText(message);
  };

  return (
    <>
      <div className="messages-and-cards-container">
        <div className="right-side-container messages-container">
          <h1>Messages</h1>
          <div className="message-box">
            {messages.map((message, index) => (
              <div key={index} className="message-content-container">
                {message}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={text}
            onChange={handleMessageChange}
            id="message-input"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </>
  );
}
