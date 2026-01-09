import { useState } from 'react';
import LandingPage from './components/LandingPage';
import DiscoveryFlow from './components/DiscoveryFlow';

function App() {
  const [showDiscovery, setShowDiscovery] = useState(false);

  if (showDiscovery) {
    return <DiscoveryFlow onBack={() => setShowDiscovery(false)} />;
  }

  return <LandingPage onStartAnalysis={() => setShowDiscovery(true)} />;
}

export default App;
