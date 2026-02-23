import { motion } from "framer-motion";
import { Mic, Sparkles, ClipboardPaste, Zap } from "lucide-react";
import type { ReactNode } from "react";

interface BenefitCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay: number;
}

function BenefitCard({ icon, title, description, delay }: BenefitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
      className="group relative p-5 sm:p-7 lg:p-8 rounded-2xl bg-surface-card border border-border-subtle border-t-0 overflow-hidden hover:border-brand-light/20 transition-colors"
    >
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-dark via-brand-mid to-brand-light" />

      <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-brand-dark to-brand-mid/60 text-brand-light">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-neutral-400 leading-relaxed text-[0.9rem]">
        {description}
      </p>
    </motion.div>
  );
}

const benefits = [
  {
    icon: <Mic className="w-7 h-7" />,
    title: "Transcrição Instantânea",
    description:
      "Fale naturalmente, o texto aparece em segundos. Sem espera, sem complicação.",
  },
  {
    icon: <Sparkles className="w-7 h-7" />,
    title: "Correção Automática",
    description:
      "A IA corrige gramática e formata o texto. Pronto pra usar, sem revisar.",
  },
  {
    icon: <ClipboardPaste className="w-7 h-7" />,
    title: "Cola em Qualquer Lugar",
    description:
      "O texto vai direto pro campo ativo. WhatsApp, e-mail, portais, CRM, tudo.",
  },
  {
    icon: <Zap className="w-7 h-7" />,
    title: "Simples de Usar",
    description:
      "Aperte um atalho, fale, solte. Sem configuração, sem treinamento.",
  },
];

export function Benefits() {
  return (
    <section id="beneficios" className="py-12 sm:py-20 lg:py-28 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Por que corretores escolhem o FALAI
          </h2>
          <p className="text-neutral-400 max-w-lg mx-auto">
            Tudo que você precisa pra parar de digitar e começar a produzir.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
          {benefits.map((b, i) => (
            <BenefitCard key={b.title} {...b} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
