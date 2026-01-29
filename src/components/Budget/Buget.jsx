import './Budget.css';
import { useState } from 'react';
import { FaRegTrashAlt, FaTrashAlt } from 'react-icons/fa';

function Budget() {
  const produtosDisponiveis = [
    { id: 1, nome: 'Mesa de Jantar 6 Lugares', preco: 850.0 },
    { id: 2, nome: 'Cadeira Style', preco: 150.0 },
    { id: 3, nome: 'Armário Planejado', preco: 1200.0 },
    { id: 4, nome: 'Sofá Retrátil', preco: 2000.0 },
    { id: 5, nome: 'Rack para TV', preco: 450.0 },
    { id: 6, nome: 'Bancada Profissional Dupla Face 4 Estações', preco: 450.0 },
    { id: 7, nome: 'Armário Auxiliar de Lavatório Inferior', preco: 450.0 },
    { id: 8, nome: 'Cadeira New Roma', preco: 450.0 },
    { id: 9, nome: 'Lavatório New Roma', preco: 450.0 },
  ];

  const [gerarOrcamentoBtn, setGerarOrcamentoBtn] = useState('');

  const [termoBuscado, setTermoBuscado] = useState('');
  const [itensOrcamento, setItemOrcamento] = useState([]);
  const [desconto, setDesconto] = useState(0);
  const [frete, setFrete] = useState(0);

  const valorTotal = Array.isArray(itensOrcamento)
    ? itensOrcamento.reduce((acc, item) => {
        return acc + item.preco * item.quantidade;
      }, 0)
    : 0;

  const calculoDesconto = (valorTotal / 100) * desconto;

  const valorTotalFinal = valorTotal - calculoDesconto + Number(frete);

  function buscarEAdicionar() {
    if (!termoBuscado) return alert('Por favor, digite o nome do produto.');

    const termoEncontrado = produtosDisponiveis.find((produto) =>
      produto.nome
        .toLocaleLowerCase()
        .includes(termoBuscado.toLocaleLowerCase()),
    );
    console.log(termoEncontrado);

    if (termoEncontrado) {
      adicionarAoOrcamento(termoEncontrado);
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
    if (!confirm('Tem certeza que deseja remover o item?')) return;
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
                  <span>CPF / CNPJ: </span> <input type="number" />
                </div>
                <div className="dados-cliente-input">
                  <span>E-mail: </span> <input type="email" />
                </div>
                <div className="dados-cliente-input">
                  <span>Telefone: </span> <input type="tel" />
                </div>
                <div className="dados-cliente-input">
                  <span>Endereço: </span> <input type="text" />
                </div>
                <div className="dados-cliente-input">
                  <span>Vendedor: </span>{' '}
                  <select id="select-vendedor">
                    <option value="0">Selecionar vendedor</option>
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
                {itensOrcamento.length > 0 ? (
                  <div className="lista-produto">
                    <table
                      style={{ width: '100%', borderCollapse: 'collapse' }}
                    >
                      <thead>
                        <tr
                          style={{
                            borderBottom: '2px solid #eee',
                            textAlign: 'left',
                            color: '#555',
                          }}
                        >
                          <th style={{ padding: '10px' }}>Produto</th>
                          <th style={{ padding: '10px' }}>Qtd</th>
                          <th style={{ padding: '10px' }}>Valor Un</th>
                          <th style={{ padding: '10px' }}>Observação</th>
                          <th style={{ padding: '10px' }}>Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itensOrcamento.map((item) => (
                          <tr
                            key={item.id}
                            style={{ borderBottom: '1px solid #eee' }}
                          >
                            <td>{item.nome}</td>
                            <td>
                              <input
                                style={{ width: '40px' }}
                                type="number"
                                min={1}
                                value={item.quantidade}
                                onChange={(e) =>
                                  atualizarValor(
                                    item.id,
                                    'quantidade',
                                    e.target.value,
                                  )
                                }
                              />
                            </td>
                            <td style={{ paddingLeft: '5px' }}>
                              {(item.preco * item.quantidade).toLocaleString(
                                'pt-BR',
                                { style: 'currency', currency: 'BRL' },
                              )}
                            </td>
                            <td>
                              <textarea
                                onChange={(e) =>
                                  atualizarValor(
                                    item.id,
                                    'observacao',
                                    e.target.value,
                                  )
                                }
                                placeholder="Obs..."
                                value={item.observacao}
                              ></textarea>
                            </td>
                            <td>
                              <button
                                className="remove-btn"
                                onClick={() => removeItem(item.id)}
                              >
                                <FaTrashAlt /> Remover
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  'Nenhum item adicionado'
                )}
              </div>
              <div className="valor-total-box">
                <div className="valor-total-input">
                  <div>
                    <span>Desconto (%): </span>
                    <input
                      type="number"
                      onChange={(e) => setDesconto(e.target.value)}
                    />
                  </div>
                  <div>
                    <span>Valor do Frete: </span>
                    <input
                      type="number"
                      onChange={(e) => setFrete(e.target.value)}
                    />
                  </div>
                </div>
                <div className="valor-total-resultado">
                  <span>
                    Total:{' '}
                    {valorTotal.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                  <span>Desconto: {desconto + '%'}</span>
                  <span>
                    Frete:{' '}
                    {Number(frete).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                  <span>
                    Total Final:{' '}
                    {valorTotalFinal.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
            </div>
            <button className="pdf-btn">Gerar PDF do Orçamento</button>
          </div>
        </>
      )}

      {gerarOrcamentoBtn === 'buscar-orcamento' && <></>}
    </div>
  );
}

export default Budget;
