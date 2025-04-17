import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import Dice from './components/Dice';
import TargetCard from './components/TargetCard';
import MessageLog from './components/MessageLog';
import GameSetup from './components/GameSetup';
import { GameState, Cell } from './types';
import {
  createGameCells,
  initGameState,
  rollDice,
  movePlayer,
  canMakeTarget,
  makeTarget,
  checkGameEnd
} from './game/GameLogic';
import './styles/App.css';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [cells, setCells] = useState<Cell[]>([]);
  
  // 初始化遊戲棋盤
  useEffect(() => {
    const gameCells = createGameCells();
    setCells(gameCells);
  }, []);
  
  // 開始新遊戲
  const handleStartGame = (playerNames: string[]) => {
    const newGameState = initGameState(playerNames);
    setGameState(newGameState);
  };
  
  // 處理擲骰子
  const handleRollDice = () => {
    if (!gameState || gameState.gameEnded) return;
    
    const diceValue = rollDice();
    
    // 更新當前玩家位置和獲取的食材
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const { updatedPlayer, message } = movePlayer(currentPlayer, diceValue, cells);
    
    // 建立新的玩家陣列，替換當前玩家
    const updatedPlayers = [...gameState.players];
    updatedPlayers[gameState.currentPlayerIndex] = updatedPlayer;
    
    // 計算下一個玩家索引
    const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    
    // 更新遊戲狀態
    setGameState({
      ...gameState,
      players: updatedPlayers,
      currentPlayerIndex: nextPlayerIndex,
      lastDiceRoll: diceValue,
      message: message + (gameState.players[nextPlayerIndex].completedTarget ? '' : `\n輪到 ${gameState.players[nextPlayerIndex].name} 的回合。`)
    });
  };
  
  // 處理製作目標甜點
  const handleMakeTarget = () => {
    if (!gameState || gameState.gameEnded || !gameState.currentTarget) return;
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // 嘗試製作目標甜點
    const { updatedPlayer, message } = makeTarget(currentPlayer, gameState.currentTarget);
    
    // 建立新的玩家陣列，替換當前玩家
    const updatedPlayers = [...gameState.players];
    updatedPlayers[gameState.currentPlayerIndex] = updatedPlayer;
    
    // 檢查是否有玩家完成目標，遊戲結束
    const winner = checkGameEnd(updatedPlayers);
    
    // 更新遊戲狀態
    setGameState({
      ...gameState,
      players: updatedPlayers,
      winner,
      gameEnded: winner !== null,
      message: message + (winner ? `\n遊戲結束！${winner.name} 獲勝！` : '')
    });
  };
  
  // 檢查當前玩家是否可以製作目標甜點
  const canCurrentPlayerMakeTarget = (): boolean => {
    if (!gameState || gameState.gameEnded || !gameState.currentTarget) return false;
    return canMakeTarget(gameState.players[gameState.currentPlayerIndex], gameState.currentTarget);
  };
  
  // 建立玩家位置映射，用於在棋盤上顯示玩家位置
  const createPlayerPositionsMap = (): { [key: number]: number } => {
    if (!gameState) return {};
    
    const positionsMap: { [key: number]: number } = {};
    gameState.players.forEach(player => {
      positionsMap[player.id] = player.position;
    });
    
    return positionsMap;
  };
  
  return (
    <div className="app">
      {!gameState ? (
        <GameSetup onStartGame={handleStartGame} />
      ) : (
        <div className="game-container">
          <div className="game-board-container">
            <GameBoard 
              cells={cells} 
              playerPositions={createPlayerPositionsMap()} 
              players={gameState.players}
              currentPlayerIndex={gameState.currentPlayerIndex}
              diceValue={gameState.lastDiceRoll}
              onDiceRoll={handleRollDice}
              isDiceDisabled={gameState.gameEnded}
            />
          </div>
          
          <div className="game-ui-overlay">
            <h2 className="game-ui-title">甜點大富翁</h2>
            
            <MessageLog message={gameState.message} />
            
            <div className="target-container">
              <h3 className="section-title">目標甜點</h3>
              {gameState.currentTarget && (
                <TargetCard 
                  target={gameState.currentTarget}
                  playerIngredients={gameState.players[gameState.currentPlayerIndex].ingredients}
                  onMakeTarget={handleMakeTarget}
                  canMakeTarget={canCurrentPlayerMakeTarget()}
                />
              )}
            </div>
            
            {gameState.gameEnded && gameState.winner && (
              <div className="game-over">
                <h2>遊戲結束！</h2>
                <p>{gameState.winner.name} 成功製作了 {gameState.currentTarget?.name} 並獲得了勝利！</p>
                <button 
                  className="restart-button"
                  onClick={() => setGameState(null)}
                >
                  重新開始
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
