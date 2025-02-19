import React, { useState } from "react";
import { motion } from "framer-motion";
import cardsData from "./cards.json";
import "./styles.css";

export default function HoneymoonGame() {
  const [players, setPlayers] = useState({ player1: "", player2: "" });
  const [gameStarted, setGameStarted] = useState(false);
  const [deck, setDeck] = useState([]);
  const [usedCards, setUsedCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [turn, setTurn] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [customCards, setCustomCards] = useState([]);
  const [newCardText, setNewCardText] = useState("");
  const [newCardCategory, setNewCardCategory] = useState("heart");

  const categoryEmojis = {
    heart: "💙",
    love: "💕",
    fire: "🔥"
  };

  const startGame = () => {
    const formattedDeck = Object.keys(cardsData).flatMap(category => 
      cardsData[category].map(card => ({ text: card, category }))
    ).concat(customCards);
    const shuffledDeck = shuffleDeck(formattedDeck);
    setDeck(shuffledDeck);
    setGameStarted(true);
  };

  const shuffleDeck = (deck) => {
    return deck.sort(() => Math.random() - 0.5);
  };

  const drawCard = () => {
    if (deck.length === 0) return;
    setFlipping(true);
    setTimeout(() => {
      const newCard = deck.pop();
      setUsedCards([...usedCards, newCard]);
      setCurrentCard(newCard);
      setDeck([...deck]);
      setTurn((turn + 1) % 2);
      setFlipping(false);
    }, 500);
  };

  const addCustomCard = () => {
    if (newCardText.trim() === "") return;
    setCustomCards([...customCards, { text: newCardText, category: newCardCategory }]);
    setNewCardText("");
  };

  return (
    <div className="p-6 max-w-lg mx-auto text-center">
      {!gameStarted ? (
        <div>
          <h1 className="text-2xl font-bold">Un Viaje de Dos</h1>
          <p className="mb-4">Ingrese los nombres para comenzar</p>
          <input
            type="text"
            placeholder="Nombre 1"
            value={players.player1}
            onChange={(e) => setPlayers({ ...players, player1: e.target.value })}
            className="border p-2 mb-2"
          />
          <input
            type="text"
            placeholder="Nombre 2"
            value={players.player2}
            onChange={(e) => setPlayers({ ...players, player2: e.target.value })}
            className="border p-2 mb-2"
          />
          <h2 className="text-lg font-bold mt-4">Añadir Cartas Personalizadas</h2>
          <input
            type="text"
            placeholder="Escribe tu carta"
            value={newCardText}
            onChange={(e) => setNewCardText(e.target.value)}
            className="border p-2 mb-2"
          />
          <select
            value={newCardCategory}
            onChange={(e) => setNewCardCategory(e.target.value)}
            className="border p-2 mb-2"
          >
            <option value="heart">💙 Conexión emocional</option>
            <option value="love">💕 Coqueteo y romance</option>
            <option value="fire">🔥 Pasión y atrevimiento</option>
          </select>
          <button onClick={addCustomCard} className="bg-yellow-500 text-white p-2 rounded">Añadir Carta</button>
          <button onClick={startGame} className="bg-blue-500 text-white p-2 rounded mt-4">Comenzar</button>
        </div>
      ) : (
        <div>
          <div className="p-4 border rounded-lg shadow-lg bg-white">
            <h2 className="text-xl font-bold text-blue-600">
              Turno de: {turn === 0 ? players.player1 : players.player2}
            </h2>
            {currentCard && (
              <motion.div 
                className="playing-card"
                initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: flipping ? 180 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="emoji">{categoryEmojis[currentCard.category]}</span>
                <p className="question-text">{currentCard.text}</p>
              </motion.div>
            )}
            <button onClick={drawCard} className="bg-green-500 text-white p-2 rounded mt-4">
              {`Tomar carta (${turn === 0 ? players.player2 : players.player1} sigue)`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
