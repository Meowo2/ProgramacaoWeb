import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await registerUser(data);

      alert("Usuário criado com sucesso");

      navigate("/");
    } catch {
      alert("Erro ao cadastrar");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl mb-5">
        Cadastro
      </h1>

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
          {...register("email")}
          placeholder="Email"
          className="border p-2 w-full"
        />

        <input
          {...register("senha")}
          type="password"
          placeholder="Senha"
          className="border p-2 w-full"
        />

        <button
          className="bg-green-600 text-white px-4 py-2"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}