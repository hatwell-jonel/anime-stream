'use client'

import Hero from '~/features/Hero'
import TopTen from './features/top-ten'

export default function Home() {
      return (
            <main className="min-h-screen bg-background text-foreground">
                  <Hero />
                  
                  <section className="px-4 md:px-8 py-12 space-y-12">
                        <div>
                              <TopTen />
                        </div>
                  </section>
            </main>
      )
}
