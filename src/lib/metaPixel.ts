type FbqCommand = "track";
type FbqStandardEvent = "Lead";

type FbqFunction = {
  (...args: unknown[]): void;
};

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID?.trim();

function hasValidPixelId(): boolean {
  return Boolean(META_PIXEL_ID);
}

function sendFbq(
  command: FbqCommand,
  event: string,
  params?: Record<string, unknown>,
  options?: Record<string, unknown>
) {
  const win = window as Window & { fbq?: FbqFunction };
  if (typeof win.fbq !== "function") return;
  if (params && options) {
    win.fbq(command, event, params, options);
    return;
  }
  if (params) {
    win.fbq(command, event, params);
    return;
  }
  win.fbq(command, event);
}

export function createMetaEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `event_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
}

export function trackMetaStandardEvent(
  event: FbqStandardEvent,
  params?: Record<string, unknown>,
  eventId?: string
) {
  if (!hasValidPixelId()) return;
  const options = eventId ? { eventID: eventId } : undefined;
  sendFbq("track", event, params, options);
}
