"use client";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, TextField, Typography, TablePagination, Skeleton, Chip } from "@mui/material";
import { useMemo, useState } from "react";
import { Order } from "@/lib/type";
import { formatCellValueSmart } from "@/lib/utils";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Link from "next/link";

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
  addLink: string | null;
  isLoading?: boolean;
  columns: {
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
  }[];
  renderAction?: (row: T) => React.ReactNode;
  emptyValueFallback?: string;
  tableTitle: string;
  idSection: string;
};

export function SortableTable<T extends { id: string }>({ data, columns, renderAction, tableTitle = "Table Title", idSection, isLoading = false, addLink = null }: SortableTableProps<T>) {
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
        <div className="flex gap-5 items-center">
          <Typography variant="h4">{tableTitle}</Typography>
          {addLink && (
            <Link href={addLink} className={`text-sm hover:underline `}>
              <Chip
                label={`Add New ${tableTitle}`}
                variant="outlined"
                color="primary"
                icon={<AddCircleOutlineIcon />}
                sx={{
                  transition: "all 0.3s",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    borderColor: "primary.main",
                    color: "black",
                  },
                }}
              />
            </Link>
          )}
        </div>

        <TextField label="Search by Title..." variant="outlined" value={searchQuery} onChange={handleSearchChange} />
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="sortable table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
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
              {renderAction && <TableCell sx={{ whiteSpace: "nowrap" }}>Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Skeleton */}
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
            ) : // Skeleton end
            paginatedData.length > 0 ? (
              paginatedData.map((row, i) => (
                <TableRow key={row.id}>
                  <TableCell>{page != 0 ? page * rowsPerPage + i + 1 : i + 1}</TableCell>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>{col.render ? col.render(row[col.key], row) : formatCellValueSmart(row[col.key])}</TableCell>
                  ))}

                  {renderAction && <TableCell sx={{ whiteSpace: "nowrap", textAlign: "center" }}>{renderAction(row)}</TableCell>}
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
