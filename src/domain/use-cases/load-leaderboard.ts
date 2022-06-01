import Region from "../../constants/region";

export interface ILoadLeaderboard{
  loadByRegionAndAct(region: Region, actId: String): Promise<{}>
}