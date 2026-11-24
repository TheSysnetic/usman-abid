import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Capabilities } from "@/components/sections/Capabilities";
import { Work } from "@/components/sections/Work";
import { Contact } from "@/components/sections/Contact";
import { BackdropLoader } from "@/components/three/BackdropLoader";

export default function Home() {
  return (
    <>
      <BackdropLoader />
      <Header />
      <main className="relative">
        <Hero />
        <About />
        <Experience />
        <Capabilities />
        <Work />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
