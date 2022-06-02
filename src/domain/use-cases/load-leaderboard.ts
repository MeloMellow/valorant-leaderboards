import Region from "../../constants/region";

export type Leaderboard = {
  actId: String
  players: []
}
export interface ILoadLeaderboard{
  loadByRegionAndAct(region: Region, actId: String): Promise<Leaderboard>
}