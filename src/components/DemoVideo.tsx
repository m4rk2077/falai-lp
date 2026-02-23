import { motion } from "framer-motion";

export function DemoVideo() {
  return (
    <section id="demo" className="py-12 sm:py-20 lg:py-28 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Veja o FALAI em acao
          </h2>
          <p className="text-neutral-400 max-w-md mx-auto">
            Assista como e simples transformar sua voz em texto pronto em
            segundos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl overflow-hidden border border-border-subtle shadow-2xl shadow-brand-mid/10"
        >
          <wistia-player
            media-id="fxcch43ar9"
            aspect="1.7777777777777777"
          ></wistia-player>
        </motion.div>
      </div>
    </section>
  );
}
