import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await loginUser(data);
      navigate("/dashboard");
    } catch {
      alert("Credenciais inválidas");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl mb-5">
        Login
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3"
      >
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
          className="bg-blue-600 text-white px-4 py-2"
        >
          Entrar
        </button>
      </form>

      <Link
        to="/register"
        className="text-blue-500 mt-4 block"
      >
        Criar conta
      </Link>
    </div>
  );
}