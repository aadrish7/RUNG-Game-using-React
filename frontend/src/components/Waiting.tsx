import React, { useState } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

interface WaitingProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export default function Waiting({ socket }: WaitingProps) {
  const [name, setName] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Send the name to the server using the socket
    socket.emit("player-joined", name);
    // Clear the input field
    setName("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <button type="submit">Join Game</button>
      </form>
      <p>Waiting for players to start the game.</p>
    </div>
  );
}
