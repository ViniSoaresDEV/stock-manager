import { useState, useEffect } from 'react';
import './App.css';
import { FaRegTrashAlt, FaRegEdit, FaBars } from 'react-icons/fa';
import ModalEditar from './components/ModalEditar/ModalEditar';
import SideMenu from './components/Side Menu/SideMenu';
import Login from './components/Login/Login';
import Budget from './components/Budget/Buget';
import Inventary from './components/Inventory/Inventory';
import { supabase } from './supabaseClient';

function App() {
  // -------------------------------------------------
  // 1. TODOS OS HOOKS (STATES E EFFECTS) FICAM AQUI NO TOPO
  // -------------------------------------------------

  // Estado de Login (Com persistência no LocalStorage)
  const [loginAdm, setLoginAdm] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState('');

  const privacyBudget = (user) => {
    setUsuarioLogado(user);
  };

  // Verificando acesso ADM para liberar edição do conteúdo do estoque
  const isAdm = (user) => {
    if (user !== 'adm' || user !== 'teste@portifolio.com') {
      setLoginAdm(true);
    } else {
      setLoginAdm(false);
    }
  };

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

  async function buscarProduto() {
    try {
      const { data, error } = await supabase
        .from('estoque')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.log('Erro ao buscar:', error.message);
        return;
      }

      // Pequena proteção extra para evitar erros se a API falhar
      if (data) {
        setProdutos(data);
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
    }, 30000);

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
      const { data, error } = await supabase
        .from('estoque')
        .insert([novoItem])
        .select();

      if (error) throw error;

      setProdutos([data[0], ...produtos]);

      // Limpa os inputs
      setNomeProduto('');
      setQuantidade('');
      setPrecoProduto('');
    } catch (erro) {
      console.log('Erro ao inserir: ', erro.message);
    }
  }

  async function removerProduto(idProduto) {
    if (!confirm('Tem certeza que deseja remover?')) return;

    try {
      const { error } = await supabase
        .from('estoque')
        .delete()
        .eq('id', idProduto);

      if (error) throw error;

      const novaLista = produtos.filter((item) => item.id !== idProduto);
      setProdutos(novaLista);
    } catch (erro) {
      console.log('Erro ao remover produto:', erro);
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
      const { error } = await supabase
        .from('estoque')
        .update(itemEditado)
        .eq('id', editId);

      if (error) throw error;

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
    return (
      <Login onLogin={handleLogin} adm={isAdm} privacidade={privacyBudget} />
    );
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
        usuario={usuarioLogado}
        ativo={menuAberto} // Passa o estado atual do menuAberto
        fechar={() => setMenuAberto(false)} // executa a troca do menuAberto para false
      />

      {/* Condicional para mostrar o Estoque */}
      {paginaAtual === 'estoque' && (
        <>
          <Inventary
            produtos={produtos}
            adicionarProduto={adicionarProduto}
            valorTotal={valorTotal}
            setNomeProduto={setNomeProduto}
            nomeProduto={nomeProduto}
            setQuantidade={setQuantidade}
            quantidade={quantidade}
            setPrecoProduto={setPrecoProduto}
            precoProduto={precoProduto}
            loginAdm={loginAdm}
            removerProduto={removerProduto}
            preparaEdicao={preparaEdicao}
          />
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
        </>
      )}
      {paginaAtual === 'orcamento' && <Budget usuario={usuarioLogado} />}
    </div>
  );
}

export default App;
