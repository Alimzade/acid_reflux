import { useState } from 'react';
import { Header } from './components/Header';
import { ConceptDocs } from './components/ConceptDocs';
import { TerritoryManager } from './components/TerritoryManager';
import { MarketPulse } from './components/MarketPulse';
import dbData from './data/db.json';
import { Claim, Database } from './types';

export function App() {
  const [db, setDb] = useState<Database>(dbData as Database);
  const [activeTab, setActiveTab] = useState<'concept' | 'territory'>('concept');

  const handleAddClaim = (newClaim: Claim) => {
    setDb((prev) => ({
      ...prev,
      claims: [...prev.claims, newClaim]
    }));
  };

  return (
    <div className="container">
      <Header
        info={db.projectInfo}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main>
        {activeTab === 'concept' ? (
          <ConceptDocs />
        ) : (
          <TerritoryManager claims={db.claims} onAddClaim={handleAddClaim} />
        )}
        <MarketPulse />
      </main>
    </div>
  );
}

export default App;
