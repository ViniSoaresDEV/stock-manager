import "../App.css"
import { MdOutlineCancel } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import { PiCornersOutLight } from "react-icons/pi";

function ModalEditar({fecharModal, salvar, nome, setNome, qtd, setQtd, preco, setPreco}){
    return(
        <div className="modal">
          <h2>Editar Item</h2>
          <form onSubmit={salvar} className="modal-form">
            <div className="modal-input">
              <span>Nome:</span>
              <input type="text" value={nome} onChange={(e)=> setNome(e.target.value)}/>
            </div>
            <div className="modal-input">
              <span>Quantidade:</span>
              <input type="number" value={qtd} onChange={(e)=> setQtd(e.target.value)}/>
            </div>
            <div className="modal-input">
              <span>Preço:</span>
              <input type="number" value={preco} onChange={(e)=> setPreco(e.target.value)}/>
            </div>
            <div style={{display: 'flex'}}>
              <button type="submit" className="modal-btn"><FaRegSave/> Salvar</button>
              <button type="button" className="modal-btn" onClick={fecharModal}><MdOutlineCancel/> Cancelar</button>
            </div>
          </form>
        </div>
    )
}

export default ModalEditar;