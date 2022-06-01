enum Region {
  "AP" = "ap",
  "BR" = "br",
  "ESPORTS" = "esports",
  "EU" = "eu",
  "KR" = "kr",
  "validRegion" = "valid-region"
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

type RepositoryResponse = {
  header: {}
  status: any
  body: {}
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
  async loadByRegionAndAct(region: Region, actId: String): Promise<RepositoryResponse>{
    if(!actId){
      throw new Error('actId is missing')
    }
    const response = await this.loadLeaderboardByRegionAndActRepository.load(region, actId)
    return response
  }
}

class LoadLeaderboardByRegionAndActRepositorySpy implements ILoadLeaderboardByRegionAndActRepository{
  region: Region | null = null
  actId: String | null = null
  async load(region: Region, actId: String): Promise<RepositoryResponse>{
    this.region = region
    this.actId = actId
    return { header: '', status: 200, body: { players: 'any'}
    }
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
    await sut.loadByRegionAndAct(Region.validRegion, 'valid-act')
    expect(loadLeaderboardByRegionAndActRepositorySpy.region).toBe(Region.validRegion)
    expect(loadLeaderboardByRegionAndActRepositorySpy.actId).toBe('valid-act')
  })

  it("Should throws when called without actId", async ()=>{
    const { sut, loadLeaderboardByRegionAndActRepositorySpy } = makeSut()
    const response = sut.loadByRegionAndAct(Region.validRegion, '')
    await expect(response).rejects.toThrow()
  })
 })