import { motion } from "framer-motion";

const stats = [
  { value: "500+", label: "Corretores na fila" },
  { value: "2h+", label: "Economizadas por dia" },
  { value: "98%", label: "Taxa de precisao" },
];

export function SocialProof() {
  return (
    <section className="py-8 sm:py-14 px-4 bg-surface-elevated">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-6 text-center"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <span className="block text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-brand-mid to-brand-light bg-clip-text text-transparent">
                {s.value}
              </span>
              <span className="block text-xs sm:text-sm text-neutral-400 mt-1">
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="text-neutral-300 italic text-sm sm:text-base max-w-xl mx-auto">
            "Eu gastava a manha inteira digitando descricao de imovel.
            Agora falo em 2 minutos e ta pronto."
          </p>
          <cite className="block text-xs text-neutral-500 mt-2 not-italic">
            — Marcos R., corretor ha 18 anos em SP
          </cite>
        </motion.blockquote>
      </div>
    </section>
  );
}
