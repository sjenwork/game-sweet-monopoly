import React from 'react';
import { Cell } from '../types';
import PlayerInfo from './PlayerInfo';
import Dice from './Dice';
import '../styles/GameBoard.css';

interface GameBoardProps {
  cells: Cell[];
  playerPositions: { [key: number]: number };
  players?: any[];
  currentPlayerIndex?: number;
  diceValue: number | null;
  onDiceRoll: () => void;
  isDiceDisabled: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  cells, 
  playerPositions, 
  players = [], 
  currentPlayerIndex = 0,
  diceValue,
  onDiceRoll,
  isDiceDisabled
}) => {
  // 建立一個40個格子的棋盤，每邊10個格子
  const renderCells = () => {
    // 確保有40個格子
    if (cells.length !== 40) {
      return <div>棋盤資料錯誤</div>;
    }

    // 分配格子到四條邊，每邊10個格子
    const topRow = cells.slice(0, 10);
    const rightColumn = cells.slice(10, 20);
    const bottomRow = cells.slice(20, 30).reverse(); // 反轉底部行，使其順時針顯示
    const leftColumn = cells.slice(30, 40).reverse(); // 反轉左列，使其順時針顯示

    // 獲取角落位置的類名
    const getCornerPosition = (index: number): string => {
      // 四個角落固定分配
      switch(index) {
        case 0: return 'top-left-corner';     // 玩家1: 左上角
        case 1: return 'top-right-corner';    // 玩家2: 右上角
        case 2: return 'bottom-left-corner';  // 玩家3: 左下角
        case 3: return 'bottom-right-corner'; // 玩家4: 右下角
        default: return '';
      }
    };

    return (
      <div className="game-board">
        <div className="board-row top-row">
          {topRow.map(cell => renderCell(cell))}
        </div>
        <div className="board-sides">
          <div className="board-column left-column">
            {leftColumn.map(cell => renderCell(cell))}
          </div>
          <div className="board-center">
            <div className="game-title">甜點大富翁</div>
            
            {/* 骰子元件放在中央區域 */}
            <Dice 
              value={diceValue} 
              onRoll={onDiceRoll} 
              disabled={isDiceDisabled} 
            />
            
            {/* 在中央區域放置玩家資訊卡 */}
            {players.map((player, index) => (
              <div 
                key={player.id} 
                className={`player-card-container ${getCornerPosition(index)}`}
              >
                <PlayerInfo 
                  player={player}
                  isCurrentPlayer={index === currentPlayerIndex}
                />
              </div>
            ))}
          </div>
          <div className="board-column right-column">
            {rightColumn.map(cell => renderCell(cell))}
          </div>
        </div>
        <div className="board-row bottom-row">
          {bottomRow.map(cell => renderCell(cell))}
        </div>
      </div>
    );
  };

  const renderCell = (cell: Cell) => {
    // 檢查是否有玩家在此格子上
    const playersOnCell = Object.entries(playerPositions)
      .filter(([_, position]) => position === parseInt(cell.id.replace('格子', '')))
      .map(([playerId]) => parseInt(playerId));

    return (
      <div 
        key={cell.id} 
        className={`board-cell ${cell.type.toLowerCase()}`}
        title={cell.content}
      >
        <div className="cell-content">{cell.content || cell.id}</div>
        {playersOnCell.length > 0 && (
          <div className="cell-players">
            {playersOnCell.map(playerId => (
              <div key={playerId} className={`player player-${playerId}`}>
                P{playerId}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return renderCells();
};

export default GameBoard; 