import Region from "../../constants/region"
import RepositoryResponse from "../repository-response"
export default interface ILoadLeaderboardByRegionAndActRepository {
  load(region: Region, actId: String): Promise<RepositoryResponse>
}