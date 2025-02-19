const fs = require('fs')
const path = require('path')

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        const { nombre, identificador } = JSON.parse(body)
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
      } catch (error) {
        console.error('Error processing request:', error)
        res.status(500).json({ error: 'Internal Server Error' })
      }
    })
  } catch (error) {
    console.error('Error handling request:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
