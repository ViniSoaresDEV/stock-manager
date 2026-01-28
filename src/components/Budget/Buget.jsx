import './Budget.css';
import { useState } from 'react';

function Budget() {
  const produtosDisponiveis = [
    { id: 1, nome: 'Mesa de Jantar', preco: 850.0 },
    { id: 2, nome: 'Cadeira Style', preco: 150.0 },
    { id: 3, nome: 'Armário Planejado', preco: 1200.0 },
    { id: 4, nome: 'Sofá 3 Lugares', preco: 2000.0 },
  ];

  const [gerarOrcamentoBtn, setGerarOrcamentoBtn] = useState('');

  const [termoBuscado, setTermoBuscado] = useState('');
  const [itensOrcamento, setItemOrcamento] = useState('');

  function buscarEAdicionar() {
    if (!termoBuscado) return alert('Por favor, digite o nome do produto.');

    const termoEncontrado = produtosDisponiveis.filter((produto) =>
      produto.nome
        .toLocaleLowerCase()
        .includes(termoBuscado.toLocaleLowerCase()),
    );

    if (termoEncontrado) {
      adicionarAoOrcamento(termoBuscado);
    } else {
      alert('Item não encontrado!');
    }
  }

  function adicionarAoOrcamento(produto) {
    const jaExiste = itensOrcamento.find((item) => item.id === produto.id);

    if (jaExiste) {
      alert('Produto já existe no orçamento.');
      return;
    }

    const novoItemOrcamento = {
      ...produto,
      quantidade: 1,
      observacao: '',
    };

    setItemOrcamento([...itensOrcamento, novoItemOrcamento]);
    setTermoBuscado('');
  }

  function atualizarValor(id, campo, novoValor) {
    setItemOrcamento(
      itensOrcamento.map((item) =>
        item.id === id ? { ...item, [campo]: novoValor } : item,
      ),
    );
  }

  function removeItem(id) {
    setItemOrcamento(itensOrcamento.filter((item) => item.id !== id));
  }

  return (
    <div className="orcamento-container">
      <div className="box-btn-orcamento">
        <button onClick={() => setGerarOrcamentoBtn('gerar-orcamento')}>
          Gerar Orçamento
        </button>
        <button onClick={() => setGerarOrcamentoBtn('buscar-orcamento')}>
          Buscar Orçamento
        </button>
      </div>

      {gerarOrcamentoBtn === 'gerar-orcamento' && (
        <>
          <div className="gerar-orcamento-container">
            <h1>Gerar Orçamento</h1>
            <div className="dados-clientes">
              <h3>Dados do Cliente</h3>
              <div className="dados-cliente-box">
                <div className="dados-cliente-input">
                  <span>Nome Completo: </span> <input type="text" />
                </div>
                <div className="dados-cliente-input">
                  <span>CPF / CNPJ: </span> <input type="text" />
                </div>
                <div className="dados-cliente-input">
                  <span>E-mail: </span> <input type="text" />
                </div>
                <div className="dados-cliente-input">
                  <span>Telefone: </span> <input type="text" />
                </div>
                <div className="dados-cliente-input">
                  <span>Endereço: </span> <input type="text" />
                </div>
                <div className="dados-cliente-input">
                  <span>Vendedor: </span>{' '}
                  <select id="select-vendedor">
                    <option value="1">Raquel</option>
                    <option value="2">Thays</option>
                    <option value="3">Aldeir</option>
                    <option value="4">Eduardo</option>
                  </select>
                </div>
                <div className="dados-cliente-input">
                  <span>Forma de Pagamento: </span>{' '}
                  <select id="forma-pagamento">
                    <option value="1">Cartão de Crédito</option>
                    <option value="1">Cartão de Débito</option>
                    <option value="1">Pix</option>
                    <option value="1">Dinheiro</option>
                  </select>
                </div>
                <button>Gerar PDF do Orçamento</button>
              </div>
            </div>
            <div className="buscar-produto-box">
              <div className="buscar-produto-input">
                <span>Buscar Produto: </span>
                <input
                  type="text"
                  placeholder="Digite o nome do produto..."
                  onChange={(e) => setTermoBuscado(e.target.value)}
                  value={termoBuscado}
                />
                <button onClick={buscarEAdicionar}>Adicionar</button>
              </div>
              <div className="buscar-produto-lista">
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Valor Unitário</th>
                  <th>Observação</th>
                </tr>
                <tr id="tr-itens">
                  <td></td>
                </tr>
              </div>
            </div>
          </div>
        </>
      )}

      {gerarOrcamentoBtn === 'buscar-orcamento' && <></>}
    </div>
  );
}

export default Budget;
