export interface QorIDSession {
  username: string;
  publicKey: string;
}

export interface QorIDProvider {
  getSession(): Promise<QorIDSession | null>;
  login(username?: string, secret?: string): Promise<QorIDSession>;
  logout(): Promise<void>;
  signMessage(message: Uint8Array | string): Promise<string>;
}

