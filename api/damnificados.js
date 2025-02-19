const fs = require('fs')
const path = require('path')

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { nombre, identificador } = req.body
  const damnificados = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'damnificados.json')),
  )

  let filteredDamnificados = damnificados

  if (identificador) {
    filteredDamnificados = filteredDamnificados.filter(
      (damnificado) => damnificado.dador == identificador,
    )
  }

  if (nombre) {
    filteredDamnificados = filteredDamnificados.filter((damnificado) =>
      damnificado.nombre.toLowerCase().includes(nombre.toLowerCase()),
    )
  }

  res.status(200).json(filteredDamnificados)
}
