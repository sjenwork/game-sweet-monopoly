// 食材類型
export interface Ingredient {
  name: string;
  type: string;
}

// 食材資料類型
export interface IngredientsData {
  [key: string]: Ingredient;
}

// 目標卡類型
export interface Target {
  name: string;
  ingredients: {
    [key: string]: number;
  };
}

// 玩家類型
export interface Player {
  id: number;
  name: string;
  position: number;
  ingredients: {
    [key: string]: number;
  };
  completedTarget: boolean;
}

// 遊戲狀態類型
export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  currentTarget: Target | null;
  gameStarted: boolean;
  gameEnded: boolean;
  winner: Player | null;
  lastDiceRoll: number | null;
  message: string;
}

// 格子類型
export enum CellType {
  INGREDIENT = 'INGREDIENT',
  SPECIAL = 'SPECIAL',
  EMPTY = 'EMPTY'
}

export interface Cell {
  id: string;
  type: CellType;
  content?: string;
}

// 特殊事件類型
export enum SpecialEventType {
  SURPRISE_PACKAGE = 'SURPRISE_PACKAGE',
  BAKING_CHALLENGE = 'BAKING_CHALLENGE',
  RECIPE_SHARE = 'RECIPE_SHARE',
  OVEN_FAILURE = 'OVEN_FAILURE',
  DESSERT_EXHIBITION = 'DESSERT_EXHIBITION',
  BACK_TO_START = 'BACK_TO_START'
}

// 特殊事件資料
export interface SpecialEvent {
  type: SpecialEventType;
  description: string;
} 