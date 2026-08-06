import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from './context/AppContext';
import WelcomeScreen   from './screens/onboarding/WelcomeScreen';
import RoleSelectScreen from './screens/onboarding/RoleSelectScreen';
import TouristShell    from './screens/tourist/TouristShell';
import PartnerShell    from './screens/partner/PartnerShell';

const slide = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit:    { opacity: 0, x: -30, transition: { duration: 0.2 } },
};

export default function App() {
  const { state } = useApp();
  const [welcomeDone, setWelcomeDone] = useState(false);

  const screen = (() => {
    if (!state.onboarded) return welcomeDone ? 'role' : 'welcome';
    return state.role === 'partner' ? 'partner' : 'tourist';
  })();

  return (
    <AnimatePresence mode="wait">
      {screen === 'welcome' && (
        <motion.div key="welcome" className="w-full flex justify-center" {...slide}>
          <WelcomeScreen onNext={() => setWelcomeDone(true)} />
        </motion.div>
      )}
      {screen === 'role' && (
        <motion.div key="role" className="w-full flex justify-center" {...slide}>
          <RoleSelectScreen />
        </motion.div>
      )}
      {screen === 'tourist' && (
        <motion.div key="tourist" className="w-full flex justify-center" {...slide}>
          <TouristShell />
        </motion.div>
      )}
      {screen === 'partner' && (
        <motion.div key="partner" className="w-full flex justify-center" {...slide}>
          <PartnerShell />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
