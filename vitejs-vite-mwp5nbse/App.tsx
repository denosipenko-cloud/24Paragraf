import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemAnalysis } from './components/ProblemAnalysis';
import { SolutionLogic } from './components/SolutionLogic';
import { ResultValue } from './components/ResultValue';
import { PricingSection } from './components/PricingSection';
import { RisksSection } from './components/RisksSection';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { PaymentModal } from './components/PaymentModal';
import { P1PreCheckoutModal_v2 } from './components/P1PreCheckoutModal_v2';
import { P2PreCheckoutModal } from './components/P2PreCheckoutModal';
import { P3PreCheckoutModal } from './components/P3PreCheckoutModal';
import { P4PreCheckoutModal } from './components/P4PreCheckoutModal';
import { LanguageProvider } from './LanguageContext';

function MainApp() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({ name: '', amount: 0 });
  const [isP1ModalOpen, setIsP1ModalOpen] = useState(false);
  const [isP2ModalOpen, setIsP2ModalOpen] = useState(false);
  const [isP3ModalOpen, setIsP3ModalOpen] = useState(false);
  const [isP4ModalOpen, setIsP4ModalOpen] = useState(false);

  const openP1Modal = () => setIsP1ModalOpen(true);
  const openP2Modal = () => setIsP2ModalOpen(true);
  const openP3Modal = () => setIsP3ModalOpen(true);
  const openP4Modal = () => setIsP4ModalOpen(true);

  const handleProceedToPayment = (amount: number, name: string) => {
    setPaymentData({ name, amount });
    setIsP1ModalOpen(false);
    setIsP2ModalOpen(false);
    setIsP3ModalOpen(false);
    setIsP4ModalOpen(false);
    setIsPaymentOpen(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      <Navbar onCtaClick={openP1Modal} />
      <main>
        <Hero onCtaClick={openP1Modal} />
        <ProblemAnalysis />
        <SolutionLogic />
        <ResultValue />
        <PricingSection
          onSelectP4={openP4Modal}
          onSelectP1={openP1Modal}
          onSelectP2={openP2Modal}
          onSelectP3={openP3Modal}
        />
        <RisksSection />
        <FAQ />
        <FinalCTA onCtaClick={openP1Modal} />
      </main>
      <Footer />

      {isPaymentOpen && (
        <PaymentModal
          onClose={() => setIsPaymentOpen(false)}
          packageName={paymentData.name}
          amount={paymentData.amount}
        />
      )}

      {isP1ModalOpen && (
        <P1PreCheckoutModal_v2
          onClose={() => setIsP1ModalOpen(false)}
          onProceed={(amount, name) => handleProceedToPayment(amount, name)}
        />
      )}

      {isP2ModalOpen && (
        <P2PreCheckoutModal
          onClose={() => setIsP2ModalOpen(false)}
          onProceed={(amount, name) => handleProceedToPayment(amount, name)}
        />
      )}

      {isP3ModalOpen && (
        <P3PreCheckoutModal
          onClose={() => setIsP3ModalOpen(false)}
          onProceed={(amount, name) => handleProceedToPayment(amount, name)}
        />
      )}

      {isP4ModalOpen && (
        <P4PreCheckoutModal
          onClose={() => setIsP4ModalOpen(false)}
          onProceed={(amount, name) => handleProceedToPayment(amount, name)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}

export default App;
