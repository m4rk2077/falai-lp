import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroCta = document.getElementById("hero-cta");
    const formSection = document.getElementById("cadastro");
    if (!heroCta || !formSection) return;

    let heroOut = false;
    let formIn = false;

    const heroObs = new IntersectionObserver(
      ([entry]) => {
        heroOut = !entry.isIntersecting;
        setVisible(heroOut && !formIn);
      },
      { threshold: 0 }
    );

    const formObs = new IntersectionObserver(
      ([entry]) => {
        formIn = entry.isIntersecting;
        setVisible(heroOut && !formIn);
      },
      { threshold: 0.1 }
    );

    heroObs.observe(heroCta);
    formObs.observe(formSection);

    return () => {
      heroObs.disconnect();
      formObs.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 block md:hidden bg-surface/90 backdrop-blur-md border-t border-border-subtle px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <a
            href="#cadastro"
            className="block w-full py-3.5 text-sm font-semibold text-white text-center rounded-xl bg-gradient-to-r from-brand-dark via-brand-mid to-brand-light shadow-lg shadow-brand-mid/25"
          >
            Quero participar do Beta
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
