import { useState, useEffect } from "react"
import './App.css'

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


  useEffect(()=>{
    localStorage.setItem('estoque_salao', JSON.stringify(produtos));
  }, [produtos])


  // Função para validar, adicionar os novos itens a lista e resetar seus valores após enviar
  function adicionarProduto(evento){
    evento.preventDefault();

    if(!nomeProduto || !precoProduto) return;

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

  return (
    <div style={{padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'rgba(126, 126, 126, 0.1)'}}>
      <h1>Gestor de Estoque</h1>
      
      <form onSubmit={adicionarProduto} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', gap: '10px'}}>
        <h3>Novo Produto</h3>
        <p>Nome do produto:</p>
        <input type="text" onChange={(e)=> setNomeProduto(e.target.value)} value={nomeProduto}/>
        <p>Quantidade do produto:</p>
        <input type="number" onChange={(e)=> setQuantidade(e.target.value)} value={quantidade}/>
        <p>Valor do produto:</p>
        <input type="number" onChange={(e)=> setPrecoProduto(e.target.value)} value={precoProduto}/>
        <button type="submit">Adicionar</button>
      </form>
      <ul style={{display: "flex", flexDirection: 'column', gap: '10px', marginTop: '30px'}}>
        {produtos.map((produto) => (
          <li key={produto.id}>
            <strong>{produto.nome}</strong>
            <br />
            Qtd: {produto.quantidade} | R$ {produto.preco.toFixed(2)} <button style={{marginLeft: '10px', textAlign: 'center', backgroundColor: 'rgba(255,0,0,0.6)'}} onClick={()=> removerProduto(produto.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
