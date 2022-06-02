import Locale from '../../constants/locale'
import RepositoryResponse from '../../infra/repository-response'

interface ILoadActsRepository{
  load(locale?: Locale): Promise<RepositoryResponse>
}

type Act = {
  name: String
  id: String
  type: String
}
interface ILoadActs{
  load(locale?: Locale): Promise<Array<Act>>
}

class LoadActsRepositorySpy implements ILoadActsRepository{
  locale: Locale | null = null
  isLoaded: Boolean = false
  async load(locale?: Locale): Promise<RepositoryResponse>{
    if(locale){
      this.locale = locale
    }
    this.isLoaded = true
    return {header: {}, status: {}, body: { acts: [{}, {}, {}]}}
  }
}

class LoadActsRepositoryWithInvalidResponseSpy implements ILoadActsRepository{
  async load(locale?: Locale): Promise<RepositoryResponse>{
    return {header: {}, status: {}, body: {}}
  }
}

class LoadActsRepositoryWithErrorSpy implements ILoadActsRepository{
  async load(locale?: Locale): Promise<RepositoryResponse>{
    throw new Error('Something went wrong')
  }
}

class LoadActs implements ILoadActs{
  constructor(private readonly loadActsRepository: ILoadActsRepository){}

  async load(locale?: Locale): Promise<Array<Act>>{
    const response = await this.loadActsRepository.load(locale)
    const acts = response.body['acts']
    if(!acts || acts.length<=0){
      throw new Error(`Something went wrong, no act found in the response: ${JSON.stringify(response)}`)
    }
    return acts
  }
}

const makeSut = (): { sut: LoadActs,  loadActsRepositorySpy: LoadActsRepositorySpy} =>{
  const loadActsRepositorySpy = new LoadActsRepositorySpy()
  const sut = new LoadActs(loadActsRepositorySpy)
  return {
    sut,
    loadActsRepositorySpy
  }
}

describe('LoadActs', () => { 
  it("Should call loadActsRepository with correct params if provided", async ()=>{
    const { sut, loadActsRepositorySpy } = makeSut()
    await sut.load(Locale['pt_BR'])
    expect(loadActsRepositorySpy.locale).toBe(Locale['pt_BR'])
  })

  it("Should call loadActsRepository without params if no provided", async ()=>{//This test shouldnt exist
    const { sut, loadActsRepositorySpy } = makeSut()
    await sut.load()
    expect(loadActsRepositorySpy.isLoaded).toBeTruthy()
  })

  it("Should throws if loadActsRepository throws", async ()=>{
    const sut = new LoadActs(new LoadActsRepositoryWithErrorSpy())
    const response = sut.load()
    await expect(response).rejects.toThrow()
  })

  it("Should throws if an invalid response is provided on success", async ()=>{
    const sut = new LoadActs(new LoadActsRepositoryWithInvalidResponseSpy())
    const response = sut.load()
    await expect(response).rejects.toThrow()
  })
})