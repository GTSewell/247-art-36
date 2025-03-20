
import Hero from "@/components/Hero";
import CallToAction from "@/components/sections/CallToAction";
import Navigation from "@/components/navigation/Navigation";
import JoinUndergroundSection from "@/components/sections/JoinUndergroundSection";
import { useAppMode } from "@/contexts/AppModeContext";
import PWANavigation from "@/components/pwa/PWANavigation";
import { Helmet } from "react-helmet";

const Index = () => {
  const { isPWA } = useAppMode();

  return (
    <>
      <Helmet>
        <meta property="og:image" content="/lovable-uploads/c54f87f7-7b02-4bc8-999b-f5a580ad369e.png" />
        <link rel="icon" href="/lovable-uploads/15e8cb31-73b1-4d72-9d9b-0dac8bf0baed.png" />
      </Helmet>
      <main className={`min-h-screen ${isPWA ? 'overflow-hidden' : ''}`}>
        {isPWA ? <PWANavigation /> : <Navigation />}
        <Hero />
        <JoinUndergroundSection />
        <CallToAction />
      </main>
    </>
  );
};

export default Index;
