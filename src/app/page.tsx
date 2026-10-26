import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Capabilities } from "@/components/sections/Capabilities";
import { Contact } from "@/components/sections/Contact";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { TechStack } from "@/components/sections/TechStack";
import { WhyAdtech } from "@/components/sections/WhyAdtech";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <Services index="01" />
      <FeaturedWork index="02" />
      <WhyAdtech index="03" />
      <Process index="04" />
      <TechStack index="05" />
      <About index="06" />
      <Contact index="07" />
    </>
  );
}
