import Contact from "@/components/Contact";
import DrawKitchen from "@/components/DrawKitchen";
import Faqs from "@/components/Faqs";
import Finishes from "@/components/Finishes";
import Hero from "@/components/Hero";
import HeroStatement from "@/components/HeroStatement";
import Journey from "@/components/Journey";
import Nav from "@/components/Nav";
import Partners from "@/components/Partners";
import Showrooms from "@/components/Showrooms";
import Technology from "@/components/Technology";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <Nav />
      {/* Clears the fixed bar, which sits outside the flow. */}
      <main className="flex flex-1 flex-col pt-[72px]">
        <Hero />
        <HeroStatement />
        <Technology />
        <DrawKitchen />
        <Finishes />
        <Journey />
        {/* Proof lands right after the programme it is vouching for. */}
        <Testimonials />
        <Partners />
        <Showrooms />
        <Faqs />
        <Contact />
      </main>
    </>
  );
}
