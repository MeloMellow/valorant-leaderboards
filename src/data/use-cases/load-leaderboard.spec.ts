enum Region {
  "AP" = "ap",
  "BR" = "br",
  "ESPORTS" = "esports",
  "EU" = "eu",
  "KR" = "kr",
  "default" = "ap"
}

enum Locales {
  "ar_AE",
  "de_DE",
  "en_US",
  "es_ES",
  "es_MX",
  "fr_FR",
  "id_ID",
  "it_IT",
  "ja_JP",
  "ko_KR",
  "pl_PL",
  "pt_BR",
  "ru_RU",
  "th_TH",
  "tr_TR",
  "vi_VN",
  "zh_TW"
}

type Leaderboard = {
  actId: String
  players: []
}

type RepositoryResponse = {
  header: any
  status: any
  body: any
}
interface ILoadLeaderboardByRegionAndActRepository {
  load(region: Region, actId: String): Promise<RepositoryResponse>
}
// 1: Obter o client
// 2: Obter todos os Atos
// 3: Obter a leaderboard baseada nos atos
interface ILoadLeaderboard{
  loadByRegionAndAct(region: Region, actId: String): Promise<{}>
}

class LoadLeaderboard implements ILoadLeaderboard{
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
    const { sut, loadLeaderboardByRegionAndActRepositorySpy } = makeSut()
    const response = sut.loadByRegionAndAct(Region.default, '')
    await expect(response).rejects.toThrow()
  })

  it("Should throws if loadLeaderboardByRegionAndActRepository throws", async ()=>{
    const sut = new LoadLeaderboard(new LoadLeaderboardByRegionAndActRepositoryWithErrorSpy())
    const response = sut.loadByRegionAndAct(Region.default, 'valid-act')
    await expect(response).rejects.toThrow()
  })

  it("Should return an data on success", async()=>{
    const { sut, loadLeaderboardByRegionAndActRepositorySpy } = makeSut()
    const leaderBoard = await sut.loadByRegionAndAct(Region.default, 'valid-act')
    expect(leaderBoard).toBeTruthy()
  })
 })