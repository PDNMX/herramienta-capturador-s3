// @ts-nocheck
"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./input";
import { ArrowUp, ArrowDown, ArrowUpDown, Search, FileX, X } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  searchPlaceholder?: string;
  /** When provided, replaces the single-column search with a global filter across multiple fields */
  globalFilterFn?: (row: TData, searchValue: string) => boolean;
  columnsShow?: object;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder,
  globalFilterFn,
  columnsShow,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  // When globalFilterFn is provided, filter client-side before passing to table
  const filteredData = React.useMemo(() => {
    if (!globalFilterFn || !globalFilter.trim()) return data;
    const q = globalFilter.trim().toLowerCase();
    return data.filter((row) => globalFilterFn(row, q));
  }, [data, globalFilter, globalFilterFn]);

  const tableData = globalFilterFn ? filteredData : data;

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnVisibility: columnsShow ?? {},
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const filteredCount = globalFilterFn
    ? filteredData.length
    : table.getFilteredRowModel().rows.length;

  const placeholder = searchPlaceholder ?? `Buscar por ${searchKey}...`;
  const searchValue = globalFilterFn
    ? globalFilter
    : (table.getColumn(searchKey)?.getFilterValue() as string) ?? "";

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (globalFilterFn) {
      setGlobalFilter(e.target.value);
    } else {
      table.getColumn(searchKey)?.setFilterValue(e.target.value);
    }
  };

  const handleClear = () => {
    if (globalFilterFn) {
      setGlobalFilter("");
    } else {
      table.getColumn(searchKey)?.setFilterValue("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder={placeholder}
          value={searchValue}
          onChange={handleSearch}
          className="pl-9 pr-9 w-full"
        />
        {searchValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Table container */}
      <div className="rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="h-[calc(80vh-200px)] overflow-y-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="bg-muted/60 border-b border-border"
                >
                  {headerGroup.headers.map((header) => {
                    const sorted = header.column.getIsSorted();
                    return (
                      <TableHead
                        key={header.id}
                        className={`
                          text-xs font-semibold uppercase tracking-wider text-muted-foreground
                          py-3 px-4 whitespace-nowrap
                          ${header.column.getCanSort() ? "cursor-pointer select-none hover:text-foreground transition-colors" : ""}
                        `}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <span className="shrink-0">
                              {sorted === "asc" ? (
                                <ArrowUp className="h-3.5 w-3.5 text-primary" />
                              ) : sorted === "desc" ? (
                                <ArrowDown className="h-3.5 w-3.5 text-primary" />
                              ) : (
                                <ArrowUpDown className="h-3.5 w-3.5 opacity-30" />
                              )}
                            </span>
                          )}
                        </div>
                      </TableHead>
                    );
                  })}
                </tr>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={`
                      border-b border-border/60 transition-colors
                      hover:bg-primary/5
                      ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}
                    `}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-3 px-4 text-sm"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-48 text-center"
                  >
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <FileX className="h-10 w-10 opacity-30" />
                      <p className="text-sm font-medium">Sin resultados</p>
                      <p className="text-xs opacity-70">
                        No se encontraron registros con los filtros aplicados.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer count */}
      <p className="text-xs text-muted-foreground text-right">
        {filteredCount === data.length
          ? `${data.length} registro${data.length !== 1 ? "s" : ""} en total`
          : `${filteredCount} de ${data.length} registro${data.length !== 1 ? "s" : ""}`}
      </p>
    </div>
  );
}
