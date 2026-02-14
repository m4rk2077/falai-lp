import { motion } from "framer-motion";
import { Mic, Cpu, ClipboardCheck, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface StepProps {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
  delay: number;
}

function Step({ number, icon, title, description, delay }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center text-center"
    >
      <div className="relative mb-3 sm:mb-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-dark to-brand-mid flex items-center justify-center text-white">
          {icon}
        </div>
        <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-brand-light text-surface text-xs font-bold flex items-center justify-center">
          {number}
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-neutral-400 text-sm max-w-xs leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

export function HowItWorks() {
  return (
    <section className="py-12 sm:py-20 lg:py-28 px-4 bg-surface-elevated">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Como funciona
          </h2>
          <p className="text-neutral-400 max-w-md mx-auto">
            3 passos. Sem instalacao complicada, sem treinamento.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 sm:gap-8 items-start">
          <div className="md:col-span-1">
            <Step
              number="1"
              icon={<Mic className="w-7 h-7" />}
              title="Fale"
              description="Aperte o atalho e fale naturalmente. Descreva o imovel, responda o cliente, anote a visita."
              delay={0}
            />
          </div>

          <div className="hidden md:flex items-center justify-center pt-8">
            <ArrowRight className="w-6 h-6 text-neutral-600" />
          </div>

          <div className="md:col-span-1">
            <Step
              number="2"
              icon={<Cpu className="w-7 h-7" />}
              title="FALAI transcreve"
              description="A IA converte sua voz em texto e corrige automaticamente. Em segundos."
              delay={0.15}
            />
          </div>

          <div className="hidden md:flex items-center justify-center pt-8">
            <ArrowRight className="w-6 h-6 text-neutral-600" />
          </div>

          <div className="md:col-span-1">
            <Step
              number="3"
              icon={<ClipboardCheck className="w-7 h-7" />}
              title="Cole no CRM"
              description="O texto aparece direto no campo ativo. WhatsApp Web, CRM, e-mail, portais. Sem copiar e colar."
              delay={0.3}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
