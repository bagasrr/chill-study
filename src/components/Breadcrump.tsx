// components/Breadcrumb.tsx
import Link from "next/link";

const Breadcrumb = ({ items }: { items: { label: string; href?: string }[] }) => {
  return (
    <nav className="text-sm text-gray-600 mb-4 bg-green-500">
      {items.map((item, index) => (
        <span key={index}>
          {item.href ? (
            <Link href={item.href} className="hover:underline text-blue-600">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
          {index < items.length - 1 && " / "}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
