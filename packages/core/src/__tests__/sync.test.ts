import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TabSync } from '../sync';

class MockBroadcastChannel {
  name: string;
  onmessage: ((event: any) => void) | null = null;
  private static channels: Map<string, MockBroadcastChannel> = new Map();
  constructor(name: string) { this.name = name; MockBroadcastChannel.channels.set(name, this); }
  postMessage(data: any) {
    MockBroadcastChannel.channels.forEach((ch, key) => {
      if (key === this.name && ch.onmessage) ch.onmessage({ data });
    });
  }
  close() { MockBroadcastChannel.channels.delete(this.name); }
}

(globalThis as any).BroadcastChannel = MockBroadcastChannel;

describe('TabSync', () => {
  beforeEach(() => {
    MockBroadcastChannel['channels'].clear();
  });

  afterEach(() => {
    MockBroadcastChannel['channels'].clear();
  });

  it('listen — creates BroadcastChannel and listens for LOGOUT', () => {
    const onLogout = vi.fn();
    const onTokenChange = vi.fn();
    const sync = new TabSync(onLogout, onTokenChange);

    sync.listen();

    const channel = MockBroadcastChannel['channels'].get('authms:sync');
    expect(channel).toBeDefined();
    expect(channel!.name).toBe('authms:sync');
    expect(channel!.onmessage).toBeDefined();

    channel!.onmessage!({ data: { type: 'LOGOUT', timestamp: Date.now() } });
    expect(onLogout).toHaveBeenCalledOnce();
    expect(onTokenChange).not.toHaveBeenCalled();
  });

  it('broadcast LOGOUT — calls onLogout callback on other listeners', () => {
    const onLogoutA = vi.fn();
    const syncA = new TabSync(onLogoutA, vi.fn());
    syncA.listen();

    const onLogoutB = vi.fn();
    const onTokenChangeB = vi.fn();
    const syncB = new TabSync(onLogoutB, onTokenChangeB);
    syncB.listen();

    syncA.broadcast('LOGOUT');

    expect(onLogoutA).not.toHaveBeenCalled();
    expect(onLogoutB).toHaveBeenCalledOnce();
    expect(onTokenChangeB).not.toHaveBeenCalled();
  });

  it('close — cleans up the channel', () => {
    const sync = new TabSync(vi.fn(), vi.fn());
    sync.listen();

    expect(MockBroadcastChannel['channels'].has('authms:sync')).toBe(true);

    sync.close();

    expect(MockBroadcastChannel['channels'].has('authms:sync')).toBe(false);
  });

  it('non-browser environment — handles missing BroadcastChannel gracefully', () => {
    const origBC = (globalThis as any).BroadcastChannel;
    (globalThis as any).BroadcastChannel = undefined;

    const onLogout = vi.fn();
    const sync = new TabSync(onLogout, vi.fn());

    expect(() => sync.listen()).not.toThrow();
    expect(onLogout).not.toHaveBeenCalled();

    (globalThis as any).BroadcastChannel = origBC;
  });
});
