export interface Game {
  gameID: number;
  name: string;
  gameCode: string;
  gameCodeNumber: number;
  disabilityTypeCode: number;
  ageCategory: string;
  ageRangeStart: number;
  ageRangeEnd: number;
  abilityTypeID: number;
  abilityType?: {
    abilityTypeID: number;
    name: string;
    description: string;
  };
  description?: string;
  rules?: string;
  isDeleted: boolean;
  createdDate: Date;
  updatedDate?: Date;
}

export interface GroupedGames {
  disabilityTypeCode: number;
  disabilityTypeName: string;
  games: {
    ageCategory: string;
    ageRange: string;
    games: GameItem[];
  }[];
}

export interface GameItem {
  gameID: number;
  name: string;
  gameCode: string;
  description: string;
  rules: string;
}
