import React, { useState } from 'react';
import '../styles/GameSetup.css';

interface GameSetupProps {
  onStartGame: (playerNames: string[]) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame }) => {
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [playerNames, setPlayerNames] = useState<string[]>(['馬卡龍', '草莓泡芙', '檸檬塔', '提拉米蘇']);

  const handlePlayerCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value);
    setPlayerCount(count);
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 只傳遞啟用的玩家名稱
    onStartGame(playerNames.slice(0, playerCount));
  };

  return (
    <div className="game-setup">
      <h2>甜點大富翁 - 遊戲設定</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="playerCount">玩家人數:</label>
          <select 
            id="playerCount" 
            value={playerCount} 
            onChange={handlePlayerCountChange}
          >
            <option value="2">2 人</option>
            <option value="3">3 人</option>
            <option value="4">4 人</option>
          </select>
        </div>
        
        <div className="player-names">
          {[...Array(playerCount)].map((_, index) => (
            <div key={index} className="form-group">
              <label htmlFor={`player${index}`}>玩家 {index + 1} 名稱:</label>
              <input
                id={`player${index}`}
                type="text"
                value={playerNames[index]}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                maxLength={10}
                required
              />
            </div>
          ))}
        </div>
        
        <button type="submit" className="start-button">
          開始遊戲
        </button>
      </form>
    </div>
  );
};

export default GameSetup; 