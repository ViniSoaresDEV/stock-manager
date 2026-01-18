import './SideMenu.css';
import { MdOutlinePointOfSale } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { MdLogout } from "react-icons/md";

function SideMenu(){
    return(
        <aside className='side-menu'>
            <nav>
                <ul>
                    <li><a href="#"><BsBoxSeam /> Gestor de Estoque</a></li>
                    <li><a href="#"><MdOutlinePointOfSale /> Orçamentos</a></li>
                    <li><a href="#"><MdLogout /> Sair</a></li>
                </ul>
            </nav>
        </aside>
    )
}

export default SideMenu;