import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ShieldCheck } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-border-subtle last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 sm:py-6 text-left cursor-pointer"
      >
        <span className="text-[0.95rem] sm:text-base font-semibold text-white leading-snug">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-brand-light" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 sm:pb-6 text-neutral-400 text-sm sm:text-[0.9rem] leading-relaxed pr-8">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const faqs = [
  {
    question: "O FALAI funciona em qual sistema operacional?",
    answer:
      "Atualmente o FALAI funciona exclusivamente no Windows. Estamos trabalhando para trazer suporte ao macOS em breve. Fique de olho nas novidades!",
  },
  {
    question: "Meus dados e áudios ficam seguros?",
    answer:
      "Sim. A privacidade dos seus dados é nossa prioridade. Seus áudios são processados de forma segura e não são armazenados após a transcrição. Nenhum conteúdo é compartilhado com terceiros. Utilizamos criptografia em toda a comunicação.",
  },
  {
    question: "O FALAI funciona em qualquer aplicativo?",
    answer:
      "Sim! O FALAI funciona em qualquer campo de texto — WhatsApp Web, Gmail, Outlook, CRMs, portais de imóveis, Google Docs, e qualquer outro programa onde você digita. Basta ativar o atalho e falar.",
  },
  {
    question: "Preciso instalar alguma coisa?",
    answer:
      "Sim, é um aplicativo leve que você instala no seu computador Windows. A instalação é simples e leva menos de 2 minutos. Não precisa de configuração técnica.",
  },
  {
    question: "O FALAI funciona offline?",
    answer:
      "Não. O FALAI precisa de conexão com a internet para processar a transcrição com inteligência artificial. Porém, o consumo de dados é muito baixo.",
  },
  {
    question: "Quanto custa o FALAI?",
    answer:
      "Durante o período de Beta, o acesso é gratuito para os primeiros participantes. Após o lançamento oficial, teremos planos acessíveis. Quem entrar no Beta terá condições especiais.",
  },
  {
    question: "A transcrição funciona bem com sotaque?",
    answer:
      "Sim! O FALAI utiliza inteligência artificial avançada que reconhece diferentes sotaques e variações do português brasileiro com alta precisão.",
  },
  {
    question: "Como o FALAI trata a privacidade das conversas dos meus clientes?",
    answer:
      "Levamos a privacidade muito a sério. Os áudios são processados em tempo real e descartados imediatamente após a transcrição. Não armazenamos gravações nem textos transcritos em nossos servidores. Seus dados e os dos seus clientes estão protegidos.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-12 sm:py-20 lg:py-28 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Perguntas frequentes
          </h2>
          <p className="text-neutral-400 max-w-md mx-auto">
            Tire suas dúvidas antes de se cadastrar.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-surface-card border border-border-subtle p-5 sm:p-8"
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-6 sm:mt-8 flex items-center justify-center gap-3 rounded-xl bg-surface-card/60 border border-border-subtle/50 px-5 py-4"
        >
          <ShieldCheck className="w-5 h-5 text-brand-light shrink-0" />
          <p className="text-xs sm:text-sm text-neutral-400">
            <span className="text-neutral-300 font-medium">Seus dados estão protegidos.</span>{" "}
            Utilizamos criptografia de ponta a ponta e não compartilhamos informações com terceiros.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
