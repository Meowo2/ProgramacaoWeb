interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex gap-2 mt-4">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Anterior
      </button>

      <span>
        Página {page} de {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Próxima
      </button>
    </div>
  );
}