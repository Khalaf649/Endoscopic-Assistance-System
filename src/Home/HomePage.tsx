import Hero from "./components/Hero";
import StatsRow from "./components/StatsRow";
import FeatureCards from "./components/FeatureCards";
import CTABanner from "./components/CTABanner";

export default function HomePage() {
  return (
    <div className="page-container">
      <Hero />
      <StatsRow />
      <FeatureCards />
      <CTABanner />
    </div>
  );
}