import crypto from "node:crypto";

type Json = Record<string, unknown>;

type LeadInput = {
  nome?: string;
  email?: string;
  whatsapp?: string;
  origem?: string;
  motivo?: string;
  origem_form?: string;
  landing_variant?: string;
  page_path?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  consent_version?: string;
  eventId?: string;
  pageUrl?: string;
  source?: string;
  timestamp?: string;
};

function asText(v: unknown, maxLen: number): string {
  const s = String(v ?? "").trim();
  return s.slice(0, maxLen);
}

function resolveEnv(name: string, fallback = ""): string {
  const value = String(process.env[name] ?? "").trim();
  if (value) return value;
  if (fallback) return fallback;
  throw new Error(`Missing env: ${name}`);
}

function resolveLeadSecret(keyId: string): string {
  const candidates = [
    `FALAI_LEAD_WEBHOOK_SECRET_${keyId.toUpperCase()}`,
    `LEAD_WEBHOOK_SECRET_${keyId.toUpperCase()}`,
    "FALAI_LEAD_WEBHOOK_SECRET",
  ];
  for (const name of candidates) {
    const val = String(process.env[name] ?? "").trim();
    if (val) return val;
  }
  throw new Error(`Missing env: lead webhook secret for key_id='${keyId}'`);
}

function toCanonicalPayload(input: LeadInput): Json {
  const nome = asText(input.nome, 160);
  const email = asText(input.email, 320).toLowerCase();
  const whatsapp = asText(input.whatsapp, 40);

  if (!nome) throw new Error("invalid_nome");
  if (!email) throw new Error("invalid_email");

  const origem = asText(input.origem, 120);
  const motivo = asText(input.motivo, 500) || (origem ? `Origem declarada: ${origem}` : "");

  return {
    idempotency_key: crypto.randomUUID(),
    nome,
    email,
    whatsapp,
    motivo,
    origem_form: asText(input.origem_form, 80) || "lp_beta_v1",
    landing_variant: asText(input.landing_variant, 80),
    page_path: asText(input.page_path, 500),
    referrer: asText(input.referrer, 1000),
    utm_source: asText(input.utm_source, 120),
    utm_medium: asText(input.utm_medium, 120),
    utm_campaign: asText(input.utm_campaign, 200),
    utm_content: asText(input.utm_content, 200),
    utm_term: asText(input.utm_term, 200),
    fbclid: asText(input.fbclid, 250),
    gclid: asText(input.gclid, 250),
    meta: {
      consent_version: asText(input.consent_version, 60) || "2026-02",
      consent_at: new Date().toISOString(),
      event_id: asText(input.eventId, 120) || null,
      page_url: asText(input.pageUrl, 1000) || null,
      source: asText(input.source, 60) || "lp-beta",
      client_timestamp: asText(input.timestamp, 60) || null,
    },
  };
}

async function postJson(url: string, payload: unknown): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
}

async function proxyLegacyWebhook(reqBody: LeadInput, webhookUrl: string): Promise<Response> {
  return postJson(webhookUrl, reqBody);
}

async function callSignedSupabaseLeadCapture(reqBody: LeadInput): Promise<Response> {
  const leadCaptureUrl = resolveEnv(
    "FALAI_LEAD_CAPTURE_URL",
    "https://cxqfhwpwrxiinkmcqvqs.supabase.co/functions/v1/lead_capture",
  );
  const keyId = resolveEnv("FALAI_LEAD_ACTIVE_KEY_ID", "v1");
  const secret = resolveLeadSecret(keyId);

  const payload = toCanonicalPayload(reqBody || {});
  const rawBody = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  return fetch(leadCaptureUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-falai-key-id": keyId,
      "x-falai-timestamp": timestamp,
      "x-falai-signature": signature,
    },
    body: rawBody,
  });
}

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  try {
    const reqBody = (typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body) as LeadInput;

    // Compatibility mode: if LEAD_WEBHOOK_URL is configured, keep proxy behavior.
    const legacyWebhookUrl = String(process.env.LEAD_WEBHOOK_URL ?? process.env.VITE_LEAD_WEBHOOK_URL ?? "").trim();

    const upstream = legacyWebhookUrl
      ? await proxyLegacyWebhook(reqBody, legacyWebhookUrl)
      : await callSignedSupabaseLeadCapture(reqBody);

    const details = await upstream.text();

    if (!upstream.ok) {
      res.status(502).json({
        ok: false,
        error: legacyWebhookUrl ? "webhook_rejected_request" : "lead_capture_failed",
        upstream_status: upstream.status,
        details: details.slice(0, 800),
      });
      return;
    }

    let json: Json = { ok: true };
    try {
      json = details ? (JSON.parse(details) as Json) : { ok: true };
    } catch {
      json = { ok: true };
    }

    res.status(200).json({ ok: true, ...json });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "internal_error",
      message: error instanceof Error ? error.message : "unknown_error",
    });
  }
}
