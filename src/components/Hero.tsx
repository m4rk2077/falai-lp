import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-dark/30 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-light/10 rounded-full blur-[128px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        {/* Logo: icon + text */}
        <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
          <img
            src="/assets/icon-waveform.png"
            alt=""
            className="h-14 sm:h-16"
          />
          <span className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-brand-mid to-brand-light bg-clip-text text-transparent">
            falai
          </span>
        </div>

        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block mb-6 px-4 py-1.5 text-[0.8rem] font-semibold tracking-wider uppercase rounded-full border border-brand-light/50 text-brand-light bg-brand-light/10 shadow-[0_0_15px_rgba(0,212,255,0.15)]"
        >
          Beta Exclusivo
        </motion.span>

        {/* Headline */}
        <h1 className="text-[2.5rem] leading-[1.1] sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 sm:mb-8">
          <span className="text-white">Pare de perder</span>
          <br />
          <span className="text-white">2 horas</span>
          <br />
          <span className="bg-gradient-to-r from-brand-mid to-brand-light bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,212,255,0.3)]">
            por dia digitando.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-neutral-300 mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">
          O FALAI transforma sua voz em texto pronto — no WhatsApp, no e-mail,
          nos portais, em qualquer lugar onde você digita.
        </p>

        {/* CTA */}
        <a
          href="#cadastro"
          id="hero-cta"
          className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-brand-dark via-brand-mid to-brand-light hover:brightness-110 transition-all shadow-lg shadow-brand-mid/20"
        >
          Quero participar do Beta
        </a>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#beneficios"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 text-neutral-500 hover:text-neutral-300 transition-colors"
      >
        <ChevronDown className="w-6 h-6 animate-bounce" />
      </motion.a>
    </section>
  );
}
