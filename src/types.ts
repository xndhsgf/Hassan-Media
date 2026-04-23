import React from 'react';

export interface WheelItem {
  id: string;
  name: string;
  label: string;
  multiplier: number;
  color: string;
  probability: number;
  icon: string;
}

export type BetAmount = 100 | 500 | 1000 | 2000;
export type GamePhase = 'betting' | 'spinning' | 'result';

export interface GameState {
  balance: number;
  todayProfit: number;
  round: number;
  history: WheelItem[];
  items: WheelItem[];
  isEnabled: boolean;
  phase: GamePhase;
  timer: number;
  bets: Record<string, number>;
  selectedChip: BetAmount;
  lastWinner: WheelItem | null;
  latestWinAmount?: number;
  isMuted: boolean;
}

export interface AppContextType {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
  placeBet: (itemId: string) => void;
  setSelectedChip: (chip: BetAmount) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMute: () => void;
}
