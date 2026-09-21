import { Download } from 'lucide-react';
import Button from './Button';

type ExportColumn<T> = { label: string; value: (row: T) => string | number };

function escapeCell(value: string | number) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default function ExportButton<T>({ rows, columns, filename }: { rows: T[]; columns: ExportColumn<T>[]; filename: string }) {
  const exportExcel = () => {
    const head = columns.map((column) => `<th>${escapeCell(column.label)}</th>`).join('');
    const body = rows.map((row) => `<tr>${columns.map((column) => `<td>${escapeCell(column.value(row))}</td>`).join('')}</tr>`).join('');
    const workbook = `<!doctype html><html><head><meta charset="UTF-8"></head><body><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></body></html>`;
    const url = URL.createObjectURL(new Blob([workbook], { type: 'application/vnd.ms-excel;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return <Button variant="secondary" icon={<Download size={16} />} onClick={exportExcel} disabled={!rows.length}>Export Excel ({rows.length})</Button>;
}
