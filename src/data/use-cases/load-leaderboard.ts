import Region from "../../constants/region"
import Leaderboard from "../../domain/models/leaderboard"
import { ILoadLeaderboard } from "../../domain/use-cases/load-leaderboard"
import { ILoadLeaderboardByRegionAndActRepository } from "../../infra/repositories/load-leaderboard-by-region-and-act-repository"

export default class LoadLeaderboard implements ILoadLeaderboard{
  constructor(private readonly loadLeaderboardByRegionAndActRepository: ILoadLeaderboardByRegionAndActRepository){
    
  }
  async loadByRegionAndAct(region: Region, actId: String): Promise<Leaderboard>{
    if(!actId){
      throw new Error('actId is missing')
    }
    const response = await this.loadLeaderboardByRegionAndActRepository.load(region, actId)
    const leaderboard: Leaderboard = response.body
    return leaderboard
  }
}