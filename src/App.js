import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";
import { SearchListUsers } from "./Components/SearchListUsers/SearchListUsers";
import { createTimer } from "./timer";
import { Question } from "./Components/Question/question";

const statusDev = true;
const keyTokenName = `${Date.now()}`;

console.log(keyTokenName);

const socket = io("http://192.168.101.2:5000", {
  query: {
    token: !statusDev
      ? window.localStorage.getItem("token")
      : window.localStorage.getItem(keyTokenName),
  },
});

console.log(window.localStorage.getItem("token"));

function App() {
  const [message, setMessage] = useState("");
  const [account, setAccount] = useState({});
  const [chat, setChat] = useState([]);
  const [appState, setAppState] = useState("home");
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState({});

  const [timeOutStatus, setTimeOutStatus] = useState(false);
  const [timerQuestion, setTimerQuestion] = useState(0);
  const [timerBeforeStart, setTimerBeforeStart] = useState(0);
  const [question, setQuestion] = useState(null);

  const deleteToken = () => {
    // console.log("token deleted!");
    // window.localStorage.removeItem("token");
  };

  useEffect(() => {
    socket.on("message", (msg) => {
      setChat([...chat, msg]);
    });

    socket.on("account", (data) => {
      console.log(data);
      setAccount(data);
    });

    socket.on("newToken", (data) => {
      !statusDev
        ? window.localStorage.setItem("token", data.token)
        : window.localStorage.setItem(keyTokenName, data.token);
      socket.token = { token: data.token };

      // window.localStorage.setItem("token", data.token);
      // socket.token = { token: data.token };
    });
    socket.on("joinRoom", (data) => {
      setUsers('joinroom');
      if (data) {
        setRoom(data);
        setAppState("selection");
      }
    });
    socket.on("leaveRoom", (data) => {
      setUsers(data || []);
    });

    socket.on("timerBeforeStart", (data) => {
      console.log("timerBeforeStart");
      setTimeOutStatus(true);
      setAppState("game");
      createTimer(setTimerBeforeStart, data.timeOut, () => {
        console.log("Timer 1 has finished");
      });
    });

    socket.on("start", (data) => {
      console.log("start");

      setTimeOutStatus(false);
    });

    socket.on("question", (data) => {
      console.log('Объект вопроса:');
      setQuestion(data);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    setMessage("");
  };

  const searchGame = () => {
    socket.emit("searchGame", true);
    setAppState("selection");
  };
  const leaveGame = () => {
    socket.emit("leaveRoom", true);
    setAppState("home");
    setRoom([]);
    setUsers([]);
  };

  useEffect(() => {
    console.log(timerBeforeStart);
  }, [timerBeforeStart]);

  console.log(appState);

  return (
    <div className="container">
      <div className="game-canvas">
        <div>
          <p className="name-box">
            Ваше имя:{" "}
            <span className="account-name">{account.anonim_name}</span>
          </p>
          {appState === "home" && (
            <>
              <button onClick={searchGame}>Найти игру</button>
            </>
          )}
          {appState === "selection" && (
            <>
              <p>Идет поиск игры....</p>
              <p>Игроки:</p>
              <SearchListUsers room={room} account={account} />
              <button onClick={leaveGame}>Отменить поиск</button>
            </>
          )}
          {appState === "game" && (
            <>
              <div>
                {timeOutStatus && (
                  <p>Игра начнется через: {timerBeforeStart ? timerBeforeStart : ''}</p>
                )}
                {
                  question && <Question question={question} />
                }

              </div>
            </>
          )}
        </div>

        {/* <form onSubmit={sendMessage}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите сообщение..."
          />
          <button type="submit">Отправить</button>
        </form>
        <button onClick={deleteToken}>Удалить токен</button>

        <button
          onClick={() => {
            searchGame();
          }}>
          Найти игру
        </button>
        <button
          onClick={() => {
            leaveGame();
          }}>
          Покинуть игру
        </button> */}
      </div>
    </div>
  );
}

export default App;
