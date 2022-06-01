import Region from "../../constants/region"

export type RepositoryResponse = {
  header: any
  status: any
  body: any
}
export interface ILoadLeaderboardByRegionAndActRepository {
  load(region: Region, actId: String): Promise<RepositoryResponse>
}