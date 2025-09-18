// src/app/page.tsx
export const dynamic = "force-dynamic";
import HomeHero from "@/components/home/HomeHero";
import HomeStats from "@/components/home/HomeStats";
import HomeServices from "@/components/HomeServices"; // το είχαμε ήδη
import HomeProcess from "@/components/home/HomeProcess";
import HomeFeatured from "@/components/home/HomeFeatured";
import HomeCTA from "@/components/home/HomeCTA";


export default function Home() {
  return (
    <main>
      <HomeHero />
      <HomeStats />
      <HomeServices />
      <HomeProcess />
      <HomeFeatured />
      <HomeCTA />
    </main>
  );
}
