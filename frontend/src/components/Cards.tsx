import React, { useState } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useEffect } from "react";

interface HomePageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

export default function Cards(props: HomePageProps) {
  const [cards, setCards] = useState([
    { number: "7", suit: "♠" },
    { number: "Q", suit: "♥" },
    { number: "2", suit: "♦" },
    { number: "A", suit: "♠" },
    { number: "6", suit: "♣" },
  ]);

  const handleCardClick = (card: { number: string; suit: string }) => {
    console.log(props.socket);
    props.socket.emit("cardSelected", card); // emit a 'cardSelected' event to the server

    // Remove the clicked card from the state
    setCards((prevCards) =>
      prevCards.filter((c) => c.number !== card.number || c.suit !== card.suit)
    );
  };

  useEffect(() => {
    props.socket.on("cardsUpdated", (data: any) => {
      console.log(data);
      setCards(data);
    });
  });

  return (
    <div className="right-side-container my-cards-container">
      <h1>My Cards</h1>
      <div className="my-cards-inner-container">
        <ul className="hand">
          {cards.map((card, index) => (
            <li key={index}>
              <a
                className={`card rank-2 ${card.suit}`}
                onClick={() => handleCardClick(card)}
              >
                <span className="rank">{card.number}</span>
                <span className="suit">{card.suit}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
