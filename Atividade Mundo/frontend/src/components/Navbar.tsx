import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-slate-800 text-white p-4">
      <div className="flex gap-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/geography">Geografia</Link>
        <Link to="/external-data">Dados Externos</Link>
      </div>
    </nav>
  );
}