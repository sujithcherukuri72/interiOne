import Contact from "@/components/Contact";
import Finishes from "@/components/Finishes";
import Hero from "@/components/Hero";
import HeroStatement from "@/components/HeroStatement";
import Journey from "@/components/Journey";
import Nav from "@/components/Nav";
import Partners from "@/components/Partners";
import Showrooms from "@/components/Showrooms";
import Technology from "@/components/Technology";

export default function Home() {
  return (
    <>
      <Nav />
      {/* Clears the fixed bar, which sits outside the flow. */}
      <main className="flex flex-1 flex-col pt-[72px]">
        <Hero />
        <HeroStatement />
        <Technology />
        <Finishes />
        <Journey />
        <Partners />
        <Showrooms />
        <Contact />
      </main>
    </>
  );
}
