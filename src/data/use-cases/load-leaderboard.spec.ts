import Region from '../../constants/region'
import LoadLeaderboard from './load-leaderboard'
import ILoadLeaderboardByRegionAndActRepository from '../../infra/repositories/load-leaderboard-by-region-and-act-repository'
import RepositoryResponse from '../../infra/repository-response'

// 1: Obter o client
// 2: Obter todos os Atos
// 3: Obter a leaderboard baseada nos atos

class LoadLeaderboardByRegionAndActRepositorySpy implements ILoadLeaderboardByRegionAndActRepository{
  region: Region | null = null
  actId: String | null = null
  async load(region: Region, actId: String): Promise<RepositoryResponse>{
    this.region = region
    this.actId = actId
    return { header: {}, status: {} , body: {actId, players: []}
    }
  }
}

class LoadLeaderboardByRegionAndActRepositoryWithErrorSpy implements ILoadLeaderboardByRegionAndActRepository{
  async load(region: Region, actId: String): Promise<RepositoryResponse>{
    throw new Error('Something went wrong')
  }
}

class LoadLeaderboardByRegionAndActRepositoryWithInvalidResponseSpy implements ILoadLeaderboardByRegionAndActRepository{
  async load(region: Region, actId: String): Promise<RepositoryResponse>{
    return { header: {}, status: {}, body: {}}
  }
}

const makeSut = (): { sut: LoadLeaderboard, loadLeaderboardByRegionAndActRepositorySpy: LoadLeaderboardByRegionAndActRepositorySpy}=>{
  const loadLeaderboardByRegionAndActRepositorySpy = new LoadLeaderboardByRegionAndActRepositorySpy()
  const sut = new LoadLeaderboard(loadLeaderboardByRegionAndActRepositorySpy)

  return {
    sut,
    loadLeaderboardByRegionAndActRepositorySpy
  }
}

describe('LoadLeaderboard', () => { 

  it("Should call loadLeaderboardByRegionAndActRepository with correct params", async ()=>{
    const { sut, loadLeaderboardByRegionAndActRepositorySpy } = makeSut()
    await sut.loadByRegionAndAct(Region.default, 'valid-act')
    expect(loadLeaderboardByRegionAndActRepositorySpy.region).toBe(Region.default)
    expect(loadLeaderboardByRegionAndActRepositorySpy.actId).toBe('valid-act')
  })

  it("Should throws when called without actId", async ()=>{
    const { sut } = makeSut()
    const response = sut.loadByRegionAndAct(Region.default, '')
    await expect(response).rejects.toThrow()
  })

  it("Should throws if loadLeaderboardByRegionAndActRepository throws", async ()=>{
    const sut = new LoadLeaderboard(new LoadLeaderboardByRegionAndActRepositoryWithErrorSpy())
    const response = sut.loadByRegionAndAct(Region.default, 'valid-act')
    await expect(response).rejects.toThrow()
  })

  it("Should return a valid LeaderBoard on success", async()=>{
    const { sut } = makeSut()
    const leaderBoard = await sut.loadByRegionAndAct(Region.default, 'valid-act')
    expect(leaderBoard.actId).toBe('valid-act')
    expect(leaderBoard).toHaveProperty('players')
  })

  it("Should throws if an invalid response is provided on success", async ()=>{
    const sut = new LoadLeaderboard(new LoadLeaderboardByRegionAndActRepositoryWithInvalidResponseSpy())
    const response = sut.loadByRegionAndAct(Region.default, 'valid-act')
    await expect(response).rejects.toThrow()
  })

 })