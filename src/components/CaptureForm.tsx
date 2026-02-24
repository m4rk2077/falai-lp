import { useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Loader2, ChevronDown } from "lucide-react";
import { createMetaEventId, trackMetaStandardEvent } from "../lib/metaPixel";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const schema = z.object({
  nome: z.string().min(2, "Informe seu nome"),
  email: z.string().email("E-mail inválido"),
  whatsapp: z
    .string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Informe um número válido"),
  origem: z.string().min(1, "Selecione uma opção"),
});

type FormData = z.infer<typeof schema>;

type SubmitError = {
  error?: string;
  message?: string;
};

const LEAD_API_URL = import.meta.env.VITE_LEAD_API_URL || "/api/lead";
const ATTR_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

type Attribution = Record<(typeof ATTR_KEYS)[number], string> & {
  referrer: string;
  page_path: string;
  landing_variant: string;
};

function getAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const out = {} as Attribution;

  for (const key of ATTR_KEYS) {
    const fromUrl = (params.get(key) || "").trim();
    if (fromUrl) {
      localStorage.setItem(`falai_${key}`, fromUrl);
      out[key] = fromUrl;
      continue;
    }
    out[key] = (localStorage.getItem(`falai_${key}`) || "").trim();
  }

  const variant = (params.get("variant") || params.get("ab") || "").trim();
  if (variant) {
    localStorage.setItem("falai_landing_variant", variant);
  }

  out.referrer = document.referrer || "";
  out.page_path = window.location.pathname || "/";
  out.landing_variant = (localStorage.getItem("falai_landing_variant") || "").trim();

  return out;
}

function mapServerError(err?: SubmitError): string {
  if (!err?.error) {
    return "Não foi possível enviar agora. Tente novamente em alguns segundos.";
  }
  if (err.error === "invalid_payload") {
    return "Dados inválidos. Revise os campos e tente novamente.";
  }
  if (err.error === "webhook_rejected_request") {
    return "Servidor de cadastro indisponível. Tente novamente em alguns segundos.";
  }
  if (err.error === "lead_capture_failed") {
    return "Instabilidade temporária no servidor. Tente novamente em alguns segundos.";
  }
  if (err.error === "internal_error" && err.message?.includes("Missing env")) {
    return "Configuração interna pendente. Avise o suporte para finalizar a integração.";
  }
  return "Não foi possível enviar agora. Tente novamente em alguns segundos.";
}

export function CaptureForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "", email: "", whatsapp: "", origem: "" },
  });

  async function onSubmit(data: FormData) {
    setServerError("");
    const eventId = createMetaEventId();

    try {
      const attribution = getAttribution();
      const res = await fetch(LEAD_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome,
          email: data.email,
          whatsapp: data.whatsapp,
          origem: data.origem,
          motivo: `Origem declarada: ${data.origem}`,
          origem_form: "lp_beta_v1",
          consent_version: "2026-02",
          source: "lp-beta",
          timestamp: new Date().toISOString(),
          eventId,
          pageUrl: window.location.href,
          ...attribution,
        }),
      });

      if (!res.ok) {
        let details: SubmitError = {};
        try {
          details = (await res.json()) as SubmitError;
        } catch {
          details = {};
        }
        throw new Error(mapServerError(details));
      }

      trackMetaStandardEvent(
        "Lead",
        {
          content_name: "Cadastro Beta FALAI",
          source: "lp-beta",
          status: "submitted",
        },
        eventId
      );
      setSubmitted(true);
    } catch (error) {
      console.error("Falha ao enviar lead", { endpoint: LEAD_API_URL, error });
      setServerError(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar agora. Tente novamente em alguns segundos."
      );
    }
  }

  const inputClasses =
    "w-full px-4 py-3.5 text-base rounded-xl bg-surface-elevated border border-border-subtle text-white placeholder-neutral-500 focus:outline-none focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/30 transition-all";

  return (
    <section
      id="cadastro"
      className="py-12 sm:py-20 lg:py-28 px-4 bg-gradient-to-b from-transparent via-brand-dark/5 to-transparent"
    >
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Participe do Beta exclusivo
          </h2>
          <p className="text-neutral-400 max-w-md mx-auto">
            Vagas limitadas. Deixe seus dados e receba acesso antes de todo
            mundo.
          </p>

          {/* Urgency badge */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-sm text-green-400 font-medium">
              247 corretores já se cadastraram
            </span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-10 rounded-2xl bg-surface-card border border-brand-light/20"
            >
              <CheckCircle className="w-14 h-14 text-brand-light mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Cadastro recebido!
              </h3>
              <p className="text-neutral-400">
                Vamos te chamar no WhatsApp com o acesso ao beta em breve.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5 p-5 sm:p-8 rounded-2xl bg-surface-card border border-border-subtle"
            >
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                  Nome
                </label>
                <input
                  {...register("nome")}
                  placeholder="Seu nome completo"
                  className={inputClasses}
                />
                {errors.nome && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.nome.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                  E-mail
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="seu@email.com"
                  className={inputClasses}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                  WhatsApp
                </label>
                <input
                  {...register("whatsapp", {
                    onChange: (e: ChangeEvent<HTMLInputElement>) => {
                      e.target.value = formatPhone(e.target.value);
                    },
                  })}
                  type="tel"
                  inputMode="numeric"
                  maxLength={15}
                  placeholder="(31) 99999-9999"
                  className={inputClasses}
                />
                {errors.whatsapp && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.whatsapp.message}
                  </p>
                )}
              </div>

              {/* Origem */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                  Como conheceu o FALAI?
                </label>
                <div className="relative">
                  <select
                    {...register("origem")}
                    className={`${inputClasses} appearance-none pr-10`}
                  >
                    <option value="" disabled>
                      Selecione
                    </option>
                    <option value="whatsapp-grupo">Grupo de WhatsApp</option>
                    <option value="instagram">Instagram</option>
                    <option value="indicacao">Indicação de colega</option>
                    <option value="google">Google / Pesquisa</option>
                    <option value="evento">Evento do setor</option>
                    <option value="outro">Outro</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                </div>
                {errors.origem && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.origem.message}
                  </p>
                )}
              </div>

              {serverError && (
                <p className="text-sm text-red-400 text-center">
                  {serverError}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-brand-dark via-brand-mid to-brand-light hover:brightness-110 disabled:opacity-60 transition-all shadow-lg shadow-brand-mid/25 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {isSubmitting ? "Enviando..." : "Quero participar do Beta"}
              </button>

              <p className="text-xs text-neutral-500 text-center">
                Seus dados estão seguros. Sem spam, prometido.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
