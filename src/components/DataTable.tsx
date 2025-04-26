"use client";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, TextField, Typography, TablePagination, Skeleton } from "@mui/material";
import { useMemo, useState } from "react";
import { Order } from "@/lib/type";
import { formatCellValue } from "@/lib/utils";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator<T>(order: Order, orderBy: keyof T): (a: T, b: T) => number {
  return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

type SortableTableProps<T> = {
  data: T[];
  isLoading?: boolean;
  columns: {
    key: keyof T;
    label: string;
    sortable?: boolean;
  }[];
  renderAction?: (row: T) => React.ReactNode;
  emptyValueFallback?: string;
  tableTitle: string;
  idSection: string;
};

export function SortableTable<T extends { id: string }>({ data, columns, renderAction, tableTitle = "Table Title", idSection, isLoading = false }: SortableTableProps<T>) {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof T>(columns[0].key);
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
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key];
        return value?.toString().toLowerCase().includes(searchQuery);
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
      <div className="flex justify-between">
        <Typography variant="h4">{tableTitle}</Typography>
        <TextField label="Search..." variant="outlined" value={searchQuery} onChange={handleSearchChange} />
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="sortable table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={String(col.key)}>
                  {col.sortable ? (
                    <TableSortLabel active={orderBy === col.key} direction={orderBy === col.key ? order : "asc"} onClick={() => handleSort(col.key)}>
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
              {renderAction && <TableCell>Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              skeletonRows.map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}>
                  {columns.map((col, colIdx) => (
                    <TableCell key={colIdx}>
                      <Skeleton variant="text" width="100%" />
                    </TableCell>
                  ))}
                  {renderAction && (
                    <TableCell>
                      <Skeleton variant="text" width={60} />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>{formatCellValue(col.key, row[col.key])}</TableCell>
                  ))}
                  {renderAction && <TableCell>{renderAction(row)}</TableCell>}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (renderAction ? 1 : 0)} align="center">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {!isLoading && <TablePagination component="div" count={sortedData.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[5, 10, 25, 50]} />}
      </TableContainer>
    </div>
  );
}
