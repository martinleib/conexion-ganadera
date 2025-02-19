import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

export default async (req, res) => {
  try {
    if (req.method !== 'POST') {
      console.error('Method not allowed')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', async () => {
      try {
        console.log('Request body:', body)
        const { nombre, identificador } = JSON.parse(body)

        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: 'damnificados.json',
        }

        const data = await s3.getObject(params).promise()
        const damnificados = JSON.parse(data.Body.toString('utf-8'))

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

        console.log('Filtered damnificados:', filteredDamnificados)
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
