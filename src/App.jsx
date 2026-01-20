import { useState, useEffect } from "react";
import "./App.css";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import ModalEditar from "./components/ModalEditar/ModalEditar";
import SideMenu from "./components/Side Menu/SideMenu";
import Login from "./components/Login/Login";
import { WiAlien } from "react-icons/wi";

function App() {
  // -------------------------------------------------
  // 1. TODOS OS HOOKS (STATES E EFFECTS) FICAM AQUI NO TOPO
  // -------------------------------------------------

  // Estado de Login (Com persistência no LocalStorage)
  const [logado, setLogado] = useState(() => {
    return localStorage.getItem("logado") === "sim";
  });

  // Função para efetuar o login (passaremos para o componente Login)
  const handleLogin = () => {
    setLogado(true);
    localStorage.setItem("logado", "sim");
  };

  const handleLogout = () => {
    setLogado(false);
    localStorage.setItem("logado", "nao");
  };

  // Estado de Produtos
  const [produtos, setProdutos] = useState([]);
  const API_URL = "https://696fc18ba06046ce6187c5cc.mockapi.io/produtos";

  async function buscarProduto() {
    try {
      const resposta = await fetch(API_URL);
      const dados = await resposta.json();

      setProdutos(dados);
    } catch (erro) {
      console.error("Erro ao buscar produtos.", erro);
    }
  }

  useEffect(() => {
    buscarProduto();
  }, []);

  // Inputs
  const [nomeProduto, setNomeProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [precoProduto, setPrecoProduto] = useState("");

  // Variáveis de edição
  const [modalEdit, setModalEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editNomeProduto, setEditNomeProduto] = useState("");
  const [editQuantidade, setEditQuantidade] = useState("");
  const [editPreco, setEditPreco] = useState("");
  const [paginaAtual, setPaginaAtual] = useState("estoque");

  // Cálculo derivado (não precisa de state)
  const valorTotal = produtos.reduce((acc, item) => {
    return acc + item.preco * item.quantidade;
  }, 0);

  // -------------------------------------------------
  // 2. FUNÇÕES LÓGICAS (Adicionar, Remover, Editar)
  // -------------------------------------------------

  async function adicionarProduto(evento) {
    evento.preventDefault();

    if (!nomeProduto || !quantidade || !precoProduto) {
      alert("Por favor, preencha todos os dados.");
      return;
    }

    const novoItem = {
      nome: nomeProduto,
      quantidade: Number(quantidade),
      preco: Number(precoProduto),
    };

    try {
      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoItem),
      });

      const itemCriado = await resposta.json();

      setProdutos([...produtos, itemCriado]);

      // Limpa os inputs
      setNomeProduto("");
      setQuantidade("");
      setPrecoProduto("");
    } catch (erro) {
      alert("Erro ao adicionar produto.");
      console.error(erro);
    }
  }

  async function removerProduto(idProduto) {
    if (!confirm("Tem certeza que deseja remover?")) return;

    try {
      await fetch(`${API_URL}/${idProduto}`, {
        method: "DELETE",
      });

      const novaLista = produtos.filter((item) => item.id !== idProduto);
      setProdutos(novaLista);
    } catch (erro) {
      alert("Erro ao remover produto.");
      console.error(erro);
    }
  }

  async function salvaEdicao(evento) {
    evento.preventDefault();

    if (!editNomeProduto || !editQuantidade || !editPreco) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const itemEditado = {
      nome: editNomeProduto,
      quantidade: Number(editQuantidade),
      preco: Number(editPreco),
    };

    try {
      await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
      alert("Erro ao salvar edição.");
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

  // AGORA SIM: Podemos verificar se está logado.
  // Como todos os hooks já foram lidos lá em cima, o React não vai reclamar.
  if (!logado) {
    // Precisamos passar a função handleLogin para o componente filho saber o que fazer
    return <Login onLogin={handleLogin} />;
  }

  // -------------------------------------------------
  // 4. RENDERIZAÇÃO DO DASHBOARD (O "Else" implícito)
  // -------------------------------------------------
  return (
    <div
      style={{
        backgroundColor: "rgba(126, 126, 126, 0.1)",
        height: "100vh",
        display: "flex",
      }}
    >
      <SideMenu onLogout={handleLogout} navegar={setPaginaAtual} />
      {paginaAtual === "estoque" && (
        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "1200px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          <h1 className="invetary-title">Controle de Estoque</h1>

          <form
            onSubmit={adicionarProduto}
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "20px",
              gap: "10px",
              backgroundColor: "white",
              width: "100%",
              padding: "20px",
              boxShadow: "3px 6px 8px rgba(0,0,0,0.2)",
              borderRadius: "15px",
            }}
          >
            <div className="header">
              <h3>Novo Produto</h3>
              <span>
                Valor total em estoque:{" "}
                <strong>
                  {" "}
                  {valorTotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
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
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "30px",
              width: "100%",
              maxHeight: "400px",
              overflowY: "scroll",
              paddingRight: "20px",
            }}
          >
            {produtos.map((produto) => (
              <li key={produto.id} className="list-box">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    width: "150px",
                    height: "70px",
                    fontSize: "20px",
                  }}
                >
                  <span>Nome</span>
                  <span>{produto.nome}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    width: "150px",
                    height: "70px",
                    fontSize: "20px",
                  }}
                >
                  <span>Quantidade</span>
                  <span>{produto.quantidade}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    width: "150px",
                    height: "70px",
                    fontSize: "20px",
                  }}
                >
                  <span>Preço</span>
                  <span>
                    {produto.preco.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    width: "150px",
                    height: "70px",
                    fontSize: "20px",
                  }}
                >
                  <span>Valor total</span>
                  <span>
                    {(
                      Number(produto.quantidade) * Number(produto.preco)
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <button
                  style={{
                    marginLeft: "10px",
                    textAlign: "center",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "red",
                    fontSize: "18px",
                    width: "100px",
                  }}
                  onClick={() => removerProduto(produto.id)}
                >
                  <FaRegTrashAlt /> Remover
                </button>
                <button
                  style={{
                    marginLeft: "10px",
                    textAlign: "center",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#507CFF",
                    fontSize: "18px",
                    width: "100px",
                  }}
                  onClick={() => preparaEdicao(produto)}
                >
                  <FaRegEdit /> Editar
                </button>
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
    </div>
  );
}

export default App;
