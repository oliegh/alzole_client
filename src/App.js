import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://192.168.101.2:5000", {
  query: {
    token: window.localStorage.getItem("token"),
  },
});

console.log(window.localStorage.getItem("token"));

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [appState, setAppState] = useState("home");
  const [users, setUsers] = useState([]);

  const deleteToken = () => {
    console.log("token deleted!");
    window.localStorage.removeItem("token");
  };

  useEffect(() => {
    socket.on("message", (msg) => {
      setChat([...chat, msg]);
    });

    socket.on("newToken", (data) => {
      window.localStorage.setItem("token", data.token);
      socket.token = { token: data.token };
    });
    socket.on("joinRoom", (data) => {
      setUsers(data)
    });
  }, [chat]);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log("dsfsdfdsfsaf");
    socket.emit("message", message);
    setMessage("");
  };

  const searchGame = () => {
    socket.emit("searchGame", true);
    setAppState("selection");
  };
  const leaveGame = () => {
    socket.emit("leaveRoom", true);
  };

  useEffect(() => {
    if(users.length < 4) {
      setAppState('selection')
    } else if(users.length = 4) {
      setAppState('game')
    }
  }, [users])
  

  return (
    <div className="container">
      <div className="game-canvas">
        <div>
          {appState === "home" && (
            <>
              <button onClick={searchGame}>Найти игру</button>
            </>
          )}
          {appState === "selection" && (
            <>
              <p>Идет поиск игры....</p>
              <p>Игроки:</p>
              <ul>
                {users.map((user, key) => (
                  <li key={key}>{user.anonim_name || user.name}</li>
                ))}
              </ul>
              <button onClick={leaveGame}>Отменить поиск</button>
            </>
          )}
          {appState === "game" && (
            <>
              <div></div>
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
