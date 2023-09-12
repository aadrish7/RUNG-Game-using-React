import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import "./Home.css";
import { useState } from "react";

//create an interface for the props that you want to pass to this component
interface HomePageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
}

function HomePage({ socket }: HomePageProps) {
  //click handler
  const handleClick = (socket: Socket) => {
    // Do something with the socket object, such as emit an event
    console.log("Text Sent", text);
    socket.emit("send_message", text);
  };

  const OnInputText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const message = (event.target as HTMLInputElement).value;
    setText(message);
  };

  const [text, setText] = useState("Enter text here");
  return (
    <>
      <div className="sampleHomePage">
        <h1 className="sampleTitle">My Game</h1>
        <div className="sampleMessage">
          <input
            placeholder="message"
            onChange={(event) => OnInputText(event)}
          ></input>
          <button onClick={() => handleClick(socket)}>
            Click me to send a message to server...
          </button>
        </div>
      </div>
    </>
  );
}
export default HomePage;
