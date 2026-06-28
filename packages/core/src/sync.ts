type MessageType = 'LOGOUT' | 'TOKEN_REFRESHED' | 'LOGIN';

interface SyncMessage {
  type: MessageType;
  timestamp: number;
}

export class TabSync {
  private channel: BroadcastChannel | null = null;
  private onLogout: () => void;
  private onTokenChange: () => void;

  constructor(onLogout: () => void, onTokenChange: () => void) {
    this.onLogout = onLogout;
    this.onTokenChange = onTokenChange;
  }

  listen(): void {
    if (typeof BroadcastChannel === 'undefined') return;

    try {
      this.channel = new BroadcastChannel('authms:sync');
      this.channel.onmessage = (event: MessageEvent<SyncMessage>) => {
        const { type } = event.data;
        switch (type) {
          case 'LOGOUT':
            this.onLogout();
            break;
          case 'TOKEN_REFRESHED':
          case 'LOGIN':
            this.onTokenChange();
            break;
        }
      };
    } catch { /* BroadcastChannel not supported */ }
  }

  broadcast(type: MessageType): void {
    if (!this.channel) return;
    try {
      this.channel.postMessage({ type, timestamp: Date.now() });
    } catch { /* ignore broadcast failures */ }
  }

  close(): void {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
  }
}
