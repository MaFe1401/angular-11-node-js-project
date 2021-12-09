const express = require('express')
const paillierBigint = require('paillier-bigint')
const bigintConversion = require('bigint-conversion')
const myrsa = require('my-rsa')
const bcu = require('bigint-crypto-utils')
const app = express()
const port = 3000
const { publicKey, privateKey } = paillierBigint.generateRandomKeysSync(3072)
const { pubKey, privKey } = myrsa.generateKeys(2048)
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
app.post('/decryptRSA', (req,res) =>{
  console.log(req.body.message)
  console.log(bigintConversion.base64ToBigint(req.body.message))
  console.log("Message: "+bigintConversion.bigintToText(privKey.decrypt(bigintConversion.base64ToBigint(req.body.message))))
  res.json("received and decrypted:");
})

app.post("/usuario", async (req, res) => {
  // Dentro de req.body tenemos a todo el objeto. Podemos acceder a las claves del mismo como
  // lo enviamos desde el cliente ;)
  const nombre = req.body.nombre;
  const web = req.body.web;
  // Aquí hacer algo con las dos variables y responder la petición
});
//Get Paillier public key
app.get('/getPkey', (req, res) => {
  let response = {
          n: bigintConversion.bigintToHex(publicKey.n),
          g: bigintConversion.bigintToHex(publicKey.g),
}
  res.json(response)
})
//Get RSA public key
app.get('/getRSAkey', (req,res) => {

  let response = {
        n:bigintConversion.bigintToHex(pubKey.n),
        e:bigintConversion.bigintToHex(pubKey.e),

  }
  console.log(response.n)
  console.log(bigintConversion.hexToBigint(response.n)+"$$$$$"+pubKey.e)
  res.json(response)
})
//Firmar texto
app.post('/signText', (req,res)=>{
  console.log("Texto: "+req.body.text)
  const plaintext =  bigintConversion.hexToBigint(req.body.text)
  let signed = privKey.sign(plaintext)
  console.log("plaintext (bigint)" + plaintext)
  console.log("Firma (en bigint): "+signed)
  console.log("Firma (en hex): "+bigintConversion.bigintToHex(signed))
  
  let response = {
    signed: bigintConversion.bigintToHex(signed)
  }
  //console.log(bigintConversion.bigintToBase64(signed))
  res.json(response)
})
//Listen requests
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


