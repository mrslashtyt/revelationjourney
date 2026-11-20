import { NavProvider, useNav } from './components/NavContext';
import { Loader } from './components/Loader';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { SurahExplorer } from './components/SurahExplorer';
import { TwoEras } from './components/TwoEras';
import { Timeline } from './components/Timeline';
import { RevelationMap } from './components/MapAndFacts';
import { QuizPage } from './components/QuizPage';
import { LearnPage } from './components/LearnPage';
import { AskAIPage } from './components/AskAIPage';
import { ProgressPage } from './components/ProgressPage';

function PageRouter() {
  const { page } = useNav();

  switch (page) {
    case 'home': return <HomePage />;
    case 'explorer': return <SurahExplorer />;
    case 'eras': return <TwoEras />;
    case 'timeline': return <Timeline />;
    case 'map': return <RevelationMap />;
    case 'quiz': return <QuizPage />;
    case 'learn': return <LearnPage />;
    case 'askai': return <AskAIPage />;
    case 'progress': return <ProgressPage />;
    default: return <HomePage />;
  }
}

function App() {
  return (
    <NavProvider>
      <div className="flex min-h-screen flex-col bg-ivory-50">
        <Loader />
        <Navbar />
        <main className="flex-1">
          <PageRouter />
        </main>
        <Footer />
      </div>
    </NavProvider>
  );
}

export default App;
