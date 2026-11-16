import { Loader } from './components/Loader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TwoEras } from './components/TwoEras';
import { Timeline } from './components/Timeline';
import { SurahExplorer } from './components/SurahExplorer';
import { FactsBanner, RevelationMap } from './components/MapAndFacts';
import { Quiz } from './components/Quiz';
import { Insights, VerseReflectionSection } from './components/VerseAndInsights';
import { Footer } from './components/Footer';
import { ProgressBadge, ProgressProvider, SectionVisitWatcher } from './components/Progress';

function App() {
  return (
    <ProgressProvider>
      <div className="min-h-screen bg-night-950">
        <Loader />
        <Navbar />
        <main>
          <Hero />
          <FactsBanner />
          <SectionVisitWatcher id="eras">
            <TwoEras />
          </SectionVisitWatcher>
          <SectionVisitWatcher id="timeline">
            <Timeline />
          </SectionVisitWatcher>
          <SectionVisitWatcher id="verse">
            <VerseReflectionSection />
          </SectionVisitWatcher>
          <Insights />
          <SectionVisitWatcher id="explorer">
            <SurahExplorer />
          </SectionVisitWatcher>
          <SectionVisitWatcher id="map">
            <RevelationMap />
          </SectionVisitWatcher>
          <SectionVisitWatcher id="quiz">
            <Quiz />
          </SectionVisitWatcher>
        </main>
        <Footer />
        <ProgressBadge />
      </div>
    </ProgressProvider>
  );
}

export default App;
