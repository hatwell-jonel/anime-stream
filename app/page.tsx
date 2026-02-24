'use client';

import Link from 'next/link';
import { Button } from '~/components/ui/button'
// import { hiAnimeScraper } from '~/lib/aniwatch';

import { useQuery } from '@tanstack/react-query';
import { orpc } from '~/lib/tanstackquery/orpc';


function Page() {

      // const scraper = hiAnimeScraper();
      // const data = await scraper.getHomePage();
      // console.log(data);

      const { data: homeData, isLoading: homeLoading } = useQuery(
            orpc.anime.getHomePage.queryOptions({}),
      );

      console.log(homeData);
      
      
      return (
            <div>
                  asdasd
                  {/* {
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
                  } */}
            </div>
      )
}

export default Page