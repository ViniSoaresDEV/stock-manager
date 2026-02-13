import "./Budget.css";
import { useState, useRef } from "react";
import { FaRegTrashAlt, FaTrashAlt } from "react-icons/fa";
import { supabase } from "../../supabaseClient";
import logo from "../../assets/img/bellano-logo.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import SearchBudget from "../SearchBudget/SearchBudget";
import { PiDotDuotone } from "react-icons/pi";
import { LuAlignEndVertical } from "react-icons/lu";

function Budget({ usuario }) {
  const [gerarOrcamentoBtn, setGerarOrcamentoBtn] = useState("");

  const [termoBuscado, setTermoBuscado] = useState("");
  const [itensOrcamento, setItemOrcamento] = useState([]);
  const [desconto, setDesconto] = useState(0);
  const [frete, setFrete] = useState(0);
  const [vendedor, setVendedor] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [condicaoPagamento, setCondicaoPagamento] = useState("");
  const [prazoEntrega, setprazoEntrega] = useState("");
  const [idEdicao, setIdEdicao] = useState(null);

  const [cliente, setCliente] = useState({
    nome: "",
    documento: "",
    email: "",
    telefone: "",
    endereco: "",
    bairro: "",
    cep: "",
    uf: "",
  });

  const preencherFormularioEdicao = (dadosDoBanco) => {
    const enderecoCliente = dadosDoBanco.clientes?.endereco;

    setVendedor(dadosDoBanco.vendedor);
    setItemOrcamento(dadosDoBanco.itens);
    setFormaPagamento(dadosDoBanco.forma_pagamento);
    setprazoEntrega(dadosDoBanco.prazo_entrega);
    setCondicaoPagamento(dadosDoBanco.obs_pagamento);
    setFrete(dadosDoBanco.frete);
    setDesconto(dadosDoBanco.porcentagem_desconto);
    console.log(dadosDoBanco);

    setCliente({
      nome: dadosDoBanco.clientes?.nome || "",
      documento: dadosDoBanco.clientes?.documento || "",
      email: dadosDoBanco.clientes?.email || "",
      telefone: dadosDoBanco.clientes?.telefone || "",
      endereco: enderecoCliente.rua || "",
      bairro: enderecoCliente.bairro || "",
      cep: enderecoCliente.cep || "",
      uf: enderecoCliente.uf || "",
    });

    setIdEdicao(dadosDoBanco.id);

    setGerarOrcamentoBtn("gerar-orcamento");
  };

  const buscarDocumento = async () => {
    try {
      const { data: documentoEncontrado, error } = await supabase
        .from("clientes")
        .select("*")
        .eq("documento", cliente.documento)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          alert("Cliente não encontrado.");
          return;
        }
      }

      console.log(documentoEncontrado);

      if (documentoEncontrado) {
        setCliente({
          nome: documentoEncontrado.nome,
          documento: documentoEncontrado.documento,
          email: documentoEncontrado.email,
          telefone: documentoEncontrado.telefone,
          endereco: documentoEncontrado.endereco.rua,
          bairro: documentoEncontrado.endereco.bairro,
          cep: documentoEncontrado.endereco.cep,
          uf: documentoEncontrado.endereco.uf,
        });
      }
    } catch (error) {
      alert("Erro ao buscar cliente.");
      console.error("Erro na conexão: ", error.message);
    }
  };

  const salvarOrcamento = async () => {
    try {
      const { data: clienteSalvo, error: erroCliente } = await supabase // pega os dados da tabela e salva como clienteSalvo
        .from("clientes")
        .upsert(
          // upSert serve para atualizar os dados, exceto o documento que não pode ser alterado
          {
            documento: cliente.documento,
            nome: cliente.nome,
            telefone: cliente.telefone,
            email: cliente.email,
            endereco: {
              rua: cliente.endereco,
              bairro: cliente.bairro,
              cep: cliente.cep,
              uf: cliente.uf,
            },
          },
          { onConflict: "documento" },
        )
        .select() // seleciona e guarda o dado buscado para a variável criada clienteSalvo
        .single(); // retorna apenas um dado

      if (erroCliente) throw erroCliente;

      if (idEdicao) {
        const { data: orcamentoSalvo, error: erroOrcamento } = await supabase // pega os dados e salva como orcamentoSalvo
          .from("orcamentos")
          .update({
            // insere os dados abaixo na tabela orçamentos
            cliente_id: clienteSalvo.id,
            data: new Date().toLocaleDateString("pt-BR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
            vendedor: vendedor,
            forma_pagamento: formaPagamento,
            obs_pagamento: condicaoPagamento,
            prazo_entrega: prazoEntrega,
            itens: itensOrcamento,
            subtotal: valorTotal,
            desconto: calculoDesconto,
            frete: frete,
            valor_total: valorTotalFinal,
            porcentagem_desconto: desconto,
            status: "pendente",
          })
          .select()
          .eq("id", idEdicao) // seleciona o dado e guarda na variável orcamentoSalvo
          .single();

        if (erroOrcamento) throw erroOrcamento;

        alert(`Orçamento n° ${orcamentoSalvo.id} atualizado com sucesso.`);
      } else {
        const { data: orcamentoSalvo, error: erroOrcamento } = await supabase // pega os dados e salva como orcamentoSalvo
          .from("orcamentos")
          .insert({
            // insere os dados abaixo na tabela orçamentos
            cliente_id: clienteSalvo.id,
            data: new Date().toLocaleDateString("pt-BR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
            vendedor: vendedor,
            forma_pagamento: formaPagamento,
            obs_pagamento: condicaoPagamento,
            prazo_entrega: prazoEntrega,
            itens: itensOrcamento,
            subtotal: valorTotal,
            desconto: calculoDesconto,
            frete: frete,
            valor_total: valorTotalFinal,
            porcentagem_desconto: desconto,
            status: "pendente",
          })
          .select() // seleciona o dado e guarda na variável orcamentoSalvo
          .single();

        if (erroOrcamento) throw erroOrcamento;

        alert(`Orçamento n° ${orcamentoSalvo.id} salvo com sucesso.`);
      }
    } catch (error) {
      console.error("Erro na operação: ", error.message);
    }
  };

  const nomeRef = useRef(null);
  const documentoRef = useRef(null);
  const telefoneRef = useRef(null);
  const enderecoRef = useRef(null);
  const cepRef = useRef(null);

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

  function clienteBairro(evento) {
    const bairroDigitado = evento.target.value;
    setCliente({ ...cliente, bairro: bairroDigitado });
  }

  function clienteCEP(evento) {
    const cepDigitado = evento.target.value;
    setCliente({ ...cliente, cep: cepDigitado });
  }

  function clienteUF(evento) {
    const ufDigitado = evento.target.value;
    setCliente({ ...cliente, uf: ufDigitado });
  }

  async function buscarEAdicionar() {
    if (!termoBuscado) return alert("Por favor, digite o nome do produto.");

    try {
      const { data, error } = await supabase
        .from("catalogo")
        .select("*")
        .or(`nome.ilike.%${termoBuscado}%,codigo.ilike.%${termoBuscado}%`) // busca na coluna nome ou na coluna codigo e retorna apenas o valor encontrado
        .limit(1);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        adicionarAoOrcamento(data[0]); // retorna todo o objeto dentro do array no index 0 (que é o valor encontrado na busca)
      } else {
        alert("Item não encontrado no catálogo de produtos!");
      }
    } catch (erro) {
      console.error("Erro ao buscar: ", erro.message);
      alert("Erro de conexão ao buscar o produto.");
    }
  }

  function adicionarAoOrcamento(produto) {
    const jaExiste = itensOrcamento.find((item) => item.id === produto.id);

    if (jaExiste) {
      alert("Produto já existe no orçamento.");
      return;
    }

    let precoFinal = produto.preco;

    if (usuario === "thays") {
      precoFinal = produto.preco * 1.1;
      console.log(`Preço ajustado de ${produto.preco} para ${precoFinal}`);
    }

    const novoItemOrcamento = {
      ...produto,
      preco: precoFinal,
      quantidade: 1,
      observacao: "",
    };

    setItemOrcamento([...itensOrcamento, novoItemOrcamento]);
    setTermoBuscado("");
  }

  function atualizarValor(id, campo, novoValor) {
    setItemOrcamento(
      itensOrcamento.map((item) =>
        item.id === id ? { ...item, [campo]: novoValor } : item,
      ),
    );
  }

  function removeItem(id) {
    if (!confirm("Tem certeza que deseja remover o item?")) return;
    setItemOrcamento(itensOrcamento.filter((item) => item.id !== id));
  }

  function validaCampos() {
    // --- 1. VALIDAÇÕES (Segurança antes de começar) ---

    if (cliente.nome === "") {
      alert("Por favor, preencha o nome do cliente.");
      nomeRef.current.focus();
      return;
    }
    if (cliente.telefone === "") {
      alert("Por favor, preencha o telefone do cliente.");
      telefoneRef.current.focus();
      return;
    }
    if (cliente.endereco === "") {
      alert("Por favor, preencha o endereço do cliente.");
      enderecoRef.current.focus();
      return;
    }
    if (cliente.cep === "") {
      alert("Por favor, preencha o CEP do cliente.");
      cepRef.current.focus();
      return;
    }
    if (cliente.documento === "") {
      alert("Por favor, preencha o CPF / CNPJ do cliente.");
      documentoRef.current.focus();
      return;
    }

    if (!vendedor || vendedor === "" || vendedor === "0") {
      alert("Por favor, selecione o vendedor!");
      return;
    }

    if (!formaPagamento || formaPagamento === "") {
      alert("Por favor, selecione a forma de pagamento!");
      return;
    }

    if (prazoEntrega === "") {
      alert("Por favor, preencha o prazo de entrega.");
      return;
    }

    if (itensOrcamento.length <= 0) {
      alert("Selecione pelo menos um item para o orçamento.");
      return;
    }

    gerarPDF();
    salvarOrcamento();
  }

  function gerarPDF() {
    // --- 2. CONFIGURAÇÕES INICIAIS ---
    const doc = new jsPDF();

    // Cores da Marca (Roxo e Cinza)
    const colorPurple = [93, 64, 120];
    const colorGray = [240, 240, 240];
    const marginX = 15;
    let currentY = 0; // Nosso cursor vertical

    // Datas
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // ===================================================
    // BLOCO 1: CABEÇALHO (Igual ao da foto)
    // ===================================================

    // Lado Esquerdo: Marca (Aqui idealmente iria doc.addImage com a logo)
    doc.setFontSize(24);
    doc.setTextColor(...colorPurple);
    doc.setFont("helvetica", "bold");
    doc.addImage(logo, marginX, 12, 45, 15);

    // Lado Direito: Box Cinza de Contato
    doc.setFillColor(...colorGray);
    doc.rect(100, 10, 95, 25, "F"); // Fundo cinza

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("21 3083-9402 | 97045-5771", 105, 20);
    doc.text("www.bellanomoveis.com.br", 105, 24);
    doc.text("contato@bellanomoveis.com.br", 105, 28);

    doc.text("Rua Cuba, 379 - Sobreloja", 150, 20);
    doc.text("Penha Circular - CEP 21020-160", 150, 24);
    doc.text("Rio de Janeiro - RJ", 150, 28);

    currentY = 40; // Desce o cursor

    // ===================================================
    // BLOCO 2: VENDEDOR E DATA
    // ===================================================

    // Barra Roxa do Vendedor
    doc.setFillColor(...colorPurple);
    doc.rect(marginX, currentY, 130, 7, "F");

    doc.setTextColor(255, 255, 255); // Branco
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    // AQUI ENTRA O SEU VENDEDOR SELECIONADO
    doc.text(`Vendedor: ${vendedor.toUpperCase()}`, marginX + 3, currentY + 5);

    // Box do Pedido (Direita)
    doc.setDrawColor(0, 0, 0); // Borda preta
    doc.rect(150, currentY - 3, 45, 10);
    doc.line(172, currentY - 3, 172, currentY + 7); // Divisória vertical
    doc.line(150, currentY + 2, 195, currentY + 2); // Divisória horizontal

    doc.setTextColor(0, 0, 0); // Preto
    doc.setFontSize(7);
    doc.text("Pedido nº", 152, currentY + 1);
    doc.text("Orçamento nº", 174, currentY + 1);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`${dataAtual.getFullYear()}/${10}`, 152, currentY + 6); // Exemplo de número

    currentY += 10;

    // ===================================================
    // BLOCO 3: DADOS DO CLIENTE (O Grid Perfeito)
    // ===================================================

    // Funçãozinha auxiliar para não repetir código de desenhar quadrado
    const drawField = (label, value, x, y, width) => {
      doc.rect(x, y, width, 6); // Desenha borda
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text(label, x + 1, y + 4); // Rótulo
      doc.setFont("helvetica", "bold");
      doc.text(value ? String(value).substring(0, 35) : "", x + 20, y + 4); // Valor (corta se for gigante)
    };

    // Linha 1: Nome e IE (deixei IE em branco pois não tem no form)
    drawField("Cliente:", cliente.nome.toUpperCase(), marginX, currentY, 120);
    drawField("IE:", "", marginX + 120, currentY, 60);
    currentY += 6;

    // Linha 2: Documento (CPF/CNPJ) e UF
    drawField("CNPJ/CPF:", cliente.documento, marginX, currentY, 120);
    drawField("UF:", cliente.uf, marginX + 120, currentY, 60);
    currentY += 6;

    // Linha 3: Endereço e CEP
    drawField(
      "Endereço:",
      cliente.endereco.toUpperCase(),
      marginX,
      currentY,
      120,
    );
    drawField("CEP:", cliente.cep, marginX + 120, currentY, 60);
    currentY += 6;

    // Linha 4: Bairro e Telefone
    drawField("Bairro:", cliente.bairro.toUpperCase(), marginX, currentY, 120);
    drawField("TEL:", cliente.telefone, marginX + 120, currentY, 60);
    currentY += 6;

    // Linha 5: Email
    drawField("Email:", cliente.email.toUpperCase(), marginX, currentY, 180);
    currentY += 10; // Espaço antes da tabela

    // ===================================================
    // BLOCO 4: TABELA DE PRODUTOS
    // ===================================================

    const tabelaDados = itensOrcamento.map((item) => [
      item.quantidade, // Coluna UN
      item.nome, // Coluna Produto
      item.observacao, // Coluna Cor (Fixo por enquanto)
      item.preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      (item.preco * item.quantidade).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [["UN", "PRODUTO", "COR/DETALHE", "VALOR UN", "VALOR"]],
      body: tabelaDados,
      theme: "grid",
      headStyles: {
        fillColor: [160, 160, 160],
        textColor: [0, 0, 0],
        halign: "center",
        fontSize: 8,
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        3: { halign: "right" },
        4: { halign: "right", fontStyle: "bold" },
      },
      styles: { fontSize: 8 },
    });

    let finalY = doc.lastAutoTable.finalY;

    // ===================================================
    // BLOCO 5: TOTAIS (Subtotal, Desconto, Frete, Total)
    // ===================================================

    // Verifica se precisa de nova página para os totais
    if (finalY > 230) {
      doc.addPage();
      finalY = 20;
    }

    const larguraBox = 59;
    const xBox = 136.55; // Posição horizontal dos boxes de total

    // 1. Subtotal
    doc.rect(xBox, finalY, larguraBox, 6);
    doc.text("SUBTOTAL", xBox + 2, finalY + 4);
    doc.text(
      valorTotal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      xBox + larguraBox - 2,
      finalY + 4,
      { align: "right" },
    );

    // 2. Desconto (Só mostra se tiver)
    doc.rect(xBox, finalY + 6, larguraBox, 6);
    doc.text(`Desconto (${desconto || 0}%)`, xBox + 2, finalY + 10);
    doc.setTextColor(200, 0, 0); // Vermelho para desconto
    doc.text(
      `- ${Number(calculoDesconto).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`,
      xBox + larguraBox - 2,
      finalY + 10,
      { align: "right" },
    );
    doc.setTextColor(0, 0, 0); // Volta pra preto

    // 3. Frete
    doc.rect(xBox, finalY + 12, larguraBox, 6);
    doc.text("Frete", xBox + 2, finalY + 16);
    doc.text(
      `+ ${Number(frete).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`,
      xBox + larguraBox - 2,
      finalY + 16,
      { align: "right" },
    );

    // 4. TOTAL FINAL (Azulzinho destaque)
    doc.setFillColor(180, 200, 210);
    doc.rect(xBox, finalY + 18, larguraBox, 8, "F");
    doc.rect(xBox, finalY + 18, larguraBox, 8); // Borda
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL A PAGAR", xBox + 2, finalY + 23);
    doc.text(
      valorTotalFinal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      xBox + larguraBox - 2,
      finalY + 23,
      { align: "right" },
    );

    // Data por extenso no centro
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.line(70, finalY + 36, 140, finalY + 35);
    doc.text(`Rio de Janeiro, ${dataFormatada}`, 105, finalY + 39, {
      align: "center",
    });

    // ===================================================
    // BLOCO 6: RODAPÉ (Condições e Observações)
    // ===================================================

    let footerY = finalY + 45;

    // Condições de Pagamento
    doc.setFillColor(...colorPurple);
    doc.rect(marginX, footerY, 90, 5, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Condições de pagamento", marginX + 2, footerY + 3.5);

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Forma: ${formaPagamento}`, marginX, footerY + 10);
    doc.text(`Observações: ${condicaoPagamento}`, marginX, footerY + 15);

    // Prazo
    doc.setFillColor(...colorPurple);
    doc.rect(marginX, footerY + 24, 90, 5, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Prazo", marginX + 2, footerY + 27.5);

    doc.setTextColor(150, 50, 50); // Cor de alerta
    doc.setFont("helvetica", "italic");
    // Se tiver observação no item, mostra aqui, ou uma obs geral
    doc.text(`${prazoEntrega} dias corridos.`, marginX, footerY + 34);

    // Observações
    doc.setFillColor(...colorPurple);
    doc.rect(marginX, footerY + 41, 90, 5, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Observações", marginX + 2, footerY + 44.5);

    doc.setTextColor(150, 50, 50); // Cor de alerta
    doc.setFont("helvetica", "italic");
    // Se tiver observação no item, mostra aqui, ou uma obs geral
    doc.text("Validade da proposta: 10 dias.", marginX, footerY + 51);
    doc.text(
      "Não realizamos instalação hidraulica e o lavatório não acompanha aquecedor elétrico.",
      marginX,
      footerY + 56,
    );
    doc.setFontSize(10);
    doc.setTextColor(200, 20, 20);
    doc.text("Informações importantes", marginX, footerY + 65);
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Prazo: este é contabilizado mediante a data de pagamento e assinatura do pedido, salvo quando existem itens sob medida ou
      detalhes que impeçam a produção por dependerem de informações fornecidas pelo cliente, nestes casos, tais itens terão prazo
      postergado e será contabilizado a partir da definição dessas informações.`,
      marginX,
      footerY + 69,
    );
    doc.text(
      `Entrega: por escadas ou de difícil acesso até o 3° andar, deverá ser tomada a conferência do produto no piso térreo pelo
      responsável do recebimento. Acima do 3° andar, será avaliada a cobrança da taxa extra e revalidação do prazo de entrega mediante
      disponibilidade da equipe de frete.`,
      marginX,
      footerY + 81,
    );

    doc.setFillColor(160, 160, 160);
    doc.rect(0, 290, 210, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(
      "GMZ Indústria e Comércio de Móveis LTDA | CNPJ 29.267.422/0001-00",
      105,
      294.5,
      {
        align: "center",
      },
    );

    // Salvar
    const nomeArquivo = `orcamento_${cliente.nome.replace(/ /g, "_")}_${dataAtual.getDate()}-${dataAtual.getMonth() + 1}.pdf`;
    doc.save(nomeArquivo);

    setCliente({
      nome: "",
      documento: "",
      email: "",
      telefone: "",
      endereco: "",
      bairro: "",
      cep: "",
      uf: "",
    });

    setVendedor("");
    setFormaPagamento("");
    setCondicaoPagamento("");
    setprazoEntrega("");
    setDesconto("");
    setFrete("");
    setItemOrcamento([]);
  }

  return (
    <div className="orcamento-container">
      <div className="box-btn-orcamento">
        <button onClick={() => setGerarOrcamentoBtn("gerar-orcamento")}>
          Gerar Orçamento
        </button>
        <button onClick={() => setGerarOrcamentoBtn("buscar-orcamento")}>
          Buscar Orçamento
        </button>
      </div>

      {gerarOrcamentoBtn === "gerar-orcamento" && (
        <>
          <div className="gerar-orcamento-container">
            <h1>Gerar Orçamento</h1>
            <div className="dados-clientes">
              <h3>Dados do Cliente</h3>
              <div className="dados-cliente-box">
                <div className="autofill-box">
                  <span>CPF / CNPJ: </span>{" "}
                  <input
                    ref={documentoRef}
                    type="number"
                    onChange={documentoCliente}
                    value={cliente.documento}
                    required
                    className="document-input"
                  />
                  <button className="autofill-btn" onClick={buscarDocumento}>
                    Buscar
                  </button>
                </div>
                <div className="dados-cliente-input">
                  <span>Nome Completo: </span>{" "}
                  <input
                    ref={nomeRef}
                    type="text"
                    onChange={nomeCliente}
                    value={cliente.nome}
                    required
                  />
                </div>

                <div className="dados-cliente-input">
                  <span>E-mail: </span>{" "}
                  <input
                    type="email"
                    onChange={emailCliente}
                    value={cliente.email}
                  />
                </div>
                <div className="dados-cliente-input">
                  <span>Telefone: </span>{" "}
                  <input
                    ref={telefoneRef}
                    type="tel"
                    onChange={telefoneCliente}
                    value={cliente.telefone}
                    required
                  />
                </div>
                <div className="dados-cliente-endereco">
                  <div>
                    <span>Endereço: </span>{" "}
                    <input
                      ref={enderecoRef}
                      type="text"
                      onChange={enderecoCliente}
                      value={cliente.endereco}
                      required
                    />
                  </div>
                  <div>
                    <span>Bairro: </span>
                    <input
                      type="text"
                      onChange={clienteBairro}
                      value={cliente.bairro}
                    />
                  </div>
                  <div>
                    <span>CEP: </span>
                    <input
                      ref={cepRef}
                      type="text"
                      onChange={clienteCEP}
                      value={cliente.cep}
                    />
                  </div>
                  <div>
                    <span>UF:</span>
                    <select name="uf" onChange={clienteUF} value={cliente.uf}>
                      <option value="">UF</option>
                      <option value="AC">AC</option>
                      <option value="AL">AL</option>
                      <option value="AP">AP</option>
                      <option value="AM">AM</option>
                      <option value="BA">BA</option>
                      <option value="CE">CE</option>
                      <option value="DF">DF</option>
                      <option value="ES">ES</option>
                      <option value="GO">GO</option>
                      <option value="MA">MA</option>
                      <option value="MT">MT</option>
                      <option value="MS">MS</option>
                      <option value="MG">MG</option>
                      <option value="PA">PA</option>
                      <option value="PB">PB</option>
                      <option value="PR">PR</option>
                      <option value="PE">PE</option>
                      <option value="PI">PI</option>
                      <option value="RJ">RJ</option>
                      <option value="RN">RN</option>
                      <option value="RS">RS</option>
                      <option value="RO">RO</option>
                      <option value="RR">RR</option>
                      <option value="SC">SC</option>
                      <option value="SP">SP</option>
                      <option value="SE">SE</option>
                      <option value="TO">TO</option>
                    </select>
                  </div>
                </div>
                <div className="dados-cliente-input">
                  <span>Vendedor: </span>{" "}
                  <select
                    value={vendedor}
                    onChange={(e) => setVendedor(e.target.value)}
                  >
                    <option value="">Selecionar vendedor</option>
                    <option value="Raquel Passos">Raquel Passos</option>
                    <option value="Thays Rianelli">Thays Rianelli</option>
                    <option value="Aldeir Gonçalves">Aldeir Gonçalves</option>
                    <option value="Eduardo Gimenez">Eduardo Gimenez</option>
                  </select>
                </div>
                <div className="dados-cliente-input">
                  <span>Forma de Pagamento: </span>{" "}
                  <select
                    value={formaPagamento}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                  >
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
                    value={condicaoPagamento}
                    onChange={(e) => setCondicaoPagamento(e.target.value)}
                  ></textarea>
                </div>
                <div className="dados-cliente-input">
                  <span>Prazo de entrega:</span>
                  <input
                    type="number"
                    value={prazoEntrega}
                    onChange={(e) => setprazoEntrega(e.target.value)}
                  />
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
                  onKeyDown={(e) => e.key === "Enter" && buscarEAdicionar()}
                />
                <button onClick={buscarEAdicionar}>Adicionar</button>
              </div>
              <div className="buscar-produto-lista">
                {itensOrcamento.length > 0 ? (
                  <div className="lista-produto">
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead className="header-tabela">
                        <tr
                          style={{
                            borderBottom: "2px solid #eee",
                            textAlign: "left",
                            color: "#555",
                          }}
                        >
                          <th style={{ padding: "10px" }}>Produto</th>
                          <th style={{ padding: "10px" }}>Qtd</th>
                          <th style={{ padding: "10px" }}>Valor Un</th>
                          <th style={{ padding: "10px" }}>Observação</th>
                          <th style={{ padding: "10px" }}>Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itensOrcamento.map((item) => (
                          <tr
                            className="corpo-tabela"
                            key={item.id}
                            style={{ borderBottom: "1px solid #eee" }}
                          >
                            <td>{item.nome}</td>
                            <td>
                              <input
                                style={{ width: "40px" }}
                                type="number"
                                min={1}
                                value={item.quantidade}
                                onChange={(e) =>
                                  atualizarValor(
                                    item.id,
                                    "quantidade",
                                    e.target.value,
                                  )
                                }
                              />
                            </td>
                            <td style={{ paddingLeft: "5px" }}>
                              {(item.preco * item.quantidade).toLocaleString(
                                "pt-BR",
                                { style: "currency", currency: "BRL" },
                              )}
                            </td>
                            <td>
                              <textarea
                                onChange={(e) =>
                                  atualizarValor(
                                    item.id,
                                    "observacao",
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
                  "Nenhum item adicionado"
                )}
              </div>
              <div className="valor-total-box">
                <div className="valor-total-input">
                  <div>
                    <span>Desconto (%): </span>
                    <input
                      type="number"
                      value={desconto}
                      onChange={(e) => setDesconto(e.target.value)}
                    />
                  </div>
                  <div>
                    <span>Valor do Frete: </span>
                    <input
                      type="number"
                      value={frete}
                      onChange={(e) => setFrete(e.target.value)}
                    />
                  </div>
                </div>
                <div className="valor-total-resultado">
                  <span>
                    Total:{" "}
                    {valorTotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                  <span>
                    Desconto {desconto + "%"}:{" "}
                    {calculoDesconto.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                  <span>
                    Frete:{" "}
                    {Number(frete).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                  <span>
                    Total Final:{" "}
                    {valorTotalFinal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>
            </div>
            <button className="pdf-btn" onClick={validaCampos}>
              Gerar PDF
            </button>
          </div>
        </>
      )}

      {gerarOrcamentoBtn === "buscar-orcamento" && (
        <>
          <SearchBudget
            aoClicarEmEditar={preencherFormularioEdicao}
            checaUsuario={usuario}
          />
        </>
      )}
    </div>
  );
}

export default Budget;
