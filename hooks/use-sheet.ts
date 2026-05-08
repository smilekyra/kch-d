'use client';

import { useCallback, useEffect, useState } from 'react';

type Row = Record<string, string>;
type SheetName = 'master' | 'input';

export function useSheet(name: SheetName, tab: string) {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/sheets/${name}?tab=${encodeURIComponent(tab)}`, {
        cache: 'no-store',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setData(json as Row[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [name, tab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export async function appendToSheet(
  name: SheetName,
  tab: string,
  body: Record<string, unknown>,
): Promise<void> {
  const res = await fetch(`/api/sheets/${name}?tab=${encodeURIComponent(tab)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
}
