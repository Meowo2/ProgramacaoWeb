import { useEffect } from "react";
import { useForm } from "react-hook-form";

const CONTINENTES_VALIDOS = [
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
];

interface Props {
  onSubmit: (data: any) => void;
  initialValues?: any;
}

export default function ContinentForm({
  onSubmit,
  initialValues,
}: Props) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues || {});
  }, [initialValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3"
    >
      <select
        {...register("nome")}
        className="border p-2 w-full"
      >
        <option value="">Selecione um continente</option>
        {CONTINENTES_VALIDOS.map((continente) => (
          <option key={continente} value={continente}>
            {continente}
          </option>
        ))}
      </select>

      <textarea
        {...register("descricao")}
        placeholder="Descrição"
        className="border p-2 w-full h-24"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2"
      >
        Salvar
      </button>
    </form>
  );
}