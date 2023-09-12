const { Socket } = require("socket.io");
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});
server.listen(3001, () => {
  console.log("SERVER IS LISTENING ON PORT 3001");
});

function broadcastingOnSocketsExcludingYourself(
  users: any,
  socketid: any,
  data: any,
  text: any
) {
  let scks = Object.values(users);
  for (let i = 0; i < scks.length; i++) {
    if (scks[i] != socketid) io.to(scks[i]).emit(text, data);
  }
}

function broadcastingOnSockets(users: any, data: any, text: any) {
  let scks = Object.values(users);
  for (let i = 0; i < scks.length; i++) {
    io.to(scks[i]).emit(text, data);
  }
}

function sendingListToSingleClient(socket: any, data: any, text: any) {
  socket.emit(text, data);
  console.log("saved state sent");
}

function removeElementFromArray(element: any, arr: any) {
  let index = -1;
  let newarr = [];
  for (let i = 0; i < arr.length; i++) {
    if (
      element.number === arr[i].number &&
      element.suit === changeLogoToText(arr[i].suit)
    ) {
      continue;
    }
    newarr.push(arr[i]);
  }

  return newarr;
}

function getNameBySocketId(users: any, socketId: any) {
  for (const [name, id] of Object.entries(users)) {
    if (id === socketId) {
      return name;
    }
  }
  return null; // return null if the socketId is not found in the users object
}

function distributeCards() {
  // Generate a deck of 52 cards
  const deck = [];
  const suits = ["♥", "♠", "♣", "♦"];
  const numbers = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  for (const suit of suits) {
    for (const number of numbers) {
      deck.push({ number, suit });
    }
  }

  // Fisher-Yates shuffle algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function getFourRandomCards(deck: any) {
  const cards = [];
  while (cards.length < 4) {
    const randomIndex = Math.floor(Math.random() * deck.length);
    const card = deck[randomIndex];
    let isDuplicate = false;
    for (let i = 0; i < cards.length; i++) {
      if (card.number === cards[i].number) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      cards.push(card);
    }
  }
  return cards;
}

function changeLogoToText(logo: any) {
  if (logo == "♥") {
    return "hearts";
  } else if (logo == "♠") {
    return "spades";
  } else if (logo == "♣") {
    return "clubs";
  } else if (logo == "♦") {
    return "diams";
  } else {
    return logo;
  }
}
function tocheckelementexists(ele: any, arr: any) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == ele) {
      return true;
    }
  }
  return false;
}

function changeLogoSuit(suit: any) {
  if (suit === "hearts") {
    return "♥";
  } else if (suit === "spades") {
    return "♠";
  } else if (suit === "clubs") {
    return "♣";
  } else if (suit === "diams") {
    return "♦";
  } else {
    return suit;
  }
}

function changeRung(suit: any) {
  if (suit === "Hearts") {
    return "♥";
  } else if (suit === "Spades") {
    return "♠";
  } else if (suit === "Clubs") {
    return "♣";
  } else if (suit === "Diamond") {
    return "♦";
  } else {
    return suit;
  }
}

let slide = distributeCards();
// let four_card = getFourRandomCards(slide);
function findingMax(cards: any, priority: any, num: any) {
  let max = -1;
  let index = -1111;
  for (let i = 0; i < 4; i++) {
    if (cards[i] > max) {
      max = cards[i];
      index = i;
    }
  }
  priority[index] = num;
  cards[index] = 1;
  return priority;
}

function getCardsPriority(cards: any) {
  let temp = [];
  for (let i = 0; i < 4; i++) {
    temp.push(getFaceCardNumber(cards[i].number));
  }
  console.log(temp);
  let priority = [0, 0, 0, 0];
  for (let i = 0; i < 4; i++) {
    findingMax(temp, priority, i);
  }
  return priority;
}

function getFaceCardNumber(faceCard: any) {
  switch (faceCard) {
    case "A":
      return 23;
    case "J":
      return 11;
    case "Q":
      return 12;
    case "K":
      return 13;
    default:
      return Number(faceCard);
  }
}

let numPlayers = 0; //count the number of players
let users: any = {}; //dictionary of names with socket.id
let userMessages = [""]; //list of messages in case of refresh
let userTableIndex = {}; //
let copyinitialtablecards = [
  { number: "-2", suit: "" },
  { number: "-2", suit: "" },
  { number: "-2", suit: "" },
  { number: "-2", suit: "" },
];
let initialtablecards = [
  { number: "-2", suit: "" },
  { number: "-2", suit: "" },
  { number: "-2", suit: "" },
  { number: "-2", suit: "" },
];
let i = 0;
let counter = 0; //some counter
let users_sending_order = []; //priority of users
let deck_ongoing = []; //
let start_user_index = 0; //start will be where 0 is in the priority
let stored_start_user_index = 0;
let deck = []; //original deck
let player_one = []; //player one deck
let player_two = []; //player two deck
let player_three = []; //player three deck
let player_four = []; //player four deck
let rung_selection_index = 0; // used only once which is equal to user one index for first round
let rung_bool = false; //it means rung is not selected
let rung_suit = ""; //rung suit selected
let users_cards: any[] = []; //list of cards of all the users
let round_cards = [];
let check = 0;
let firstcard: any = {};
let win_checker: any[] = [];
let onethreewins = 0;
let twofourwins = 0;
let rounds = 0;
let over = false;
function dealCards(deck: any, numPlayers: any, numCardsPerPlayer: any) {
  const hands = [];
  const remainingDeck = [...deck]; // create a copy of the deck
  for (let i = 0; i < numPlayers; i++) {
    const hand = [];
    for (let j = 0; j < numCardsPerPlayer; j++) {
      const cardIndex = Math.floor(Math.random() * remainingDeck.length);
      const card = remainingDeck[cardIndex];
      remainingDeck.splice(cardIndex, 1);
      hand.push(card);
    }
    hands.push(hand);
  }
  deck.length = 0; // empty the original deck
  deck.push(...remainingDeck); // push the remaining cards back into the deck
  return hands;
}
function RungHaiBhaiKePaas(data: any, rung: any, banday_ke_cards: any) {
  if (data.suit === rung) {
    return true;
  }
  for (let i = 0; i < banday_ke_cards.length; i++) {
    if (banday_ke_cards[i].suit == rung) {
      return false;
    }
  }
  return true;
}
function getFirstElements(arr: any, index: any, numElements: any) {
  if (Array.isArray(arr) && arr.length > 0) {
    const firstArray = arr[index];
    if (Array.isArray(firstArray) && firstArray.length >= numElements) {
      return firstArray.slice(0, numElements);
    }
  }
  return [];
}
function helper_function(value: any) {
  if (value >= 4) {
    value = value % 4;
  }
  return value;
}
function checkrungcard() {
  for (let i = 0; i < users_cards[start_user_index].length; i++) {
    console.log(users_cards[start_user_index][i].suit);
    console.log(firstcard.suit);
    if (
      changeLogoToText(users_cards[start_user_index][i].suit) == firstcard.suit
    ) {
      return true;
    }
  }
  return false;
}
function help() {
  console.log("help");
  console.log(win_checker[0].suit);
  console.log(rung_suit);
  for (let i = 0; i < 4; i++) {
    if (changeLogoSuit(win_checker[i].suit) == rung_suit) {
      return true;
    }
  }
  return false;
}
function findingwinner(data: any) {
  let ind = -1;
  console.log("help,returned", help());
  if (help()) {
    let max = -1;
    for (let i = 0; i < 4; i++) {
      let temp = getFaceCardNumber(win_checker[i].number);
      console.log("temp", temp);
      if (Number(temp) > max && win_checker[i].suit === rung_suit) {
        console.log("in if");
        max = getFaceCardNumber(win_checker[i].number);
        ind = Number(win_checker[i].index);
      }
    }
    console.log(win_checker);
    console.log(ind);
    return ind;
  } else {
    let max = -1;
    for (let i = 0; i < 4; i++) {
      let temp = getFaceCardNumber(win_checker[i].number);
      console.log("first card", firstcard.suit);
      console.log(changeLogoSuit(win_checker[i].suit));
      if (
        Number(temp) > max &&
        changeLogoSuit(win_checker[i].suit) == changeLogoSuit(firstcard.suit)
      ) {
        max = getFaceCardNumber(win_checker[i].number);
        ind = Number(win_checker[i].index);
      }
    }
    return ind;
  }
}
function rungrules(data: any) {
  if (check == 0) {
    return true;
  }

  if (changeLogoToText(data.suit) == firstcard.suit) {
    return true;
  }

  if (checkrungcard() == false) {
    return true;
  }
  console.log("user has the forwarded card");
  return false;
}

io.on("connection", (socket: any) => {
  if (numPlayers < 4) {
    console.log("user connected with a socket id", socket.id);

    socket.on("player-joined", (data: any) => {
      console.log("Player Joined", data);

      if (users[data]) {
        users[data] = socket.id;
        console.log("socket updated for the user");
        console.log(userMessages);
        sendingListToSingleClient(socket, userMessages, "messagelist");
      } else {
        users[data] = socket.id;
        console.log("New socket for user");
        sendingListToSingleClient(socket, userMessages, "messagelist");
        numPlayers++;
      }

      if (numPlayers == 4) {
        let names = Object.keys(users);
        console.log(names);
        io.emit("game_ready", "4");
        names.push("mein");
        names.push("tum");
        io.emit("names", names);
        console.log("GAME READY");
      }
    });

    socket.on("message", (data: any) => {
      userMessages.push(data);
      console.log("user message", userMessages);
      broadcastingOnSocketsExcludingYourself(
        users,
        socket.id,
        data,
        "receive_message"
      );
    });

    socket.on("cardSelected", (data: any) => {
      let names = Object.keys(users);
      console.log("card selected", data);
      console.log(users_cards);
      if (
        socket.id == users[names[start_user_index]] &&
        rung_bool == true &&
        rungrules(data)
      ) {
        if (check == 0) {
          firstcard = data;
        }
        win_checker.push({
          index: start_user_index,
          number: data.number,
          suit: data.suit,
        });
        console.log("win checker", win_checker);
        data.suit = changeLogoToText(data.suit);
        initialtablecards[start_user_index] = data;
        io.emit("tableUpdated", initialtablecards);
        round_cards.push(data);
        users_cards[start_user_index] = removeElementFromArray(
          data,
          users_cards[start_user_index]
        );
        console.log("start index", start_user_index);
        start_user_index += 1;
        check += 1;
        if (start_user_index == 4) {
          start_user_index = 0;
          console.log("index round up to 0.");
        }
        if (start_user_index == stored_start_user_index) {
          rounds += 1;
          check = 0;
          console.log("stored", stored_start_user_index);
          console.log("round ended");
          let indi = findingwinner(data);
          if (indi % 2 == 0) {
            io.emit("receive_message", `Team 1 won Round ${rounds} `);
            onethreewins += 1;
          } else {
            io.emit("receive_message", `Team 2 won Round ${rounds} `);
            twofourwins += 1;
          }
          if (rounds == 7) {
            over = true;
            if (onethreewins > twofourwins) {
              let names = Object.keys(users);
              io.emit(
                "receive_message",
                `Team One (${names[0]}, ${names[2]}) has Won the Game by winning ${onethreewins} rounds`
              );
              io.emit("tableUpdated", copyinitialtablecards);
              io.emit("cardsUpdated", []);
            } else {
              io.emit(
                "receive_message",
                `Team Two (${names[1]}, ${names[3]}) has Won the Game by winning ${twofourwins} rounds`
              );
              io.emit("tableUpdated", copyinitialtablecards);
              io.emit("cardsUpdated", []);
            }
          }
          if (over == false) {
            console.log("maximum index", indi);
            round_cards = [];
            indi = helper_function(indi);
            console.log("maximum index", indi);
            start_user_index = indi;
            stored_start_user_index = start_user_index;
            io.emit("receive_message", "Round Ended");
            win_checker = [];
          }
        }
        if (over == false) {
          start_user_index = helper_function(start_user_index);

          broadcastingOnSockets(
            users,
            `${names[start_user_index]} will choose the card!`,
            "receive_message"
          );

          broadcastingOnSockets(users, initialtablecards, "tableUpdated");
        }
      } else if (
        socket.id == users[names[start_user_index]] &&
        rung_bool == true &&
        rungrules(data) == false
      ) {
        io.to(socket.id).emit("receive_message", "Warning! You have the Card");
        let seks = Object.values(users);
        io.emit("tableUpdated", initialtablecards);
        let ind = 0;
        for (let i = 0; i < seks.length; i++) {
          if (socket.id === seks[i]) {
            ind = i;
          }
        }
        io.to(seks[ind]).emit("cardsUpdated", users_cards[ind]);
      } else {
        let seks = Object.values(users);
        io.emit("tableUpdated", initialtablecards);
        let ind = 0;
        for (let i = 0; i < seks.length; i++) {
          if (socket.id === seks[i]) {
            ind = i;
          }
        }
        console.log("index of player", ind);
        io.to(seks[ind]).emit("cardsUpdated", users_cards[ind]);
      }
    });

    socket.on("rung_selected", (data: any) => {
      let sock = Object.values(users);
      if (rung_bool === false && socket.id === sock[rung_selection_index]) {
        console.log("Correct Rung User has selectedd");
        console.log(data);
        rung_suit = changeRung(data);
        console.log("Current Rung", rung_suit);
        rung_bool = true;
        io.emit("receive_message", `Rung is ${data}`);
        let socks = Object.values(users);
        for (let i = 0; i < 4; i++) {
          io.to(socks[i]).emit("cardsUpdated", users_cards[i]);
        }
      }
    });

    socket.on("refresh", (data: any) => {
      let names = Object.keys(users);
      console.log(names);
      io.emit("names", names);
      io.emit("messagelist", userMessages);
      io.emit("receive_message", "GAME STARTED!");
      io.emit("tableUpdated", initialtablecards);
      let deck1 = distributeCards();
      deck = deck1;
      let random_cards = getFourRandomCards(deck);

      for (let i = 0; i < random_cards.length; i++) {
        random_cards[i].suit = changeLogoToText(random_cards[i].suit);
      }
      let socks = Object.values(users);
      io.emit("tableUpdated", random_cards);
      setTimeout(() => {}, 15000);
      io.emit(
        "receive_message",
        "Randomized Four Cards Sent! Higher Rank will decide the Rung"
      );
      const pri_order = getCardsPriority(random_cards);
      let user_one = pri_order.indexOf(0);
      let user_two = pri_order.indexOf(1);
      let user_three = pri_order.indexOf(2);
      let user_four = pri_order.indexOf(3);
      users_sending_order = [user_one, user_two, user_three, user_four];
      start_user_index = user_one;
      io.emit("receive_message", `${names[user_one]} will choose the Rung.`);
      io.emit("receive_message", `${names[user_one]} has the first turn`);
      // console.log("before hands",deck)
      for (let i = 0; i < deck.length; i++) {
        if (
          deck[i].suit === "spades" ||
          deck[i].suit === "clubs" ||
          deck[i].suit === "diams" ||
          deck[i].suit === "hearts"
        ) {
          console.log(deck[i].suit);
          deck[i].suit = changeLogoSuit(deck[i].suit);
        }
      }
      let hands = dealCards(deck, 4, 13);
      console.log("hands", hands);
      player_one = hands[0];
      player_two = hands[1];
      player_three = hands[2];
      player_four = hands[3];
      users_cards.push(hands[0]);
      users_cards.push(hands[1]);
      users_cards.push(hands[2]);
      users_cards.push(hands[3]);

      let twod = [player_one, player_two, player_three, player_four];

      for (let i = 0; i < 4; i++) {
        io.to(socks[i]).emit("cardsUpdated", getFirstElements(twod, i, 5));
      }
      rung_selection_index = user_one;
      stored_start_user_index = user_one;
    });
  } else {
    socket.emit("game_full");
    socket.disconnect(true);
  }
});
