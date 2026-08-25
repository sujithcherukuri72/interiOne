import Contact from "@/components/Contact";
import DrawKitchen from "@/components/DrawKitchen";
import Estimator from "@/components/Estimator";
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
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Nav />
      {/* No top padding: the bar is glass now, so the hero has to run up
          underneath it — a 72px cream strip above the video is exactly what
          made the old bar read as a slab. The hero pads its own content
          instead. */}
      <main className="flex flex-1 flex-col">
        <Hero />
        <HeroStatement />
        <DrawKitchen />
        <Technology />
        <Finishes />
        {/* Once they have picked a layout and a finish, the number is the
            next question they ask. */}
        <Estimator />
        <Journey />
        {/* Proof lands right after the programme it is vouching for. */}
        <Testimonials />
        <Partners />
        <Showrooms />
        <Faqs />
        <Contact />
      </main>

      {/* Outside `main` because it is fixed furniture, not part of the reading
          order — and it watches the sections inside `main` to work out what the
          visitor's first message should say. */}
      <WhatsAppButton />
    </>
  );
}
