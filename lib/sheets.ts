import { OAuth2Client } from 'google-auth-library';
import { google, sheets_v4 } from 'googleapis';

export function getClient(): sheets_v4.Sheets {
  const auth = new OAuth2Client(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  );
  auth.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN });
  return google.sheets({ version: 'v4', auth });
}

export async function getFirstTabName(sheetId: string): Promise<string> {
  const sheets = getClient();
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
    fields: 'sheets.properties.title',
  });
  const title = meta.data.sheets?.[0]?.properties?.title;
  if (!title) throw new Error(`spreadsheet ${sheetId} has no tabs`);
  return title;
}

export async function readRows(
  sheetId: string,
  tabName: string,
): Promise<Record<string, string>[]> {
  const sheets = getClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `'${tabName.replace(/'/g, "''")}'`,
  });
  const values = res.data.values ?? [];
  if (values.length === 0) return [];
  const [headers, ...rows] = values;
  return rows.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[String(h)] = row[i] != null ? String(row[i]) : '';
    });
    return obj;
  });
}

export async function appendRow(
  sheetId: string,
  tabName: string,
  obj: Record<string, unknown>,
): Promise<void> {
  const sheets = getClient();
  const quoted = `'${tabName.replace(/'/g, "''")}'`;
  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${quoted}!1:1`,
  });
  const headers = (headerRes.data.values?.[0] ?? []).map((h) => String(h));
  const row = headers.map((h) => {
    const v = obj[h];
    return v == null ? '' : String(v);
  });
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: quoted,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });
}
