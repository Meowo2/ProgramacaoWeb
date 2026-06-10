import { useEffect, useState } from "react";
import { getProfile } from "../../api/auth";

export default function DashboardPage() {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    getProfile().then(setUser);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <div className="mt-4 border p-4 rounded">
        <h2>Usuário Logado</h2>

        <pre>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
}