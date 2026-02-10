import './SideMenu.css';
import { MdOutlinePointOfSale } from 'react-icons/md';
import { BsBoxSeam } from 'react-icons/bs';
import { MdLogout } from 'react-icons/md';
import { FaTimes } from 'react-icons/fa';

function SideMenu({ onLogout, navegar, ativo, fechar, usuario }) {
  return (
    <aside className={`side-menu ${ativo ? 'aberto' : ''}`}>
      <button className="close-menu" onClick={fechar}>
        <FaTimes />
      </button>

      <nav>
        <span
          style={{ color: 'white', marginBottom: '20px', display: 'block' }}
        >
          Bem-vindo(a), {usuario.charAt(0).toUpperCase() + usuario.slice(1)}!
        </span>
        <h2 style={{ marginBottom: '30px', color: 'white' }}>Bellano Móveis</h2>
        <ul className="sidebar-list">
          <li>
            <a
              onClick={() => {
                (navegar('estoque'), fechar());
              }}
            >
              <BsBoxSeam /> Gestor de Estoque
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                (navegar('orcamento'), fechar());
              }}
            >
              <MdOutlinePointOfSale /> Orçamentos
            </a>
          </li>
          <li>
            <a href="#" onClick={onLogout}>
              <MdLogout /> Sair
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default SideMenu;
