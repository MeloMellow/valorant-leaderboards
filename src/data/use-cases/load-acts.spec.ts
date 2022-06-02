import Locale from '../../constants/locale'

interface ILoadActsRepository{
  load(locale?: Locale): Promise<void>
}

interface ILoadActs{
  load(locale?: Locale): Promise<void>
}

class LoadActsRepositorySpy implements ILoadActsRepository{
  locale: Locale | null = null
  isLoaded: Boolean = false
  async load(locale?: Locale): Promise<void>{
    if(locale){
      this.locale = locale
    }
    this.isLoaded = true
  }
}

class LoadActsRepositoryWithErrorSpy implements ILoadActsRepository{
  async load(locale?: Locale): Promise<void>{
    throw new Error('Something went wrong')
  }
}

class LoadActs implements ILoadActs{
  constructor(private readonly loadActsRepository: ILoadActsRepository){}

  async load(locale?: Locale): Promise<void>{
    await this.loadActsRepository.load(locale)
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
  
  // it("Should return a data on success", async ()=>{
  //   const { sut } = makeSut()
  //   const acts = await sut.load()
  //   expect(acts).toBeTruthy()
  // })
})