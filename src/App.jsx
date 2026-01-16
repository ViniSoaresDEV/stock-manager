import { useState, useEffect } from "react"
import './App.css'
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import ModalEditar from "./components/ModalEditar";


function App() {

  // Criando o array de objetos Produtos.
  const [produtos, setProdutos] = useState(()=> {
    const dadosSalvos = localStorage.getItem('estoque_salao');
    if(dadosSalvos){
      return JSON.parse(dadosSalvos);
    }

    return [
      { id: 1, nome: 'Sofá de Espera', quantidade: 2, preco: 1200.00},
      { id: 2, nome: 'Cadeira de Corte', quantidade: 5, preco: 850.00 }
    ]
  })

  // Criando as variáveis para receber os novos itens vindos dos inputs
  const [nomeProduto, setNomeProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [precoProduto, setPrecoProduto] = useState('');

  // Variáveis de edição de texto
  const [modalEdit, setModalEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editNomeProduto, setEditNomeProduto] = useState('');
  const [editQuantidade, setEditQuantidade] = useState('');
  const [editPreco, setEditPreco] = useState('');


  useEffect(()=>{
    localStorage.setItem('estoque_salao', JSON.stringify(produtos));
  }, [produtos])


  // Função para validar, adicionar os novos itens a lista e resetar seus valores após enviar
  function adicionarProduto(evento){
    evento.preventDefault();

    if(!nomeProduto || !precoProduto || !quantidade){
      alert("Por favor, preencha os campos corretamente.");
      return;
    }

    const novoItem = {
      id: Math.random(),
      nome: nomeProduto,
      quantidade: Number(quantidade),
      preco: Number(precoProduto)
    }

    setProdutos([...produtos, novoItem]);

    setNomeProduto('');
    setQuantidade('');
    setPrecoProduto('');
  };

  function removerProduto(idProduto){
    const novaLista = produtos.filter(item => item.id != idProduto);

    setProdutos(novaLista)
  }

  function preparaEdicao(produto){
    setModalEdit(true);
    setEditId(produto.id);
    setEditNomeProduto(produto.nome);
    setEditQuantidade(produto.quantidade)
    setEditPreco(produto.preco)
  }

  function salvaEdicao(evento){

    evento.preventDefault();

    const novaLista = produtos.map((produto)=> {
      if(produto.id === editId){
        return{
          ...produto,
          nome: editNomeProduto,
          quantidade: Number(editQuantidade),
          preco: Number(editPreco)
        }
      }

      return produto;
    })

    if(!editNomeProduto || !editQuantidade || !editPreco){
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setProdutos(novaLista);
    setModalEdit(!modalEdit);

  }

  return (
    <div style={{ backgroundColor: 'rgba(126, 126, 126, 0.1)', height: '100vh'}}>
      <div style={{padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '1200px', margin: '0 auto', position: 'relative'}}>
        <h1>Controle de Estoque</h1>
      
        <form onSubmit={adicionarProduto} style={{display: 'flex', flexDirection: 'column', marginTop: '20px', gap: '10px', backgroundColor: 'white', width: '100%', padding: '20px', boxShadow: '3px 6px 8px rgba(0,0,0,0.2)', borderRadius: '15px'}}>
          <h3>Novo Produto</h3>
          <div className="box">
            <div className="input-box">
              <p>Nome:</p>
              <input type="text" onChange={(e)=> setNomeProduto(e.target.value)} value={nomeProduto}/>
            </div>
            <div className="input-box">
              <p>Quantidade:</p>
              <input type="number" onChange={(e)=> setQuantidade(e.target.value)} value={quantidade}/>
            </div>
            <div className="input-box">
              <p>Valor:</p>
              <input type="number" onChange={(e)=> setPrecoProduto(e.target.value)} value={precoProduto}/>
            </div>
          </div>
          <button type="submit" className="add-btn">Adicionar</button>
        </form>
        <ul style={{display: "flex", flexDirection: 'column', gap: '10px', marginTop: '30px', width: '100%', maxHeight: '400px', overflowY: 'scroll'}}>
          {produtos.map((produto) => (
            <li key={produto.id} className="list-box">
              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', width: '250px', height: '70px', fontSize: '20px'}}>
                <span>Nome</span>
                <span>{produto.nome}</span>
              </div>
      
              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', width: '270px', height: '70px', fontSize: '20px'}}>
                <span>Quantidade</span>
                <span>{produto.quantidade}</span>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', width: '250px', height: '70px', fontSize: '20px'}}>
                <span>Preço</span>
                <span>R$ {produto.preco.toFixed(2)}</span>
              </div>
              <button style={{marginLeft: '10px', textAlign: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'red', fontSize: '18px', width: '100px'}} onClick={()=> removerProduto(produto.id)}><FaRegTrashAlt/> Remover</button>
              <button style={{marginLeft: '10px', textAlign: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#507CFF', fontSize: '18px', width: '100px'}} onClick={()=> preparaEdicao(produto)}><FaRegEdit/> Editar</button>
            </li>
          ))}
        </ul>
        
        {/*MODAL SECTION*/}
        {modalEdit &&
        <ModalEditar fecharModal={()=> setModalEdit(!modalEdit)} salvar={salvaEdicao} nome={editNomeProduto} setNome={setEditNomeProduto} qtd={editQuantidade} setQtd={setEditQuantidade} preco={editPreco} setPreco={setEditPreco}/>
        }
      </div>
    </div>
  )
}

export default App
