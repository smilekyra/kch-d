'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';

const TOKEN_KEY = 'kch_id_token';

type GoogleCredentialResponse = { credential: string };

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (resp: GoogleCredentialResponse) => void;
            hd?: string;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: { theme?: string; size?: string; type?: string },
          ) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    const padded = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(padded);
    const decoded = decodeURIComponent(
      json
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const allowedHd = process.env.NEXT_PUBLIC_ALLOWED_HD ?? '';
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) setToken(stored);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    window.google?.accounts.id.disableAutoSelect();
  }, []);

  const handleCredential = useCallback(
    (resp: GoogleCredentialResponse) => {
      const payload = decodeJwt(resp.credential);
      const hd = payload && typeof payload['hd'] === 'string' ? (payload['hd'] as string) : '';
      if (hd && hd === allowedHd) {
        localStorage.setItem(TOKEN_KEY, resp.credential);
        setToken(resp.credential);
      } else {
        alert('KCH 도메인 메일만 접근 가능합니다');
        signOut();
      }
    },
    [allowedHd, signOut],
  );

  useEffect(() => {
    if (!scriptReady || token) return;
    if (!window.google || !buttonRef.current) return;
    if (!clientId) {
      console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set');
      return;
    }
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredential,
      hd: allowedHd || undefined,
      auto_select: false,
    });
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
    });
  }, [scriptReady, token, clientId, allowedHd, handleCredential]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        async
        defer
        onLoad={() => setScriptReady(true)}
      />
      {token ? (
        <>
          <header className="flex items-center justify-end gap-3 border-b px-4 py-2">
            <button
              type="button"
              onClick={signOut}
              className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
            >
              로그아웃
            </button>
          </header>
          {children}
        </>
      ) : (
        <div className="flex min-h-screen items-center justify-center">
          <div id="g_id_signin" ref={buttonRef} />
        </div>
      )}
    </>
  );
}

export default AuthGate;
