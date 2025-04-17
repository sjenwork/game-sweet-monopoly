import { Player, Target, GameState, Cell, CellType } from '../types';
import ingredientsData from '../data/ingredients.json';
import targetsData from '../data/targets.json';

// 建立遊戲棋盤格子
export const createGameCells = (): Cell[] => {
  return Object.keys(ingredientsData).map(key => {
    const ingredient = ingredientsData[key as keyof typeof ingredientsData];
    return {
      id: key,
      type: CellType.INGREDIENT,
      content: ingredient.name
    };
  });
};

// 初始化遊戲狀態
export const initGameState = (playerNames: string[]): GameState => {
  // 隨機選擇一個目標卡
  const randomTargetIndex = Math.floor(Math.random() * targetsData.length);
  // 使用類型斷言處理JSON資料
  const targetData = targetsData[randomTargetIndex];
  const randomTarget: Target = {
    name: targetData.name,
    ingredients: Object.entries(targetData.ingredients).reduce((acc, [key, value]) => {
      acc[key] = value as number;
      return acc;
    }, {} as Record<string, number>)
  };

  // 建立玩家
  const players: Player[] = playerNames.map((name, index) => ({
    id: index + 1,
    name,
    position: 1, // 起始位置在第一格
    ingredients: {},
    completedTarget: false
  }));

  return {
    players,
    currentPlayerIndex: 0,
    currentTarget: randomTarget,
    gameStarted: true,
    gameEnded: false,
    winner: null,
    lastDiceRoll: null,
    message: '遊戲開始！' + playerNames[0] + ' 的回合，請擲骰子。'
  };
};

// 擲骰子
export const rollDice = (): number => {
  return Math.floor(Math.random() * 6) + 1;
};

// 移動玩家
export const movePlayer = (
  player: Player, 
  diceRoll: number,
  cells: Cell[]
): { updatedPlayer: Player; message: string } => {
  // 計算新位置
  const newPosition = (player.position + diceRoll) % cells.length;
  const actualPosition = newPosition === 0 ? cells.length : newPosition;

  // 獲取玩家移動到的格子
  const targetCell = cells.find(cell => 
    parseInt(cell.id.replace('格子', '')) === actualPosition
  );
  
  // 更新玩家位置
  const updatedPlayer = { ...player, position: actualPosition };
  
  // 如果是食材格，添加食材到玩家庫存
  if (targetCell && targetCell.type === CellType.INGREDIENT) {
    const ingredientName = targetCell.content || '';
    
    // 更新玩家食材
    if (ingredientName) {
      updatedPlayer.ingredients = { 
        ...updatedPlayer.ingredients,
        [ingredientName]: (updatedPlayer.ingredients[ingredientName] || 0) + 1
      };
    }
    
    return {
      updatedPlayer,
      message: `${player.name} 擲出了 ${diceRoll}，移動到了 ${targetCell.id}，獲得了 ${ingredientName}！`
    };
  }
  
  return {
    updatedPlayer,
    message: `${player.name} 擲出了 ${diceRoll}，移動到了 ${targetCell?.id || actualPosition} 格。`
  };
};

// 檢查是否可以製作目標甜點
export const canMakeTarget = (player: Player, target: Target | null): boolean => {
  if (!target) return false;
  
  for (const [ingredientName, requiredCount] of Object.entries(target.ingredients)) {
    const ownedCount = player.ingredients[ingredientName] || 0;
    if (ownedCount < requiredCount) {
      return false;
    }
  }
  
  return true;
};

// 製作目標甜點
export const makeTarget = (
  player: Player, 
  target: Target | null
): { updatedPlayer: Player; message: string } => {
  if (!target || !canMakeTarget(player, target)) {
    return {
      updatedPlayer: player,
      message: `${player.name} 沒有足夠的材料製作 ${target?.name || '目標甜點'}！`
    };
  }
  
  // 建立新的食材物件
  const updatedIngredients = { ...player.ingredients };
  
  // 消耗所需食材
  for (const [ingredientName, requiredCount] of Object.entries(target.ingredients)) {
    updatedIngredients[ingredientName] -= requiredCount;
  }
  
  // 更新玩家狀態
  const updatedPlayer = {
    ...player,
    ingredients: updatedIngredients,
    completedTarget: true
  };
  
  return {
    updatedPlayer,
    message: `${player.name} 成功製作了 ${target.name}！`
  };
};

// 檢查遊戲是否結束
export const checkGameEnd = (players: Player[]): Player | null => {
  for (const player of players) {
    if (player.completedTarget) {
      return player;
    }
  }
  return null;
}; 