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
    try {
      const { data, error } = await supabase
        .from('orcamentos')
        .select('*, clientes(nome)')
        .eq('id', idDigitado)
        .single();

      if (!data) {
        alert('Orçamento não encontrado!');
        return;
      }
      if (error) throw error;

      console.log(data);
      setDadosBuscados([data]);
    } catch (error) {
      console.error('Erro ao buscar: ', error.message);
      alert('Erro ao buscar orçamento');
    }
  };

  const finalizaPedido = async (id) => {
    try {
      const { error } = await supabase
        .from('orcamentos')
        .update({ status: 'Finalizado' })
        .eq('id', id);

      if (error) throw error;

      setDadosBuscados(
        (
          novaLista, // apenas a seta pois fica explícito para o react que tudo depois da seta é um return;
        ) =>
          novaLista.map((item) => {
            if (item.id === id) {
              return { ...item, status: 'Finalizado' };
            }

            return item;
          }),
      );

      alert('Pedido finalizado com sucesso!');
    } catch (error) {
      console.error('Erro ao finalizar: ', error.message);
      alert('Erro ao atualizar o status.');
    }
  };

  const excluirOrcamento = async (id) => {
    try {
      if (!confirm(`Deseja excluir o orçamento n° ${id}?`)) {
        return;
      }
      const { error } = await supabase.from('orcamentos').delete().eq('id', id);

      if (error) throw error;
      setDadosBuscados([]);

      alert('Orçamento excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar: ', error.message);
      alert('Erro ao excluir orçamento.');
    }
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
                <span>{new Date(dados.data).toLocaleDateString('pt-BR')}</span>
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
                <button onClick={() => excluirOrcamento(dados.id)}>
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
