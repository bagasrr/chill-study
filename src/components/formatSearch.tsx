export function formatSearch(text: string, query: string) {
  if (!text || !query) return text;

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="bg-yellow-300 text-black rounded px-1">
        {part}
      </span>
    ) : (
      <span key={index}>{part}</span>
    )
  );
}
