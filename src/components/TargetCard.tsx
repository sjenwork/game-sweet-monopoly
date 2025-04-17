import React from 'react';
import { Target } from '../types';
import '../styles/TargetCard.css';

interface TargetCardProps {
  target: Target | null;
  playerIngredients: { [key: string]: number };
  onMakeTarget: () => void;
  canMakeTarget: boolean;
}

const TargetCard: React.FC<TargetCardProps> = ({ 
  target, 
  playerIngredients, 
  onMakeTarget, 
  canMakeTarget 
}) => {
  if (!target) {
    return <div className="target-card">載入中...</div>;
  }

  // 檢查每種食材是否足夠
  const checkIngredients = () => {
    return Object.entries(target.ingredients).map(([name, requiredCount]) => {
      const ownedCount = playerIngredients[name] || 0;
      const isSufficient = ownedCount >= requiredCount;
      
      return (
        <div key={name} className={`target-ingredient ${isSufficient ? 'sufficient' : 'insufficient'}`}>
          <span className="ingredient-name">{name}</span>
          <span className="ingredient-count">
            {ownedCount}/{requiredCount}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="target-card">
      <h3 className="target-title">目標甜點</h3>
      <div className="target-name">{target.name}</div>
      
      <div className="target-ingredients">
        <h4>所需食材:</h4>
        <div className="ingredients-list">
          {checkIngredients()}
        </div>
      </div>
      
      <button 
        className="make-target-button" 
        onClick={onMakeTarget}
        disabled={!canMakeTarget}
      >
        製作甜點
      </button>
    </div>
  );
};

export default TargetCard; 