import React from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useState } from "react";
import "./rang.css";
import "./playing-cards.css";
import Box from "./Box";
import Cards from "./Cards";
import Table from "./table";

interface HomePageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
}
export default function LandingPage({ socket }: HomePageProps, props: any) {
  return (
    <html lang="en">
      <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Rang</title>
        <link rel="stylesheet" href="rang.css" />
        <link rel="stylesheet" href="playing-cards.css" />
      </head>
      <body>
        <Table socket={socket} />
      </body>
    </html>
  );
}
