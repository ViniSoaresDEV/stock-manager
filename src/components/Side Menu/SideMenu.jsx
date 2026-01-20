import "./SideMenu.css";
import { MdOutlinePointOfSale } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { MdLogout } from "react-icons/md";

function SideMenu({ onLogout, navegar }) {
  return (
    <aside className="side-menu">
      <nav>
        <h2 style={{ marginBottom: "30px", color: "white" }}>Bellano Móveis</h2>
        <ul className="sidebar-list">
          <li>
            <a onClick={() => navegar("estoque")}>
              <BsBoxSeam /> Gestor de Estoque
            </a>
          </li>
          <li>
            <a onClick={() => navegar("orcamento")}>
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
