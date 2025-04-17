import React, { useState, useEffect, useRef } from 'react';
import '../styles/Dice.css';

interface DiceProps {
  value: number | null;
  onRoll: () => void;
  disabled: boolean;
}

const Dice: React.FC<DiceProps> = ({ value, onRoll, disabled }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const diceRef = useRef<HTMLDivElement>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef<boolean>(false);
  const moveCount = useRef<number>(0);
  const mouseDownTime = useRef<number>(0);

  // 甜點表情映射
  const sweetemojis = {
    1: '🍩',
    2: '🍩',
    3: '🍩',
    4: '🍩',
    5: '🍩',
    6: '🍩'
  };

  // 根據骰子點數返回對應數量和排列的表情符號
  const getDiceDisplay = () => {
    if (value === null) return <div className="single-dot">🎲</div>;
    
    const emoji = sweetemojis[value as keyof typeof sweetemojis] || '🎲';
    
    // 根據點數布局返回不同的表情符號排列
    switch(value) {
      case 1:
        return (
          <div className="dots-container dots-1">
            <div className="dot center">{emoji}</div>
          </div>
        );
      case 2:
        return (
          <div className="dots-container dots-2">
            <div className="dot top-left">{emoji}</div>
            <div className="dot bottom-right">{emoji}</div>
          </div>
        );
      case 3:
        return (
          <div className="dots-container dots-3">
            <div className="dot top-left">{emoji}</div>
            <div className="dot center">{emoji}</div>
            <div className="dot bottom-right">{emoji}</div>
          </div>
        );
      case 4:
        return (
          <div className="dots-container dots-4">
            <div className="dot top-left">{emoji}</div>
            <div className="dot top-right">{emoji}</div>
            <div className="dot bottom-left">{emoji}</div>
            <div className="dot bottom-right">{emoji}</div>
          </div>
        );
      case 5:
        return (
          <div className="dots-container dots-5">
            <div className="dot top-left">{emoji}</div>
            <div className="dot top-right">{emoji}</div>
            <div className="dot center">{emoji}</div>
            <div className="dot bottom-left">{emoji}</div>
            <div className="dot bottom-right">{emoji}</div>
          </div>
        );
      case 6:
        return (
          <div className="dots-container dots-6">
            <div className="dot top-left">{emoji}</div>
            <div className="dot top-right">{emoji}</div>
            <div className="dot middle-left">{emoji}</div>
            <div className="dot middle-right">{emoji}</div>
            <div className="dot bottom-left">{emoji}</div>
            <div className="dot bottom-right">{emoji}</div>
          </div>
        );
      default:
        return <div className="single-dot">{emoji}</div>;
    }
  };

  const handleRollClick = () => {
    if (disabled || isRolling) return;

    setIsRolling(true);
    // 延遲調用onRoll，使動畫效果能夠展示
    setTimeout(() => {
      onRoll();
      // 保持一段時間的動畫，然後停止
      setTimeout(() => {
        setIsRolling(false);
      }, 600);
    }, 200);
  };

  // 拖動功能
  const handleMouseDown = (e: React.MouseEvent) => {
    if (diceRef.current) {
      // 記錄按下鼠標的時間
      mouseDownTime.current = Date.now();
      
      // 設置長按定時器
      pressTimer.current = setTimeout(() => {
        isLongPress.current = true;
      }, 300); // 300毫秒為長按閾值
      
      // 重置移動計數器
      moveCount.current = 0;
      
      // 設置拖動起點
      const rect = diceRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      
      // 添加鼠標事件監聽器
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      // 不立即設置為拖動狀態，等待鼠標移動
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    // 每次移動時增加移動計數
    moveCount.current += 1;
    
    // 如果移動超過閾值，則認為是拖動
    if (moveCount.current > 3 && diceRef.current) {
      setIsDragging(true);
      
      const parentRect = diceRef.current.parentElement?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
      const diceWidth = diceRef.current.offsetWidth;
      const diceHeight = diceRef.current.offsetHeight;
      
      // 計算新位置，限制在父元素範圍內
      const newX = Math.max(0, Math.min(e.clientX - parentRect.left - dragOffset.x, parentRect.width - diceWidth));
      const newY = Math.max(0, Math.min(e.clientY - parentRect.top - dragOffset.y, parentRect.height - diceHeight));
      
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    // 清除長按定時器
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    
    // 計算按下持續時間
    const pressDuration = Date.now() - mouseDownTime.current;
    
    // 僅當滿足以下條件時才視為有效點擊：
    // 1. 不是拖動狀態
    // 2. 不是長按
    // 3. 按下時間少於300毫秒
    // 4. 移動計數少於閾值
    if (!isDragging && !isLongPress.current && pressDuration < 300 && moveCount.current < 3) {
      handleRollClick();
    }
    
    // 移除事件監聽器
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    
    // 重置狀態
    setIsDragging(false);
    isLongPress.current = false;
  };

  useEffect(() => {
    return () => {
      // 組件卸載時清除計時器和事件監聽器
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div 
      ref={diceRef}
      className={`dice-container ${disabled ? 'disabled' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        cursor: disabled ? 'not-allowed' : isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className={`dice-display ${isRolling ? 'rolling' : ''}`}>
        {getDiceDisplay()}
      </div>
    </div>
  );
};

export default Dice; 