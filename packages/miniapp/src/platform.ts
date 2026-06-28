import type { AuthmsPlatform } from './types';

class MiniResponse {
  private _data: any;
  private _status: number;
  private _headers: Record<string, string>;

  constructor(data: any, status: number, headers: Record<string, string>) {
    this._data = data;
    this._status = status;
    this._headers = headers;
  }

  get ok(): boolean {
    return this._status >= 200 && this._status < 300;
  }

  get status(): number {
    return this._status;
  }

  get statusText(): string {
    return this._status >= 200 && this._status < 300 ? 'OK' : `Error ${this._status}`;
  }

  get headers(): { get(name: string): string | null } {
    const self = this;
    return {
      get(name: string): string | null {
        const key = name.toLowerCase();
        for (const [k, v] of Object.entries(self._headers)) {
          if (k.toLowerCase() === key) return v;
        }
        return null;
      },
    };
  }

  async json(): Promise<any> {
    return this._data;
  }
}

export const miniappPlatform: AuthmsPlatform = {
  storage: {
    getItem(key: string): string | null {
      try {
        const value = wx.getStorageSync(key);
        if (value === '' || value === undefined || value === null) return null;
        return typeof value === 'string' ? value : JSON.stringify(value);
      } catch {
        return null;
      }
    },
    setItem(key: string, value: string): void {
      try {
        wx.setStorageSync(key, value);
      } catch {
        /* quota exceeded, non-critical */
      }
    },
    removeItem(key: string): void {
      try {
        wx.removeStorageSync(key);
      } catch {
        /* ignore */
      }
    },
  },

  http: {
    request(input: string, init?: RequestInit): Promise<Response> {
      return new Promise<Response>((resolve, reject) => {
        const method = (init?.method || 'GET').toUpperCase();
        const header: Record<string, string> = {};
        if (init?.headers) {
          const h = init.headers as Record<string, string>;
          for (const [k, v] of Object.entries(h)) {
            header[k] = String(v);
          }
        }

        let data: string | undefined;
        if (typeof init?.body === 'string') {
          data = init.body;
        } else if (init?.body) {
          data = String(init.body);
        }

        wx.request({
          url: input,
          method: method as any,
          header,
          data,
          dataType: 'json',
          responseType: 'text',
          success(res: any) {
            const responseHeaders: Record<string, string> = {};
            if (res.header) {
              for (const [k, v] of Object.entries(res.header)) {
                responseHeaders[k] = String(v);
              }
            }
            const miniRes = new MiniResponse(
              res.data,
              res.statusCode || 200,
              responseHeaders,
            );
            resolve(miniRes as unknown as Response);
          },
          fail(err: any) {
            reject(new TypeError(`wx.request failed: ${err?.errMsg || String(err)}`));
          },
        });
      });
    },
  },
};
