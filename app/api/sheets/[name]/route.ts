import { NextRequest, NextResponse } from 'next/server';
import { appendRow, getFirstTabName, readRows } from '@/lib/sheets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function resolveSheetId(name: string): string | null {
  if (name === 'master') return process.env.SHEET_ID_MASTER ?? null;
  if (name === 'input') return process.env.SHEET_ID_INPUT ?? null;
  return null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const { name } = await params;
    const sheetId = resolveSheetId(name);
    if (!sheetId) {
      return NextResponse.json({ error: `unknown sheet: ${name}` }, { status: 500 });
    }
    const tab = req.nextUrl.searchParams.get('tab') ?? (await getFirstTabName(sheetId));
    const rows = await readRows(sheetId, tab);
    return NextResponse.json(rows);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  _ctx: { params: Promise<{ name: string }> },
) {
  try {
    const sheetId = process.env.SHEET_ID_INPUT;
    if (!sheetId) {
      return NextResponse.json({ error: 'SHEET_ID_INPUT not configured' }, { status: 500 });
    }
    const tab = req.nextUrl.searchParams.get('tab') ?? (await getFirstTabName(sheetId));
    const body = (await req.json()) as Record<string, unknown>;
    await appendRow(sheetId, tab, body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
