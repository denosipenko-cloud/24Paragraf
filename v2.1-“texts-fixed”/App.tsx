
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemAnalysis } from './components/ProblemAnalysis';
import { SolutionLogic } from './components/SolutionLogic';
import { ResultValue } from './components/ResultValue';
import { ProcessLogic } from './components/ProcessLogic';
import { PricingSection } from './components/PricingSection';
import { RisksSection } from './components/RisksSection';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { PaymentModal } from './components/PaymentModal';
import { P1PreCheckoutModal_v2 } from './components/P1PreCheckoutModal_v2';
import { LanguageProvider } from './LanguageContext';

function MainApp() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isP1ModalOpen, setIsP1ModalOpen] = useState(false);

  const openP1Modal = () => setIsP1ModalOpen(true);
  const closeP1Modal = () => setIsP1ModalOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar onCtaClick={openP1Modal} />
      <main className="flex-grow">
        <Hero onCtaClick={openP1Modal} />
        <ProblemAnalysis />
        <SolutionLogic />
        <ResultValue />
        <ProcessLogic />
        <PricingSection 
          onSelectAssessment={() => setIsPaymentOpen(true)} 
          onSelectP1={openP1Modal}
        />
        <RisksSection />
        <FAQ />
        <FinalCTA onCtaClick={openP1Modal} />
      </main>
      <Footer />
      
      {isPaymentOpen && (
        <PaymentModal onClose={() => setIsPaymentOpen(false)} />
      )}

      {isP1ModalOpen && (
        <P1PreCheckoutModal_v2 onClose={closeP1Modal} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
