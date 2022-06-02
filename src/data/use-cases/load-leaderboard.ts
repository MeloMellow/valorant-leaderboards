import Region from "../../constants/region"
import { ILoadLeaderboard, Leaderboard } from "../../domain/use-cases/load-leaderboard"
import ILoadLeaderboardByRegionAndActRepository from "../../infra/repositories/load-leaderboard-by-region-and-act-repository"

export default class LoadLeaderboard implements ILoadLeaderboard{
  constructor(private readonly loadLeaderboardByRegionAndActRepository: ILoadLeaderboardByRegionAndActRepository){
    
  }
  async loadByRegionAndAct(region: Region, actId: String): Promise<Leaderboard>{
    if(!actId){
      throw new Error('actId is missing')
    }
    const response = await this.loadLeaderboardByRegionAndActRepository.load(region, actId)
    const leaderboard = response.body
    if (!leaderboard.actId || !leaderboard.players){
      throw new Error(`Something went wrong with the response: ${JSON.stringify(response)}`)
    }
    return leaderboard
  }
}