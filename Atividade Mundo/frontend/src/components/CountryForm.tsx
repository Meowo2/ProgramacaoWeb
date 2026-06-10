import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface Props {
  continentes: any[];
  onSubmit: (data: any) => void;
  initialValues?: any;
}

export default function CountryForm({
  continentes,
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
      <input
        {...register("nome")}
        placeholder="Nome"
        className="border p-2 w-full"
      />

      <input
        {...register("populacao")}
        type="number"
        placeholder="População"
        className="border p-2 w-full"
      />

      <input
        {...register("idioma_oficial")}
        placeholder="Idioma oficial"
        className="border p-2 w-full"
      />

      <input
        {...register("moeda")}
        placeholder="Moeda"
        className="border p-2 w-full"
      />

      <select
        {...register("id_continente")}
        className="border p-2 w-full"
      >
        <option value="">Selecione um continente</option>
        {continentes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nome}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2"
      >
        Salvar
      </button>
    </form>
  );
}