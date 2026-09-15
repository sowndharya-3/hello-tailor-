// Step 17 — CSV export, respecting whatever filter produced the rows passed in (the caller is
// responsible for filtering; this module only serializes + delivers the file). Web uses a plain
// Blob + object URL (no native module needed, works in any browser including the RN-web preview
// this project runs in); native goes through expo-file-system + expo-sharing's share sheet, the
// standard Expo pattern for "save/export a generated file" without needing storage permissions.
import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export interface CsvColumn<T> {
  header: string;
  value: (row: T) => string | number;
}

function toCsv<T>(columns: CsvColumn<T>[], rows: T[]): string {
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = columns.map((c) => escape(c.header)).join(',');
  const lines = rows.map((row) => columns.map((c) => escape(c.value(row))).join(','));
  return [header, ...lines].join('\r\n');
}

export async function exportCsv<T>(filename: string, columns: CsvColumn<T>[], rows: T[]): Promise<void> {
  const csv = toCsv(columns, rows);

  if (Platform.OS === 'web') {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return;
  }

  const file = new File(Paths.cache, filename);
  if (file.exists) file.delete();
  file.create();
  file.write(csv);
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(file.uri, { mimeType: 'text/csv', dialogTitle: filename });
  }
}
