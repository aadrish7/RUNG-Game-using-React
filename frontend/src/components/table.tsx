import React from "react";
import "./rang.css";
import "./playing-cards.css";
import Box from "./Box";
import Cards from "./Cards";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useState } from "react";
import SelectRung from "./SelectRung";
import { useEffect } from "react";
interface HomePageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
}
export default function Table({ socket }: HomePageProps) {
  const [tablecards, settableCards] = useState([
    { number: "7", suit: "spades" },
    { number: "Q", suit: "hearts" },
    { number: "2", suit: "diams" },
    { number: "6", suit: "clubs" },
  ]);
  const [names, setNames] = useState([
    "player1",
    "player2",
    "player3",
    "player4",
  ]);

  useEffect(() => {
    socket.on("tableUpdated", (data: any) => {
      console.log("table", data);
      settableCards(data);
    });

    socket.on("names", (data: any) => {
      console.log(names);
      setNames(data);
    });
  }, []);

  return (
    <div className="main-container playingCards">
      <div className="game-container">
        <div className="heading-container">
          <h1>Rang</h1>
        </div>
        <div className="game-table-container">
          <div className="game-table">
            <div className="card-area">
              <div className="card-area-rows output-row-one">
                <div className={`card rank-7 ${tablecards[2].suit}`}>
                  <span className="rank">{tablecards[2].number}</span>
                  <span className="suit">&spades;</span>
                </div>
              </div>
              <div className="card-area-rows output-row-two">
                <div className={`card rank-2 ${tablecards[1].suit}`}>
                  <span className="rank">{tablecards[1].number}</span>
                  <span className="suit">&spades;</span>
                </div>
                <div className={`card rank-7 ${tablecards[3].suit}`}>
                  <span className="rank">{tablecards[3].number}</span>
                  <span className="suit">&spades;</span>
                </div>
              </div>
              <div className="card-area-rows output-row-three">
                <div className={`card rank-5 ${tablecards[0].suit}`}>
                  <span className="rank">{tablecards[0].number}</span>
                  <span className="suit">&spades;</span>
                </div>
              </div>
            </div>

            <div className="game-players-container">
              <div className="player-tag player-one">{names[0]}</div>
            </div>

            <div className="game-players-container">
              <div className="player-tag player-two">{names[1]}</div>
            </div>

            <div className="game-players-container">
              <div className="player-tag player-three">{names[2]}</div>
            </div>

            <div className="game-players-container">
              <div className="player-tag player-four">{names[3]}</div>
            </div>
          </div>
        </div>
        <SelectRung socket={socket} />
      </div>
      <Box socket={socket} />
      <Cards socket={socket} />
    </div>
  );
}
