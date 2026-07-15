import QuickActions from "../components/home/QuickActions";
import Hero from "../components/home/Hero";
import Services from "../components/home/Services";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import AISection from "../components/home/AISection";
import Stats from "../components/home/Stats";
import Testimonials from "../components/home/Testimonials";
import DownloadApp from "../components/home/DownloadApp";
import FAQ from "../components/home/FAQ";
import Contact from "../components/home/Contact";
import QuickOrder from "../components/home/QuickOrder";

function Home() {
  return (
<>
  <Hero />
  <QuickOrder />
<QuickActions />
  <Services />
  <Features />
  <HowItWorks />
  <AISection />
  <Stats />
  <Testimonials />
  <DownloadApp />
  <FAQ />
  <Contact />
</>
  );
}

export default Home;