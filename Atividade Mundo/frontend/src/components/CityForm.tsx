import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface Props {
  paises: any[];
  onSubmit: (data: any) => void;
  initialValues?: any;
}

export default function CityForm({
  paises,
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
        {...register("latitude")}
        type="number"
        step="any"
        placeholder="Latitude"
        className="border p-2 w-full"
      />

      <input
        {...register("longitude")}
        type="number"
        step="any"
        placeholder="Longitude"
        className="border p-2 w-full"
      />

      <select
        {...register("id_pais")}
        className="border p-2 w-full"
      >
        <option value="">Selecione um país</option>
        {paises.map((pais) => (
          <option key={pais.id} value={pais.id}>
            {pais.nome}
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