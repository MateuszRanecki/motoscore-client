import { Contender } from "./types-index";
export type Tournament = {
  id: string;
  levelsCount: number;
  group: TournamentGroup;
  status: TournamentStatus;
  name: string;
  contenders: Contender[];
};

export enum TournamentGroup {
  A = 0,
  B = 1,
  C = 2,
}

export enum TournamentStatus {
  Created = 0,
  Active = 1,
  Closed = 2,
}
