import { useEffect, useState } from 'react';

interface Produto {
  id: number;
  nome: string;
  cor: string;
  preco: number;
  quantidade: number;
  marca: string;
  categoria: string;
}

interface Marca {
  id: number;
  nome: string;
}

interface Categoria {
  id: number;
  nome: string;
}

function App() {

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [novoNome, setNovoNome] = useState('');
  const [novaCor, setNovaCor] = useState('');
  const [novoPreco, setNovoPreco] = useState('');
  const [novaQuantidade, setNovaQuantidade] = useState('');
  const [novaMarca, setNovaMarca] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('');

  const [salvando, setSalvando] = useState(false);

  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [nomeEditado, setNomeEditado] = useState('');
  const [corEditada, setCorEditada] = useState('');
  const [precoEditado, setPrecoEditado] = useState('');
  const [quantidadeEditada, setQuantidadeEditada] = useState('');
  const [marcaEditada, setMarcaEditada] = useState('');
  const [categoriaEditada, setCategoriaEditada] = useState('');

  useEffect(() => {
    carregarProdutos();
    carregarMarcas();
    carregarCategorias();
  }, [])

  async function carregarProdutos() {
  try {
    const resposta = await fetch('http://localhost:8000/produtos');

    if (!resposta.ok) {
      throw new Error('Erro ao buscar produtos');
    }

    const dados = await resposta.json();
    setProdutos(dados);

  } catch (e: unknown) {
    if (e instanceof Error) {
      setErro(e.message);
    } else {
      setErro('Erro inesperado');
    }
  } finally {
    setCarregando(false);
  }
}

async function carregarMarcas() {
  try {
    const resposta = await fetch('http://localhost:8000/marcas');

    if (!resposta.ok) {
      throw new Error('Erro ao buscar marcas');
    }

    const dados = await resposta.json();
    setMarcas(dados);

  } catch (e: unknown) {
    if (e instanceof Error) {
      setErro(e.message);
    } else {
      setErro('Erro inesperado');
    }
  }
}

async function carregarCategorias() {
  try {
    const resposta = await fetch('http://localhost:8000/categorias');

    if (!resposta.ok) {
      throw new Error('Erro ao buscar categorias');
    }

    const dados = await resposta.json();
    setCategorias(dados);

  } catch (e: unknown) {
    if (e instanceof Error) {
      setErro(e.message);
    } else {
      setErro('Erro inesperado');
    }
  }
}

async function handleSalvar() {
  try {
    setSalvando(true);

    const resposta = await fetch('http://localhost:8000/produtos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: novoNome,
        cor: novaCor,
        preco: Number(novoPreco),
        quantidade: Number(novaQuantidade),
        marca_id: Number(novaMarca),
        categoria_id: Number(novaCategoria),
      }),
    });

    if (!resposta.ok) {
      const erroResposta = await resposta.json();
      throw new Error(
        erroResposta.mensagem || 'Erro ao cadastrar produto'
      );
    }

    setNovoNome('');
    setNovaCor('');
    setNovoPreco('');
    setNovaQuantidade('');
    setNovaMarca('');
    setNovaCategoria('');

    await carregarProdutos();

  } catch (e: unknown) {
    if (e instanceof Error) {
      alert(e.message);
    } else {
      alert('Erro desconhecido ao salvar');
    }
  } finally {
    setSalvando(false);
  }
}

async function handleEditar(id: number) {
  try {
    const resposta = await fetch(`http://localhost:8000/produto/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: nomeEditado,
        cor: corEditada,
        preco: Number(precoEditado),
        quantidade: Number(quantidadeEditada),
        marca_id: Number(marcaEditada),
        categoria_id: Number(categoriaEditada),
      }),
    });

    if (!resposta.ok) {
      const erroResposta = await resposta.json();
      throw new Error(
        erroResposta.mensagem || 'Erro ao editar produto'
      );
    }

    await carregarProdutos();

    setEditandoId(null);
    setNomeEditado('');
    setCorEditada('');
    setPrecoEditado('');
    setQuantidadeEditada('');
    setMarcaEditada('');
    setCategoriaEditada('');

  } catch (e: unknown) {
    if (e instanceof Error) {
      alert(e.message);
    } else {
      alert('Erro desconhecido ao editar');
    }
  }
}

async function handleDeletar(id: number) {
  try {
    const resposta = await fetch(`http://localhost:8000/produto/${id}`, {
      method: 'DELETE',
    });

    if (!resposta.ok) {
      const erroResposta = await resposta.json();
      throw new Error(
        erroResposta.mensagem || 'Erro ao deletar produto'
      );
    }

    setProdutos((listaAtual) =>
      listaAtual.filter((produto) => produto.id !== id)
    );

  } catch (e: unknown) {
    if (e instanceof Error) {
      alert(e.message);
    } else {
      alert('Erro desconhecido ao deletar.');
    }
  }
}

function iniciarEdicao(produto: Produto) {
  setEditandoId(produto.id);

  setNomeEditado(produto.nome);
  setCorEditada(produto.cor);
  setPrecoEditado(produto.preco.toString());
  setQuantidadeEditada(produto.quantidade.toString());

  const marcaSelecionada = marcas.find(
    (marca) => marca.nome === produto.marca
  );

  if (marcaSelecionada) {
    setMarcaEditada(marcaSelecionada.id.toString());
  }

  const categoriaSelecionada = categorias.find(
    (categoria) => categoria.nome === produto.categoria
  );

  if (categoriaSelecionada) {
    setCategoriaEditada(categoriaSelecionada.id.toString());
  }
}

function cancelarEdicao() {
  setEditandoId(null);

  setNomeEditado('');
  setCorEditada('');
  setPrecoEditado('');
  setQuantidadeEditada('');
  setMarcaEditada('');
  setCategoriaEditada('');
}

return (
<div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1>Cadastro de Produtos de Maquiagem</h1>

    <div style={{ marginBottom: '20px' }}>
      <h2>Cadastrar Produto</h2>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Nome:{' '}
          <input
            type="text"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Cor:{' '}
          <input
            type="text"
            value={novaCor}
            onChange={(e) => setNovaCor(e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Preço:{' '}
          <input
            type="number"
            step="0.01"
            value={novoPreco}
            onChange={(e) => setNovoPreco(e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Quantidade:{' '}
          <input
            type="number"
            value={novaQuantidade}
            onChange={(e) => setNovaQuantidade(e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Marca:{' '}
          <select
            value={novaMarca}
            onChange={(e) => setNovaMarca(e.target.value)}
          >
            <option value="">Selecione</option>

            {marcas.map((marca) => (
              <option key={marca.id} value={marca.id}>
                {marca.nome}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Categoria:{' '}
          <select
            value={novaCategoria}
            onChange={(e) => setNovaCategoria(e.target.value)}
          >
            <option value="">Selecione</option>

            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button onClick={handleSalvar} disabled={salvando}>
        {salvando ? 'Salvando...' : 'Salvar'}
      </button>
    </div>

    {carregando && <p>Carregando...</p>}

    {erro && <p style={{ color: 'red' }}>{erro}</p>}

    {!carregando && !erro && produtos.length === 0 && (
      <p>Nenhum produto encontrado.</p>
    )}

<ul>
  {produtos.map((produto) => (
    <li key={produto.id} style={{ marginBottom: '20px' }}>

      {editandoId === produto.id ? (
        <>
          <div>
            <input
              type="text"
              value={nomeEditado}
              onChange={(e) => setNomeEditado(e.target.value)}
              placeholder="Nome"
            />
          </div>

          <div>
            <input
              type="text"
              value={corEditada}
              onChange={(e) => setCorEditada(e.target.value)}
              placeholder="Cor"
            />
          </div>

          <div>
            <input
              type="number"
              step="0.01"
              value={precoEditado}
              onChange={(e) => setPrecoEditado(e.target.value)}
              placeholder="Preço"
            />
          </div>

          <div>
            <input
              type="number"
              value={quantidadeEditada}
              onChange={(e) => setQuantidadeEditada(e.target.value)}
              placeholder="Quantidade"
            />
          </div>

          <div>
            <select
              value={marcaEditada}
              onChange={(e) => setMarcaEditada(e.target.value)}
            >
              {marcas.map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={categoriaEditada}
              onChange={(e) => setCategoriaEditada(e.target.value)}
            >
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>

          <button onClick={() => handleEditar(produto.id)}>
            Salvar
          </button>

          <button onClick={cancelarEdicao}>
            Cancelar
          </button>
        </>
      ) : (
        <>
          <strong>{produto.nome}</strong>

          <br />

          Cor: {produto.cor}

          <br />

          Preço: R$ {produto.preco}

          <br />

          Quantidade: {produto.quantidade}

          <br />

          Marca: {produto.marca}

          <br />

          Categoria: {produto.categoria}

          <br /><br />

          <button onClick={() => iniciarEdicao(produto)}>
            Editar
          </button>

          <button
            onClick={() => handleDeletar(produto.id)}
            style={{ marginLeft: '10px' }}
          >
            Deletar
          </button>
        </>
      )}

    </li>
  ))}
</ul>
  </div>
);
}

export default App;