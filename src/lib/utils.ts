export const formatCurrency = (value: number) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });
  return formatter.format(value);
};

export function formatCellValue(key: string | number | symbol, value: never): React.ReactNode {
  if ((key === "createdAt" || key === "updatedAt") && value) {
    const date = new Date(value as string);
    const formattedDate = date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${formattedDate}, ${formattedTime}`;
  }

  return value != null ? value : "N/A";
}
