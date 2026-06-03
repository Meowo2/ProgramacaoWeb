import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const location = useLocation();

  function isActive(path: string) {
    return location.pathname.startsWith(path) ? 'active' : '';
  }

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/continentes" className="navbar-brand">
          🌍 Mundo
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/continentes" className={isActive('/continentes')}>
              Continentes
            </Link>
          </li>
          <li>
            <Link to="/paises" className={isActive('/paises')}>
              Países
            </Link>
          </li>
          <li>
            <Link to="/cidades" className={isActive('/cidades')}>
              Cidades
            </Link>
          </li>
        </ul>
        <div className="navbar-user">
          <span>{usuario?.nome}</span>
          <button className="btn-logout" onClick={logout}>
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}
