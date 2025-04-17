import React from 'react';
import { Player } from '../types';
import '../styles/PlayerInfo.css';

interface PlayerInfoProps {
  player: Player;
  isCurrentPlayer: boolean;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, isCurrentPlayer }) => {
  return (
    <div className={`player-info ${isCurrentPlayer ? 'current-player' : ''}`}>
      <div className="player-header">
        <div className="player-name">玩家 {player.name}</div>
        <div className={`player-status ${player.completedTarget ? 'completed' : ''}`}>
          {player.completedTarget ? '已完成目標！' : '進行中'}
        </div>
      </div>
      
      <div className="player-ingredients">
        <h4>擁有的食材:</h4>
        <div className="ingredients-list">
          {Object.entries(player.ingredients)
            .filter(([_, count]) => count > 0)
            .map(([name, count]) => (
              <div key={name} className="ingredient-item">
                <span className="ingredient-name">{name}</span>
                <span className="ingredient-count">x{count}</span>
              </div>
            ))}
          {Object.values(player.ingredients).filter(count => count > 0).length === 0 && (
            <div className="no-ingredients">還沒有收集到食材</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo; 