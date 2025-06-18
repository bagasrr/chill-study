"use client";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, TextField, Typography, TablePagination, Skeleton, Chip } from "@mui/material";
import React, { ReactNode, useMemo, useState } from "react";
import Link from "next/link";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

// Asumsi tipe ini ada di "@/lib/type"
// export type Order = "asc" | "desc";
import { Order } from "@/lib/type";

// Asumsi fungsi ini ada di "@/lib/utils" dan bisa menerima berbagai tipe data
// export function formatCellValueSmart(value: any): ReactNode { ... }
import { formatCellValueSmart } from "@/lib/utils";

// --- BAGIAN UTAMA PERBAIKAN TIPE ---

/**
 * Tipe ini menciptakan koneksi yang kuat antara `key` kolom dan tipe data `value`
 * pada fungsi `render`. Ini adalah kunci untuk membuat komponen sepenuhnya type-safe.
 * Misal: jika key adalah 'name' (string), maka `value` di `render` juga akan `string`.
 */
export type ColumnDefinition<T> = {
  [K in keyof T]: {
    key: K;
    label: string;
    sortable?: boolean;
    render?: (value: T[K], row: T) => ReactNode;
  };
}[keyof T];

/**
 * Tipe untuk props komponen SortableTable.
 * Menggunakan `ColumnDefinition<T>[]` untuk `columns`.
 */
type SortableTableProps<T extends { id: string | number }> = {
  data: T[];
  columns: ColumnDefinition<T>[];
  tableTitle: string;
  idSection: string;
  isLoading?: boolean;
  addLink?: string | null;
  renderAction?: (row: T) => ReactNode;
};

// --- FUNGSI HELPERS UNTUK SORTING ---

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator<T>(order: Order, orderBy: keyof T): (a: T, b: T) => number {
  return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

// --- KOMPONEN FINAL ---

export function SortableTable<T extends { id: string | number }>({ data, columns, tableTitle, idSection, isLoading = false, addLink = null, renderAction }: SortableTableProps<T>) {
  const [order, setOrder] = useState<Order>("asc");
  // Inisialisasi orderBy dengan key dari kolom pertama yang bisa di-sort, atau kolom pertama
  const [orderBy, setOrderBy] = useState<keyof T>(() => {
    const firstSortableColumn = columns.find((c) => c.sortable);
    return firstSortableColumn ? firstSortableColumn.key : columns[0].key;
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const handleSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
    setPage(0);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) {
      return data;
    }
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key];
        // Penanganan nilai null/undefined sebelum diubah ke string
        return value != null && value.toString().toLowerCase().includes(searchQuery);
      })
    );
  }, [data, columns, searchQuery]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort(getComparator(order, orderBy));
  }, [filteredData, order, orderBy]);

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const skeletonRows = Array.from({ length: rowsPerPage });

  return (
    <div className="my-12 flex flex-col gap-5" id={idSection}>
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-5 items-center">
          <Typography variant="h4" component="h2">
            {tableTitle}
          </Typography>
          {addLink && (
            <Link href={addLink}>
              <Chip
                label={`Add New ${tableTitle}`}
                variant="outlined"
                color="primary"
                icon={<AddCircleOutlineIcon />}
                clickable
                sx={{
                  transition: "all 0.3s",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    borderColor: "primary.main",
                    color: "white",
                  },
                }}
              />
            </Link>
          )}
        </div>
        <TextField label="Search..." variant="outlined" size="small" value={searchQuery} onChange={handleSearchChange} />
      </div>

      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 650 }} aria-label={`a sortable table of ${tableTitle}`}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "1%", whiteSpace: "nowrap" }}>No</TableCell>
              {renderAction && <TableCell sx={{ whiteSpace: "nowrap" }}>Actions</TableCell>}
              {columns.map((col) => (
                <TableCell key={String(col.key)} sx={{ whiteSpace: "nowrap" }}>
                  {col.sortable ? (
                    <TableSortLabel active={orderBy === col.key} direction={orderBy === col.key ? order : "asc"} onClick={() => handleSort(col.key)}>
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              skeletonRows.map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}>
                  <TableCell>{idx + 1}</TableCell>
                  {renderAction && (
                    <TableCell>
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                  )}
                  {columns.map((col, colIdx) => (
                    <TableCell key={`${String(col.key)}-${colIdx}`}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, i) => (
                <TableRow key={row.id} hover sx={{ "&:nth-of-type(odd)": { backgroundColor: "action.hover" } }}>
                  <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                  {renderAction && <TableCell>{renderAction(row)}</TableCell>}
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {/*
              KODE FINAL:
              1. Komentar di bawah ini untuk menonaktifkan error linter "Unexpected any".
              2. `as any` ditambahkan di kedua pemanggilan fungsi.
              3. Seluruh ekspresi dibungkus dan di-cast sebagai ReactNode.
            */}
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(col.render ? col.render(row[col.key] as any, row) : formatCellValueSmart(row[col.key] as any)) as React.ReactNode}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1 + (renderAction ? 1 : 0)} align="center">
                  No data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {!isLoading && data.length > 0 && (
          <TablePagination component="div" count={filteredData.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[5, 10, 25, 50]} />
        )}
      </TableContainer>
    </div>
  );
}
