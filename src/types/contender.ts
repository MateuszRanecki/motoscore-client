import { TournamentGroup } from "./types-index";
export type Contender = {
  id: string;
  tournamentId: string;
  firstName: string;
  lastName: string;
  tournamentGroup: TournamentGroup;
  penaltyPointsCount: number;
  startNumber: number;
  status: ContenderStatus;
  currentPart: number;
};

export enum ContenderStatus {
  Participating = 0,
  Finished = 1,
  Disqualified = 2,
}
