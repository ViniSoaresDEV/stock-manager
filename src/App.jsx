import { useState, useEffect } from 'react';
import './App.css';
import { FaRegTrashAlt, FaRegEdit, FaBars } from 'react-icons/fa';
import ModalEditar from './components/ModalEditar/ModalEditar';
import SideMenu from './components/Side Menu/SideMenu';
import Login from './components/Login/Login';
import Budget from './components/Budget/Buget';

function App() {
  // -------------------------------------------------
  // 1. TODOS OS HOOKS (STATES E EFFECTS) FICAM AQUI NO TOPO
  // -------------------------------------------------

  // Estado de Login (Com persistência no LocalStorage)
  const [logado, setLogado] = useState(() => {
    return localStorage.getItem('logado') === 'sim';
  });

  // Função para efetuar o login (passaremos para o componente Login)
  const handleLogin = () => {
    setLogado(true);
    localStorage.setItem('logado', 'sim');
  };

  const handleLogout = () => {
    setLogado(false);
    setMenuAberto(!menuAberto);
    localStorage.setItem('logado', 'nao');
  };

  // Estado de Produtos
  const [produtos, setProdutos] = useState([]);
  const API_URL = 'https://696fc18ba06046ce6187c5cc.mockapi.io/produtos';

  async function buscarProduto() {
    try {
      const resposta = await fetch(API_URL);
      const dados = await resposta.json();

      // Pequena proteção extra para evitar erros se a API falhar
      if (Array.isArray(dados)) {
        setProdutos(dados);
      }
    } catch (erro) {
      console.error('Erro ao buscar produtos.', erro);
    }
  }

  useEffect(() => {
    buscarProduto();

    const intervalo = setInterval(() => {
      buscarProduto();
      console.log('buscando produtos...');
    }, 10000);

    return () => clearInterval(intervalo);
  }, []);

  // Inputs
  const [nomeProduto, setNomeProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [precoProduto, setPrecoProduto] = useState('');

  // Variáveis de edição
  const [modalEdit, setModalEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editNomeProduto, setEditNomeProduto] = useState('');
  const [editQuantidade, setEditQuantidade] = useState('');
  const [editPreco, setEditPreco] = useState('');
  const [paginaAtual, setPaginaAtual] = useState('estoque');

  const [menuAberto, setMenuAberto] = useState(false); // variável de estado para mostrar/não mostrar o SideMenu

  // Cálculo derivado (não precisa de state)
  // Adicionei uma proteção (Array.isArray) para evitar erro no reduce
  const valorTotal = Array.isArray(produtos)
    ? produtos.reduce((acc, item) => {
        return acc + item.preco * item.quantidade;
      }, 0)
    : 0;

  // -------------------------------------------------
  // 2. FUNÇÕES LÓGICAS (Adicionar, Remover, Editar)
  // -------------------------------------------------

  async function adicionarProduto(evento) {
    evento.preventDefault();

    if (!nomeProduto || !quantidade || !precoProduto) {
      alert('Por favor, preencha todos os dados.');
      return;
    }

    const novoItem = {
      nome: nomeProduto,
      quantidade: Number(quantidade),
      preco: Number(precoProduto),
    };

    try {
      const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoItem),
      });

      const itemCriado = await resposta.json();

      setProdutos([...produtos, itemCriado]);

      // Limpa os inputs
      setNomeProduto('');
      setQuantidade('');
      setPrecoProduto('');
    } catch (erro) {
      alert('Erro ao adicionar produto.');
      console.error(erro);
    }
  }

  async function removerProduto(idProduto) {
    if (!confirm('Tem certeza que deseja remover?')) return;

    try {
      await fetch(`${API_URL}/${idProduto}`, {
        method: 'DELETE',
      });

      const novaLista = produtos.filter((item) => item.id !== idProduto);
      setProdutos(novaLista);
    } catch (erro) {
      alert('Erro ao remover produto.');
      console.error(erro);
    }
  }

  async function salvaEdicao(evento) {
    evento.preventDefault();

    if (!editNomeProduto || !editQuantidade || !editPreco) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const itemEditado = {
      nome: editNomeProduto,
      quantidade: Number(editQuantidade),
      preco: Number(editPreco),
    };

    try {
      await fetch(`${API_URL}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemEditado),
      });

      const novaLista = produtos.map((produto) => {
        if (produto.id === editId) {
          return { ...produto, ...itemEditado };
        }

        return produto;
      });

      setProdutos(novaLista);
      setModalEdit(false);
    } catch (erro) {
      alert('Erro ao salvar edição.');
      console.error(erro);
    }
  }

  function preparaEdicao(produto) {
    setModalEdit(true);
    setEditId(produto.id);
    setEditNomeProduto(produto.nome);
    setEditQuantidade(produto.quantidade);
    setEditPreco(produto.preco);
  }

  // -------------------------------------------------
  // 3. CONDICIONAL DE RENDERIZAÇÃO (O "Login Check")
  // -------------------------------------------------

  if (!logado) {
    return <Login onLogin={handleLogin} />;
  }

  // -------------------------------------------------
  // 4. RENDERIZAÇÃO DO DASHBOARD
  // -------------------------------------------------
  return (
    <div className="app-container">
      {/* Menu Lateral sempre visível */}

      <button
        className="hamburger-menu" // classe para estilizar o botão do hamburger menu
        onClick={() => setMenuAberto(!menuAberto)} // Cada vez clicado, o estado do menuAberto muda
      >
        <FaBars />
      </button>

      <SideMenu
        onLogout={handleLogout}
        navegar={setPaginaAtual}
        ativo={menuAberto} // Passa o estado atual do menuAberto
        fechar={() => setMenuAberto(false)} // executa a troca do menuAberto para false
      />

      {/* Condicional para mostrar o Estoque */}
      {paginaAtual === 'estoque' && (
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
            <button type="submit" className="add-btn">
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
                    className="remove-button"
                    onClick={() => removerProduto(produto.id)}
                  >
                    <FaRegTrashAlt /> Remover
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => preparaEdicao(produto)}
                  >
                    <FaRegEdit /> Editar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/*MODAL SECTION*/}
          {modalEdit && (
            <ModalEditar
              fecharModal={() => setModalEdit(!modalEdit)}
              salvar={salvaEdicao}
              nome={editNomeProduto}
              setNome={setEditNomeProduto}
              qtd={editQuantidade}
              setQtd={setEditQuantidade}
              preco={editPreco}
              setPreco={setEditPreco}
            />
          )}
        </div>
      )}
      {paginaAtual === 'orcamento' && <Budget />}
    </div>
  );
}

export default App;
