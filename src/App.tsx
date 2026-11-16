import { Loader } from './components/Loader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TwoEras } from './components/TwoEras';
import { Timeline } from './components/Timeline';
import { SurahExplorer } from './components/SurahExplorer';
import { FactsBanner, RevelationMap } from './components/MapAndFacts';
import { Quiz } from './components/Quiz';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-night-950">
      <Loader />
      <Navbar />
      <main>
        <Hero />
        <FactsBanner />
        <TwoEras />
        <Timeline />
        <SurahExplorer />
        <RevelationMap />
        <Quiz />
      </main>
      <Footer />
    </div>
  );
}

export default App;
