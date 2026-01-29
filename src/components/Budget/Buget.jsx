import './Budget.css';
import { use, useState } from 'react';
import { FaRegTrashAlt, FaTrashAlt } from 'react-icons/fa';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function Budget() {
  const produtosDisponiveis = [
    { id: 1, nome: 'Cadeira New Roma Fixa C/ Cabeçote', preco: 1998 },
    { id: 2, nome: 'Cadeira Style Capone', preco: 4189 },
    {
      id: 3,
      nome: 'Armário Auxiliar de Lavatório Superior - Branco',
      preco: 796,
    },
    { id: 4, nome: 'Lavatório New Roma', preco: 3629 },
    { id: 5, nome: 'Lavatório Studio', preco: 3299 },
    { id: 6, nome: 'Bancada Profissional Dupla Face 4 Estações', preco: 9448 },
    {
      id: 7,
      nome: 'Armário Auxiliar de Lavatório Inferior - Branco',
      preco: 982,
    },
    { id: 8, nome: 'Cadeira New Roma Reclinável', preco: 2459 },
    { id: 9, nome: 'Lavatório New Roma C/ Descanso de Pernas', preco: 4069 },
  ];

  const [gerarOrcamentoBtn, setGerarOrcamentoBtn] = useState('');

  const [termoBuscado, setTermoBuscado] = useState('');
  const [itensOrcamento, setItemOrcamento] = useState([]);
  const [desconto, setDesconto] = useState(0);
  const [frete, setFrete] = useState(0);
  const [vendedor, setVendedor] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [condicaoPagamento, setCondicaoPagamento] = useState('');

  const [cliente, setCliente] = useState({
    nome: '',
    documento: '',
    email: '',
    telefone: '',
    endereco: '',
  });

  const valorTotal = Array.isArray(itensOrcamento)
    ? itensOrcamento.reduce((acc, item) => {
        return acc + item.preco * item.quantidade;
      }, 0)
    : 0;

  const calculoDesconto = (valorTotal / 100) * desconto;

  const valorTotalFinal = valorTotal - calculoDesconto + Number(frete);

  function nomeCliente(evento) {
    const nomeDigitado = evento.target.value;

    setCliente({ ...cliente, nome: nomeDigitado });
  }

  function documentoCliente(evento) {
    const documentoDigitado = evento.target.value;

    setCliente({ ...cliente, documento: documentoDigitado });
  }

  function emailCliente(evento) {
    const emailDigitado = evento.target.value;

    setCliente({ ...cliente, email: emailDigitado });
  }

  function telefoneCliente(evento) {
    const telefoneDigitado = evento.target.value;

    setCliente({ ...cliente, telefone: telefoneDigitado });
  }

  function enderecoCliente(evento) {
    const enderecoDigitado = evento.target.value;

    setCliente({ ...cliente, endereco: enderecoDigitado });
  }

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

  function gerarPDF() {
    if (!formaPagamento || formaPagamento === '') {
      alert('Por favor, selecione a forma de pagamento!');
      return;
    }

    if (!vendedor || vendedor === '') {
      alert('Por favor, selecione o vendedor!');
      return;
    }

    const doc = new jsPDF();
    const data = new Date();

    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();

    //Cabeçalho
    doc.setFontSize(18);
    doc.text('Orçamento - Bellano Móveis', 105, 20, null, null, 'center');

    //Dados cliente
    doc.setFontSize(12);
    doc.text(`Cliente: ${cliente.nome}`, 20, 40);
    doc.text(`CPF / CNPJ: ${cliente.documento}`, 20, 50);
    doc.text(`Email: ${cliente.email}`, 20, 60);
    doc.text(`Telefone: ${cliente.telefone}`, 20, 70);
    doc.text(`Endereço: ${cliente.endereco}`, 20, 80);

    //Tabela de dados
    const tabelaDados = itensOrcamento.map((item) => [
      item.nome,
      item.quantidade,
      item.preco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      item.observacao,
      (item.preco * item.quantidade).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
    ]);

    //Gerando tabela com o AutoTable
    autoTable(doc, {
      head: [['Produto', 'Qtd', 'Valor Un.', 'Obs', 'Total']],
      body: tabelaDados,
      startY: 95,
      theme: 'grid', //Layout em grade
    });

    //Pegando onde a linha parou e adicionando mais 10
    const finalY = doc.lastAutoTable.finalY;

    doc.setFontSize(12);
    doc.text(
      `SUBTOTAL: ${valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
      140,
      finalY + 10,
    );

    doc.text(
      `Desconto ${desconto}%: ${calculoDesconto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
      140,
      finalY + 20,
    );

    doc.text(
      `Frete: ${Number(frete).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
      140,
      finalY + 30,
    );

    doc.setFontSize(14);
    doc.text(
      `Valor Total: ${valorTotalFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
      140,
      finalY + 40,
    );

    doc.setFontSize(12);
    doc.text(`Vendedor: ${vendedor}`, 18, finalY + 60);
    doc.text(`Forma de pagamento: ${formaPagamento}`, 18, finalY + 70);
    doc.text(`Condição de pagamento: ${condicaoPagamento}`, 18, finalY + 80);

    //Salva o PDF
    doc.save(`orçamento_${cliente.nome}_${dia}-${mes}-${ano}.pdf`);
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
                  <span>Nome Completo: </span>{' '}
                  <input
                    type="text"
                    onChange={nomeCliente}
                    value={cliente.nome}
                    required
                  />
                </div>
                <div className="dados-cliente-input">
                  <span>CPF / CNPJ: </span>{' '}
                  <input
                    type="number"
                    onChange={documentoCliente}
                    value={cliente.documento}
                    required
                  />
                </div>
                <div className="dados-cliente-input">
                  <span>E-mail: </span>{' '}
                  <input
                    type="email"
                    onChange={emailCliente}
                    value={cliente.email}
                  />
                </div>
                <div className="dados-cliente-input">
                  <span>Telefone: </span>{' '}
                  <input
                    type="tel"
                    onChange={telefoneCliente}
                    value={cliente.telefone}
                    required
                  />
                </div>
                <div className="dados-cliente-input">
                  <span>Endereço: </span>{' '}
                  <input
                    type="text"
                    onChange={enderecoCliente}
                    value={cliente.endereco}
                    required
                  />
                </div>
                <div className="dados-cliente-input">
                  <span>Vendedor: </span>{' '}
                  <select onChange={(e) => setVendedor(e.target.value)}>
                    <option value="">Selecionar vendedor</option>
                    <option value="Raquel">Raquel</option>
                    <option value="Thays">Thays</option>
                    <option value="Aldeir">Aldeir</option>
                    <option value="Eduardo">Eduardo</option>
                  </select>
                </div>
                <div className="dados-cliente-input">
                  <span>Forma de Pagamento: </span>{' '}
                  <select onChange={(e) => setFormaPagamento(e.target.value)}>
                    <option value="">Selecionar</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Cartão de Débito">Cartão de Débito</option>
                    <option value="Pix">Pix</option>
                    <option value="Dinheiro">Dinheiro</option>
                  </select>
                </div>
                <div className="dados-cliente-input">
                  <span>Observação de pagamento:</span>
                  <textarea
                    onChange={(e) => setCondicaoPagamento(e.target.value)}
                  ></textarea>
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
                  <span>
                    Desconto {desconto + '%'}:{' '}
                    {calculoDesconto.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
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
            <button className="pdf-btn" onClick={gerarPDF}>
              Gerar PDF do Orçamento
            </button>
          </div>
        </>
      )}

      {gerarOrcamentoBtn === 'buscar-orcamento' && <></>}
    </div>
  );
}

export default Budget;
