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

  const webhookUrl =
    process.env.LEAD_WEBHOOK_URL || process.env.VITE_LEAD_WEBHOOK_URL;

  if (!webhookUrl) {
    res.status(500).json({ error: "missing_lead_webhook_url" });
    return;
  }

  try {
    const payload =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;

    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload ?? {}),
    });

    if (!upstream.ok) {
      const details = await upstream.text();
      res.status(upstream.status).json({
        error: "webhook_rejected_request",
        status: upstream.status,
        details: details.slice(0, 500),
      });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({
      error: "proxy_failed",
      message: error instanceof Error ? error.message : "unknown_error",
    });
  }
}
