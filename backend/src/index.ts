import express from 'express'
import cors from 'cors'
import connection from './mysql_connection.js'
import MysqlErrorHandle from './mysql_error_handler.js'
import { type RowDataPacket, type ResultSetHeader } from 'mysql2/promise'

const app = express()

app.use(cors())
app.use(express.json())

interface IMarca extends RowDataPacket {
  id: number
  nome: string
}

interface ICategoria extends RowDataPacket {
  id: number
  nome: string
}

interface IProduto extends RowDataPacket {
  id: number
  nome: string
  cor: string
  preco: number
  quantidade: number
  marca_id: number
  categoria_id: number
}

interface IProdutoNoGet extends RowDataPacket {
  id: number
  nome: string
  cor: string
  preco: number
  quantidade: number
  marca: string
  categoria: string
}


//Rota dos produtos >:D

app.get('/produtos', async (req, res) => {
  try {
  const [dados] = await connection.execute<IProdutoNoGet[]>(
  `SELECT
      produtos.id,
      produtos.nome,
      produtos.cor,
      produtos.preco,
      produtos.quantidade,
      marcas.nome AS marca,
      categorias.nome AS categoria
   FROM produtos
   INNER JOIN marcas
      ON produtos.marca_id = marcas.id
   INNER JOIN categorias
      ON produtos.categoria_id = categorias.id`
)
    return res.status(200).json(dados)

}catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err, res)
    return mysqlErrorHandle.validar()
}
})

app.post('/produtos', async (req, res) => {
  const { nome, cor, preco, quantidade, marca_id, categoria_id} = req.body

  if ( !nome || !cor || preco === undefined || quantidade === undefined || !marca_id || !categoria_id){
    return res.status(400).json({ mensagem: 'Campos nome, cor, preco, quantidade, marca e categoria são obrigatórios'})
}

 try {
    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO produtos
      (nome, cor, preco, quantidade, marca_id, categoria_id) VALUES (?, ?, ?, ?, ?, ?)`, [nome, cor, preco, quantidade, marca_id, categoria_id]
    )

    if (result.affectedRows === 0) {
      return res.status(500).json({
        mensagem: 'Erro ao cadastrar produto'
    })
}

    return res.status(201).json({
      mensagem: 'Produto cadastrado com sucesso'
    })

}catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err, res)
    return mysqlErrorHandle.validar()
  }
})


app.patch('/produto/:id', async (req, res) => {
  const { id } = req.params
  const { nome, cor, preco, quantidade, marca_id, categoria_id } = req.body

  try {
    const [rows] = await connection.execute<IProduto[]>(
      'SELECT * FROM produtos WHERE id = ?' , [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Produto não encontrado'
    })
}

const produtoAtual = rows[0] as IProduto

    const novoNome = nome ?? produtoAtual.nome
    const novaCor = cor ?? produtoAtual.cor
    const novoPreco = preco ?? produtoAtual.preco
    const novaQuantidade = quantidade ?? produtoAtual.quantidade
    const novaMarca = marca_id ?? produtoAtual.marca_id
    const novaCategoria = categoria_id ?? produtoAtual.categoria_id

    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE produtos SET nome = ?, cor = ?, preco = ?, quantidade = ?, marca_id = ?, categoria_id = ? WHERE id = ?`,
      [novoNome, novaCor, novoPreco, novaQuantidade, novaMarca, novaCategoria, id]
    )

    if (result.affectedRows === 0) {
      return res.status(500).json({
        mensagem: 'Erro ao atualizar produto'
      })
    }

    return res.status(200).json({
      mensagem: 'Produto atualizado com sucesso'
    })

}catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err, res)
    return mysqlErrorHandle.validar()
  }
})

app.delete('/produto/:id', async (req, res) => {
  const { id } = req.params

  try {
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM produtos WHERE id = ?', [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        mensagem: 'Produto não encontrado'
    })
    }

    return res.status(200).json({
      mensagem: 'Produto deletado com sucesso'
    })

}catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err, res)
    return mysqlErrorHandle.validar()
}
})

//Rota das marcas >:v

app.get('/marcas', async (req, res) => {

  try {
    const [dados] = await connection.execute<IMarca[]>('SELECT * FROM marcas')
    return res.status(200).json(dados)

}catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err, res)
    return mysqlErrorHandle.validar()
  }
})

app.post('/marcas', async (req, res) => {
  const { nome } = req.body

  if (!nome){
    return res.status(400).json({
      mensagem: 'O campo nome é obrigatório'
    })
}

  try {
    const [result] = await connection.execute<ResultSetHeader>( 'INSERT INTO marcas (nome) VALUES (?)', [nome] )

    if (result.affectedRows === 0) {
      return res.status(500).json({
        mensagem: 'Erro ao cadastrar marca'
    })
}

    return res.status(201).json({
      mensagem: 'Marca cadastrada com sucesso'
})

}catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err, res)
    return mysqlErrorHandle.validar()
}
})

app.patch('/marca/:id', async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({
      mensagem: 'O campo nome é obrigatório!',
    });
  }

  try {
    const [rows] = await connection.execute<IMarca[]>(
      'SELECT * FROM marcas WHERE id = ?', [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Marca não encontrada!'
      })
}

    const [result] = await connection.execute<ResultSetHeader>('UPDATE marcas SET nome = ? WHERE id = ?', [nome, id])

    if (result.affectedRows === 0) {
      return res.status(500).json({
        mensagem: 'Erro ao atualizar marca'
      })
}

    return res.status(200).json({
      mensagem: 'Marca atualizada com sucesso'
    })

}catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err, res)
    return mysqlErrorHandle.validar()
  }
})

app.delete('/marca/:id', async (req, res) => {
  const { id } = req.params

  try {
    const [result] = await connection.execute<ResultSetHeader>('DELETE FROM marcas WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({
        mensagem: 'Marca não encontrada'
      })
}

    return res.status(200).json({
      mensagem: 'Marca deletada com sucesso'
    })

}catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err, res)
    return mysqlErrorHandle.validar()
  }
})

//Rota de categorias >:p

app.get('/categorias', async (req, res) => {
  try {
    const [dados] = await connection.execute<ICategoria[]>('SELECT * FROM categorias')

    return res.status(200).json(dados)

}catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err, res)
    return mysqlErrorHandle.validar()
}
})


app.post('/categorias', async (req, res) => {
  const { nome } = req.body

  if (!nome) {
    return res.status(400).json({
      mensagem: 'O campo nome é obrigatório'
    })
}

  try {
    const [result] = await connection.execute<ResultSetHeader>( 'INSERT INTO categorias (nome) VALUES (?)', [nome])

    if (result.affectedRows === 0) {
      return res.status(500).json({
        mensagem: 'Erro ao cadastrar categoria'
      })
}

    return res.status(201).json({
      mensagem: 'Categoria cadastrada com sucesso'
    })

}catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err, res)
    return mysqlErrorHandle.validar()
  }
})


app.patch('/categoria/:id', async (req, res) => {
  const { id } = req.params
  const { nome } = req.body

  if (!nome) {
    return res.status(400).json({
      mensagem: 'O campo nome é obrigatório'
    })
}

  try {
    const [rows] = await connection.execute<ICategoria[]>('SELECT * FROM categorias WHERE id = ?', [id])

    if (rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Categoria não encontrada'
      })
}

    const [result] = await connection.execute<ResultSetHeader>('UPDATE categorias SET nome = ? WHERE id = ?', [nome, id])

    if (result.affectedRows === 0) {
      return res.status(500).json({
        mensagem: 'Erro ao atualizar categoria!'
      })
}

    return res.status(200).json({
      mensagem: 'Categoria atualizada com sucesso!'
    })

}catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err, res)
    return mysqlErrorHandle.validar()
  }
})


app.delete('/categoria/:id', async (req, res) => {
  const { id } = req.params

  try {
    const [result] = await connection.execute<ResultSetHeader>('DELETE FROM categorias WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({
        mensagem: 'Categoria não encontrada'
      })
}

    return res.status(200).json({
      mensagem: 'Categoria deletada com sucesso'
    })

}catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err, res)
    return mysqlErrorHandle.validar()
  }
})


app.listen(8000, () => {
    console.log("Servidor funcionando (＾▽＾)")
})