import './SearchBudget.css';
import { supabase } from '../../supabaseClient';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';

function SearchBudget() {
  const [idDigitado, setIdDigitado] = useState('');
  const [dadosBuscados, setDadosBuscados] = useState([]);

  const buscaOrcamento = async () => {
    const { data, error } = await supabase
      .from('orcamentos')
      .select('*, clientes(nome)')
      .eq('id', idDigitado)
      .single();

    if (error) throw error;

    console.log(data);
    setDadosBuscados([data]);
  };

  const finalizaPedido = async (id) => {
    const { data: dadosTabela, error } = await supabase
      .from('orcamentos')
      .select('*')
      .eq('id', id)
      .single();
    console.log(dadosTabela);

    if (error) throw error;

    const { data: statusFinalizado, error: erroFinalizar } = await supabase
      .from('orcamentos')
      .upsert({
        ...dadosTabela,
        status: 'Finalizado',
      })
      .select()
      .single();

    if (erroFinalizar) throw erroFinalizar;

    console.log(statusFinalizado);
  };

  return (
    <div className="orcamento-container">
      <h1>Buscar Orçamento</h1>
      <div>
        <input
          type="text"
          onChange={(e) => setIdDigitado(e.target.value)}
          placeholder="digite o n° do pedido"
        />{' '}
        <button onClick={buscaOrcamento}>Buscar</button>
      </div>
      <div>
        <ul>
          {dadosBuscados.map((dados) => (
            <li key={dados.id}>
              <div>
                <span>Data:</span>
                <span>{dados.data}</span>
              </div>
              <div>
                <span>Nome:</span>
                <span>{dados.clientes.nome}</span>
              </div>
              <div>
                <span>Total itens:</span>
                <span>{dados.itens.length}</span>
              </div>
              <div>
                <span>Valor total:</span>
                <span>
                  {dados.valor_total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
              <div>
                <span>Status:</span>
                <span>{dados.status}</span>
              </div>
              <div>
                <button onClick={() => finalizaPedido(dados.id)}>
                  <FaCheck /> Finalizar
                </button>
                <button>
                  <FaEdit /> Editar
                </button>
                <button>
                  <FaTrash />
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SearchBudget;
