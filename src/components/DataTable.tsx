"use client";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from "@mui/material";
import { useState } from "react";
import { Order, User } from "@/lib/type";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator<Key extends keyof any>(order: Order, orderBy: Key): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

type SortableTableProps<T> = {
  data: T[];
  columns: {
    key: keyof T;
    label: string;
    sortable?: boolean;
  }[];
  renderAction?: (row: T) => React.ReactNode;
  emptyValueFallback?: string;
};

export function SortableTable<T extends { id: string }>({ data, columns, renderAction }: SortableTableProps<T>) {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof T>(columns[0].key);

  const handleSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = [...data].sort(getComparator(order, orderBy));

  return (
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
          {sortedData.map((row) => (
            <TableRow key={row.id}>
              {columns.map((col) => (
                <TableCell key={String(col.key)}>{(row[col.key] ?? "N/A") as React.ReactNode}</TableCell>
              ))}
              {renderAction && <TableCell>{renderAction(row)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
