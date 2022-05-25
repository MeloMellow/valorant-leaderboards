describe('Leaderboard', () => { 
  type Region = "BR" | "AP" | "ESPORTS" | "EU" | "KR" | "LATAM" | "NA"

  interface LoadLeaderboardByRegionAndActRepository {
    load: (region: Region, act: String) => Boolean
  }

  class LoadLeaderboard{
    constructor(private loadLeaderboardByRegionAndActRepository: LoadLeaderboardByRegionAndActRepository){
      
    }
    async load(region: Region, act: String): Promise<void>{
      console.log("in dev")
    }
  }

  test('Should ...', async () => { 
    
   })
 })