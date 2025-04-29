export const formatCurrency = (value: number) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
  return formatter.format(value);
};

export const formattedDate = (date: string) => {
  const formattedDate = new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return formattedDate;
};

export function formatCellValue(key: string | number | symbol, value: unknown): React.ReactNode {
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

  if (value == null) return "N/A";

  return typeof value === "object" ? JSON.stringify(value) : (value as React.ReactNode);
}

export function formatCellValueSmart(value: any): React.ReactNode {
  if (value === null || value === undefined) return "-";

  if (typeof value === "object") {
    // Kalau object, ambil title, name, atau fallback JSON string
    if ("title" in value) return value.title;
    if ("name" in value) return value.name;
    return JSON.stringify(value); // Fallback biar aman
  }

  // Kalau bukan object, tetap render biasa
  return value.toString();
}
