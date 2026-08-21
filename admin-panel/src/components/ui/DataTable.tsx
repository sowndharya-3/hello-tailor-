import { useMemo, useState, type ReactNode } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { SkeletonTable } from './Skeleton';
import EmptyState from './EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  width?: string;
}

export interface RowAction<T> {
  label: string;
  onClick: (row: T) => void;
  hidden?: (row: T) => boolean;
  destructive?: boolean;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  actions?: RowAction<T>[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
}

export default function DataTable<T>({ columns, rows, rowKey, actions, loading, emptyTitle = 'No records found', emptyDescription, pageSize = 10 }: Props<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [rows, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  if (loading) {
    return <div className="p-2"><SkeletonTable cols={columns.length} /></div>;
  }

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map((c) => (
                <th
                  key={c.key}
                  style={{ width: c.width }}
                  onClick={() => c.sortValue && toggleSort(c.key)}
                  className={`whitespace-nowrap px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary ${c.sortValue ? 'cursor-pointer select-none hover:text-navy' : ''}`}
                >
                  <span className="inline-flex items-center gap-1">
                    {c.header}
                    {c.sortValue && sortKey === c.key && (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
                  </span>
                </th>
              ))}
              {actions && actions.length > 0 && <th className="px-3 py-3 text-right text-xs font-semibold uppercase text-text-secondary">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => {
              const key = rowKey(row);
              return (
                <tr key={key} className="border-b border-border last:border-0 hover:bg-slate-50/70">
                  {columns.map((c) => (
                    <td key={c.key} className="px-3 py-3.5 align-middle text-text-primary">
                      {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '')}
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="px-3 py-3.5 text-right relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === key ? null : key)}
                        className="rounded-lg p-1.5 text-text-secondary hover:bg-slate-100"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenu === key && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                          <div className="absolute right-3 top-9 z-20 w-44 rounded-xl border border-border bg-white py-1.5 shadow-lg text-left">
                            {actions.filter((a) => !a.hidden?.(row)).map((a) => (
                              <button
                                key={a.label}
                                onClick={() => { a.onClick(row); setOpenMenu(null); }}
                                className={`block w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${a.destructive ? 'text-error' : 'text-text-primary'}`}
                              >
                                {a.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1 pt-1">
          <span className="text-xs text-text-secondary">
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-border p-1.5 disabled:opacity-40 hover:bg-slate-50">
              <ChevronLeft size={16} />
            </button>
            <span className="px-2 text-sm font-medium text-text-primary">{page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-border p-1.5 disabled:opacity-40 hover:bg-slate-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
