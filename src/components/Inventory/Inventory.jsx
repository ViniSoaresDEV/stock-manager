import { FaRegTrashAlt, FaRegEdit } from 'react-icons/fa';
import './Inventory.css';

function Inventary({
  produtos,
  adicionarProduto,
  valorTotal,
  setNomeProduto,
  nomeProduto,
  setQuantidade,
  quantidade,
  setPrecoProduto,
  precoProduto,
  loginAdm,
  removerProduto,
  preparaEdicao,
}) {
  return (
    <div className="estoque-container">
      <h1 className="invetary-title">Controle de Estoque</h1>

      <form className="estoque-form" onSubmit={adicionarProduto}>
        <div className="header">
          <h3>Novo Produto</h3>
          <span>
            Valor total em estoque:{' '}
            <strong>
              {' '}
              {valorTotal.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </strong>
          </span>
        </div>
        <div className="box">
          <div className="input-box">
            <p>Nome:</p>
            <input
              type="text"
              onChange={(e) => setNomeProduto(e.target.value)}
              value={nomeProduto}
            />
          </div>
          <div className="input-box">
            <p>Quantidade:</p>
            <input
              type="number"
              onChange={(e) => setQuantidade(e.target.value)}
              value={quantidade}
            />
          </div>
          <div className="input-box">
            <p>Valor:</p>
            <input
              type="number"
              onChange={(e) => setPrecoProduto(e.target.value)}
              value={precoProduto}
            />
          </div>
        </div>
        <button type="submit" className="add-btn" disabled={loginAdm}>
          Adicionar
        </button>
      </form>

      <ul className="ul">
        {produtos.map((produto) => (
          <li key={produto.id} className="list-box">
            <div className="list-box-div">
              <span>
                <strong>Nome:</strong>
              </span>
              <span title={produto.nome}>{produto.nome}</span>
            </div>

            <div className="list-box-div">
              <span>
                <strong>Quantidade:</strong>
              </span>
              <span>{produto.quantidade}</span>
            </div>
            <div className="list-box-div">
              <span>
                <strong>Preço</strong>
              </span>
              <span>
                {Number(produto.preco).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>
            <div className="valor-total-item">
              <span>
                <strong>Valor total:</strong>
              </span>
              <span>
                {(
                  Number(produto.quantidade) * Number(produto.preco)
                ).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>
            <div className="list-box-buttons">
              <button
                disabled={loginAdm}
                className="remove-button"
                onClick={() => removerProduto(produto.id)}
              >
                <FaRegTrashAlt /> Remover
              </button>
              <button
                disabled={loginAdm}
                className="edit-button"
                onClick={() => preparaEdicao(produto)}
              >
                <FaRegEdit /> Editar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Inventary;
