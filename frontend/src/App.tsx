import { useEffect, useState } from 'react';
import './App.css';

interface Produto {
  id: number
  nome: string
  cor: string
  preco: number
  quantidade: number
  marca: string
  categoria: string
}

interface Marca {
  id: number
  nome: string
}

interface Categoria {
  id: number
  nome: string
}

function App() {

  const [tela, setTela] = useState("cadastro")
  const [filtroMarca, setFiltroMarca] = useState('')
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const [novoNome, setNovoNome] = useState('')
  const [novaCor, setNovaCor] = useState('')
  const [novoPreco, setNovoPreco] = useState('')
  const [novaQuantidade, setNovaQuantidade] = useState('')
  const [novaMarca, setNovaMarca] = useState('')
  const [novaCategoria, setNovaCategoria] = useState('')

  const [salvando, setSalvando] = useState(false)

  const [editandoId, setEditandoId] = useState<number | null>(null)

  const [nomeEditado, setNomeEditado] = useState('')
  const [corEditada, setCorEditada] = useState('')
  const [precoEditado, setPrecoEditado] = useState('')
  const [quantidadeEditada, setQuantidadeEditada] = useState('')
  const [marcaEditada, setMarcaEditada] = useState('')
  const [categoriaEditada, setCategoriaEditada] = useState('')

  useEffect(() => {
    carregarProdutos()
    carregarMarcas()
    carregarCategorias()
  }, [])

  async function carregarProdutos() {
  try {
    const resposta = await fetch('http://localhost:8000/produtos')

    if (!resposta.ok) {
      throw new Error('Erro ao buscar produtos')
    }

    const dados = await resposta.json()
    setProdutos(dados)

  } catch (e: unknown) {
    if (e instanceof Error) {
      setErro(e.message)
    } else {
      setErro('Erro inesperado')
    }
  } finally {
    setCarregando(false)
  }
}

async function filtrarPorMarca() {
  if (filtroMarca === '') {
    carregarProdutos()
    return
  }

  try {
    const resposta = await fetch(
      `http://localhost:8000/produtos/marca/${filtroMarca}`
    )

    if (!resposta.ok) {
      throw new Error('Erro ao filtrar produtos')
    }

    const dados = await resposta.json()
    setProdutos(dados);

  } catch (e) {
    alert('Erro ao filtrar produtos')
  }
}

async function carregarMarcas() {
  try {
    const resposta = await fetch('http://localhost:8000/marcas')

    if (!resposta.ok) {
      throw new Error('Erro ao buscar marcas')
    }

    const dados = await resposta.json()
    setMarcas(dados)

  } catch (e: unknown) {
    if (e instanceof Error) {
      setErro(e.message)
    } else {
      setErro('Erro inesperado')
    }
  }
}

async function carregarCategorias() {
  try {
    const resposta = await fetch('http://localhost:8000/categorias')

    if (!resposta.ok) {
      throw new Error('Erro ao buscar categorias')
    }

    const dados = await resposta.json()
    setCategorias(dados)

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
        marca: novaMarca,
        categoria_id: Number(novaCategoria)
      })
    })

    if (!resposta.ok) {
      const erroResposta = await resposta.json()
      throw new Error(
        erroResposta.mensagem || 'Erro ao cadastrar produto'
      )
    }

    setNovoNome('')
    setNovaCor('')
    setNovoPreco('')
    setNovaQuantidade('')
    setNovaMarca('')
    setNovaCategoria('')

    await carregarProdutos()

  } catch (e: unknown) {
    if (e instanceof Error) {
      alert(e.message);
    } else {
      alert('Erro desconhecido ao salvar')
    }
  } finally {
    setSalvando(false)
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
        marca: marcaEditada,
        categoria_id: Number(categoriaEditada)
      })
    })

    if (!resposta.ok) {
      const erroResposta = await resposta.json()
      throw new Error(
        erroResposta.mensagem || 'Erro ao editar produto'
      )
    }

    await carregarProdutos()

    setEditandoId(null)
    setNomeEditado('')
    setCorEditada('')
    setPrecoEditado('')
    setQuantidadeEditada('')
    setMarcaEditada('')
    setCategoriaEditada('')

  } catch (e: unknown) {
    if (e instanceof Error) {
      alert(e.message);
    } else {
      alert('Erro desconhecido ao editar')
    }
  }
}

async function handleDeletar(id: number) {
  try {
    const resposta = await fetch(`http://localhost:8000/produto/${id}`, {
      method: 'DELETE'
    })

    if (!resposta.ok) {
      const erroResposta = await resposta.json();
      throw new Error(
        erroResposta.mensagem || 'Erro ao deletar produto'
      )
    }

    setProdutos((listaAtual) =>
      listaAtual.filter((produto) => produto.id !== id)
    );

  } catch (e: unknown) {
    if (e instanceof Error) {
      alert(e.message)
    } else {
      alert('Erro desconhecido ao deletar.')
    }
  }
}

function iniciarEdicao(produto: Produto) {
  setEditandoId(produto.id)

  setNomeEditado(produto.nome)
  setCorEditada(produto.cor)
  setPrecoEditado(produto.preco.toString())
  setQuantidadeEditada(produto.quantidade.toString())

  setMarcaEditada(produto.marca)

  const categoriaSelecionada = categorias.find(
    (categoria) => categoria.nome === produto.categoria
  );

  if (categoriaSelecionada) {
    setCategoriaEditada(categoriaSelecionada.id.toString())
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
  <div className="container">

    {tela === "cadastro" && (
      <>
        <h1>Cadastro de Produtos de Maquiagem</h1>

        <h2>Cadastrar Produto</h2>

        <div className="campo">
          <label>Nome:</label>
          <input
            type="text"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Cor:</label>
          <input
            type="text"
            value={novaCor}
            onChange={(e) => setNovaCor(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Preço:</label>
          <input
            type="number"
            step="0.01"
            value={novoPreco}
            onChange={(e) => setNovoPreco(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Quantidade:</label>
          <input
            type="number"
            value={novaQuantidade}
            onChange={(e) => setNovaQuantidade(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Marca:</label>
          <input
            type="text"
            value={novaMarca}
            onChange={(e) => setNovaMarca(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Categoria:</label>
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
        </div>

        <button onClick={handleSalvar} disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar"}
        </button>

        <button
          onClick={() => setTela("produtos")}
          style={{ marginLeft: "10px" }}
        >
          Ver Produtos
        </button>
      </>
    )}

    {tela === "produtos" && (
      <>
        <h1>Produtos Cadastrados</h1>

        <button
          onClick={() => setTela("cadastro")}
          style={{ marginBottom: "20px" }}
        >
          Novo Cadastro
        </button>

        <div className="campo">
          <label>Filtrar por Marca:</label>

          <input
            type="text"
            placeholder="Digite a marca"
            value={filtroMarca}
            onChange={(e) => setFiltroMarca(e.target.value)}
          />

          <button
            onClick={filtrarPorMarca}
            style={{ marginLeft: "10px" }}
          >
            Filtrar
          </button>

          <button
            onClick={() => {
              setFiltroMarca("");
              carregarProdutos();
            }}
            style={{ marginLeft: "10px" }}
          >
            Mostrar Todos
          </button>
        </div>

        {carregando && <p>Carregando...</p>}

        {erro && <p style={{ color: "red" }}>{erro}</p>}

        {!carregando && !erro && produtos.length === 0 && (
          <p>Nenhum produto encontrado.</p>
        )}

        <ul>
          {produtos.map((produto) => (
            <li key={produto.id} style={{ marginBottom: "20px" }}>
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
                    <input
                      type="text"
                      value={marcaEditada}
                      onChange={(e) => setMarcaEditada(e.target.value)}
                      placeholder="Marca"
                    />
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

                  <br/>

                  Cor: {produto.cor}

                  <br/>

                  Preço: R$ {produto.preco}

                  <br/>

                  Quantidade: {produto.quantidade}

                  <br/>

                  Marca: {produto.marca}

                  <br/>

                  Categoria: {produto.categoria}

                  <br/>
                  <br/>

                  <button onClick={() => iniciarEdicao(produto)}>
                    Editar
                  </button>

                  <button
                    onClick={() => handleDeletar(produto.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Deletar
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
)
}

export default App;