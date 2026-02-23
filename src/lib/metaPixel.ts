type FbqCommand = "init" | "track";
type FbqStandardEvent = "PageView" | "Lead";

type FbqFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  loaded?: boolean;
  version?: string;
  push?: (...args: unknown[]) => void;
};

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID?.trim();

function hasValidPixelId(): boolean {
  return Boolean(META_PIXEL_ID);
}

function createFbqStub() {
  const win = window as Window & { fbq?: FbqFunction; _fbq?: FbqFunction };
  if (win.fbq) return;

  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
      return;
    }
    fbq.queue = fbq.queue ?? [];
    fbq.queue.push(args);
  }) as FbqFunction;

  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];

  win.fbq = fbq;
  win._fbq = fbq;
}

function injectMetaPixelScript() {
  if (document.querySelector('script[data-meta-pixel="true"]')) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  script.setAttribute("data-meta-pixel", "true");
  document.head.appendChild(script);
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

export function initMetaPixel() {
  if (!hasValidPixelId()) return;
  const win = window as Window & { __metaPixelInitialized?: boolean };
  if (win.__metaPixelInitialized) return;

  createFbqStub();
  injectMetaPixelScript();

  sendFbq("init", META_PIXEL_ID!);
  sendFbq("track", "PageView");

  win.__metaPixelInitialized = true;
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
