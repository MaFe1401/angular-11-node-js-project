const express = require('express')
const paillierBigint = require('paillier-bigint')
const bigintConversion = require('bigint-conversion')
const app = express()
const port = 3000
const { publicKey, privateKey } = paillierBigint.generateRandomKeysSync(3072)
const cors = require('cors');
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/vote', (req, res) => {
  //console.log(req.body)
  console.log("VOTES RECEIVED!!!")
  console.log(privateKey.decrypt(bigintConversion.base64ToBigint(req.body.voto1)), privateKey.decrypt(bigintConversion.base64ToBigint(req.body.voto2)), privateKey.decrypt(bigintConversion.base64ToBigint(req.body.voto3)))
  res.send("OK");
})

app.post("/usuario", async (req, res) => {
  // Dentro de req.body tenemos a todo el objeto. Podemos acceder a las claves del mismo como
  // lo enviamos desde el cliente ;)
  const nombre = req.body.nombre;
  const web = req.body.web;
  // Aquí hacer algo con las dos variables y responder la petición
});

app.get('/getPkey', (req, res) => {
  let response = {
          n: bigintConversion.bigintToBase64(publicKey.n),
          g: bigintConversion.bigintToBase64(publicKey.g),
}
  res.json(response)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


