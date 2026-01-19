import "./SideMenu.css";
import { MdOutlinePointOfSale } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { MdLogout } from "react-icons/md";

function SideMenu({ onLogout }) {
  return (
    <aside className="side-menu">
      <nav>
        <h2 style={{ marginBottom: "30px", color: "white" }}>Bellano Móveis</h2>
        <ul className="sidebar-list">
          <li>
            <a href="#">
              <BsBoxSeam /> Gestor de Estoque
            </a>
          </li>
          <li>
            <a href="#">
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
