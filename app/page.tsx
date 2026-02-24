import Link from 'next/link';
import { Button } from '~/components/ui/button'
import { hiAnimeScraper } from '~/lib/aniwatch';


async function page() {

      const scraper = hiAnimeScraper();
      const data = await scraper.getHomePage();
      
      return (
            <div>
                  {
                        data.trendingAnimes.map((anime, index) => {
                              return (
                                    <Link 
                                          key={index} 
                                          href={`/anime/${anime.id}`}
                                    >
                                          <Button>
                                             {anime.name}
                                          </Button>
                                    </Link>
                              )
                        })
                  }
            </div>
      )
}

export default page