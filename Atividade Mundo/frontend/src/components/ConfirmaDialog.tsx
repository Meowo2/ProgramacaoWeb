interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  message,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <button
      onClick={() => {
        if (window.confirm(message)) {
          onConfirm();
        }
      }}
      className="bg-red-500 text-white px-3 py-1 rounded"
    >
      Excluir
    </button>
  );
}