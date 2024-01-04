import React from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useState } from "react";

interface HomePageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export default function SelectRung({ socket }: HomePageProps) {
  const handleSelectRung = (suit: string) => {
    socket.emit("rung_selected", suit);
  };

  return (
    <div className="select-rang-container">
      <h3>Select Rang:</h3>
      <button
        className="button-select-rang"
        onClick={() => handleSelectRung("Diamond")}
      >
        Diamond
      </button>
      <button
        className="button-select-rang"
        onClick={() => handleSelectRung("Hearts")}
      >
        Hearts
      </button>
      <button
        className="button-select-rang"
        onClick={() => handleSelectRung("Spades")}
      >
        Spades
      </button>
      <button
        className="button-select-rang"
        onClick={() => handleSelectRung("Clubs")}
      >
        Club
      </button>
    </div>
  );
}
