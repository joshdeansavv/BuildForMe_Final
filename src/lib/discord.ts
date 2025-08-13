export function buildBotInviteUrl(
  clientId: string,
  options?: {
    permissions?: string;
    scope?: string;
    guildId?: string;
    disableGuildSelect?: boolean;
  }
): string {
  const permissions = options?.permissions ?? '8';
  const scope = options?.scope ?? 'bot%20applications.commands';
  const base = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=${scope}`;
  const guildParam = options?.guildId ? `&guild_id=${options.guildId}` : '';
  const disableParam = options?.disableGuildSelect ? `&disable_guild_select=true` : '';
  return `${base}${guildParam}${disableParam}`;
}

export function toDiscordAppDeeplink(webUrl: string): string {
  try {
    const url = new URL(webUrl);
    // Map https://discord.com/<path> -> discord://-/<path>
    const pathWithQuery = `${url.pathname}${url.search}`;
    return `discord://-/${pathWithQuery.replace(/^\//, '')}`;
  } catch {
    // Fallback: naive replacement
    return webUrl.replace(/^https?:\/\//, 'discord://-/');
  }
}

export function openInDiscordAppFirst(webUrl: string): void {
  const appUrl = toDiscordAppDeeplink(webUrl);
  let didFallback = false;

  const openFallback = () => {
    if (didFallback) return;
    didFallback = true;
    window.open(webUrl, '_blank', 'noopener');
  };

  try {
    const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isIOS || isAndroid) {
      const start = Date.now();
      // Attempt to open the Discord app
      window.location.href = appUrl;
      // If the app doesn't open, fallback after a short delay
      setTimeout(() => {
        if (Date.now() - start < 1500) {
          openFallback();
        }
      }, 700);
    } else {
      // Desktop: attempt deep link, then fallback soon after
      window.location.href = appUrl;
      setTimeout(openFallback, 700);
    }
  } catch {
    openFallback();
  }
}


