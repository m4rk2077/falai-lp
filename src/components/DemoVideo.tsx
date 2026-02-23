import { useRef } from "react";
import { motion } from "framer-motion";
import { createMetaEventId, trackMetaCustomEvent } from "../lib/metaPixel";

export function DemoVideo() {
  const hasTrackedVideoClick = useRef(false);

  function handleVideoInteraction() {
    if (hasTrackedVideoClick.current) return;
    hasTrackedVideoClick.current = true;

    trackMetaCustomEvent(
      "VideoClick",
      {
        content_name: "Demo FALAI",
        content_type: "video",
      },
      createMetaEventId()
    );
  }

  return (
    <section id="demo" className="relative py-12 sm:py-20 lg:py-28 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-mid/15 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-brand-light/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-brand-dark/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="inline-block mb-4 px-4 py-1.5 text-[0.75rem] font-semibold tracking-wider uppercase rounded-full border border-brand-mid/40 text-brand-light bg-brand-mid/10">
            Demonstração
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-brand-mid to-brand-light bg-clip-text text-transparent">
              Veja o FALAI em ação
            </span>
          </h2>
          <p className="text-neutral-400 max-w-md mx-auto">
            Assista como é simples transformar sua voz em texto pronto em
            segundos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative rounded-2xl overflow-hidden"
        >
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-brand-dark via-brand-mid to-brand-light opacity-60" />

          <div
            className="relative m-[1px] rounded-2xl overflow-hidden bg-surface shadow-2xl shadow-brand-mid/20"
            onPointerDown={handleVideoInteraction}
          >
            <wistia-player
              media-id="fxcch43ar9"
              aspect="1.7777777777777777"
            ></wistia-player>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
