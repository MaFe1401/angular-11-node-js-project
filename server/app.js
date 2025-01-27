//cookies
const cookieParser = require("cookie-parser");
//librerias
const express = require('express')
const paillierBigint = require('paillier-bigint')
const bigintConversion = require('bigint-conversion')
const myrsa = require('my-rsa')
const shamir = require('shamirs-secret-sharing')
const bcu = require('bigint-crypto-utils')
const database = require('./database')
const cors = require('cors');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const CryptoJS = require('crypto-js')

//express, cors
const app = express()
const port = 3000
app.use(cookieParser());
app.use(bodyParser.json())
app.use(cors());
//Database
database.startDatabase();
const Schema = mongoose.Schema;
const votoSchema = new Schema({
  voto1: String,
  voto2: String,
  voto3: String,
  voto4: String,
  voto5: String,
  pkey: String,
});
const voto = mongoose.model('voto', votoSchema);
const codigoSchema = new Schema({
  valor: String,
  usado: Boolean
});
const codigo = mongoose.model('codigo', codigoSchema)
//claves Paillier
const publicKey = new paillierBigint.PublicKey(4418583824795316470876050091126554123218551982026156617114834668942573993160579074242473398749295430400047312384307661816992304738677044600351001535035705214449461892598158785884006500290290645398003998715624907282951186522379947787193350486912380680945090649319850983185838082886616073977175968917051932184112860975967376435497616796626766365032603701592711640942052258313749838523980490744150829542733066813586609490975083986494129662842840908986001593969156240877570376469416274500614471798110287685744857337311460584782751249267717553162636410866091518134494391558852665102048711043394882099546166595832072865467172523809378532792520444823075303859593574583076943002752077944182281654324953785520609680807795208670852992933996000661016059761910619027690028642226786299376306135529236845935209789540874214465886230740250958189327784945751759136269019343377534662080741243080307862513340444523313053288244727993939347542437n,3323027412902556152340258168724992625431893964613742279611601750166696400612113196588654690618019201743182923535847512411817290880872432064810773688320713205621615296224776413565584909953240345220042512601186528518994400709967071583142635691981142612951755464352463346439521826907703000847205173832176629174302360506287734073644713597549523670099661699301297469408053460245764210758963721118793997054187078604937884921184295686219594921781512515824891535873410392011871079953355369538832728650333035687260005296287798810382226467765576798525260123332239750100122984203329048623073513720977579025854678457125640081940274635229433980147620532588915913782115365653158104314348407519112747221613392950373435728687355014875869071982695453937267994945065815849308945867648724798939339920700258345155888196920552031594462107881817618688859829418718533300181712483473892948412427590054612472166471266561554372245608819292218853370482953420536533973939203479253327886700876658160461668350119096056556761003298942101406076742311122416998127007679950395766685793361475669270211359921885771362545543865409024472021607591906788475521779087087593660275626174633223424876991796649962049783389644835532292483927838173936955521841095242038747180099185724160645558621321923999229615284020606780941214827212200421178468020813908617600487648676500586187195240467141796085048145169031099370217939734258138689390862008896351357038123033639873120638082555794023179823126057796274500605304449132826790541243020007705813364602323555708066609983428115189176649749234115506171111195556342084994457371576637392926435606188419757439631341520129678432065272035096574417604122093934200498235173929735072091740171825476096379026349986776690415983928861700620159964898504378126208774762272212704130178195620542548722153569208392435287716397671499024499125172441702296068730411319514n)
const privateKey = new paillierBigint.PrivateKey(736430637465886078479341681854425687203091997004359436185805778157095665526763179040412233124882571733341218730717943636165384123112840766725166922505950869074910315433026464314001083381715107566333999785937484547158531087063324631198891747818730113490848441553308497197639680481102678996195994819508655364018810162661229405916269466104461060838767283598785273490342043052291639753996748457358471590455511135597768248495847331082354943807140151497666932328192706081182233550238721233164443962460841134263327987406782762953546633294652374239896669114830901190475993478068870971693210046386023693859754846508807951560488610084920206262080832686736375097118273690146963526009030880479555002539052993299720193852895328290070069304366346864392045200246463442223130747562976383833946110930010765433268101225605010730461652804803356445565300861451201689011387373034505495201687181825476935303984204247929494046769950972681923883266n,2379517159575924918234266146379079462079588060244519338399953112814649984540569891830014570445333896008332622308735680089587536348998299260419880410683766204729886841960208315686853976995143158105643656673598624263692420905104714117460810101401315864374327287407147460789119105545755089900837948226587233191731463890133232255918474546903194870576600745564852615883645623217226137050496712449464599215419061372232060045475486577495617318886702889226439362141729467451992508836680123731353217425500903121412932391221909533899277318753089839056892408325026484074059026446364755305942354974801758576574095638686719347872261910205882838735628394391257490761123631968558110981800508063638916387250102865140765089202264214495055637594367837417746950974373306341340617328266775882865346681278634566984776388211989384623985436966544135978037514633477224631725717594464344412059709626451453537585362739591143575812201575191454072229455n, publicKey)
//claves RSA
const pubKey = new myrsa.PublicKey(65537n, 42770351785584271670092515465841059433591403554961894929818576092270394762619167415086469122894755666157145496110139614081729552931510763282318796748568400777958348255231678598398932732948019362655165441540012002681181083883123927937282180553905079331971954009872835367773034876863749366962436882044548707576117837417237548620024898506018022494695863059544170213152681036173267627244969242884912011477520018612975218766032990601236563541543911534526478302779780324897079211829038648437593487135772037820036095065180165034658483606541825227727251717138542129080319144627737949542042187805393811756613307552344846036569n)
const privKey = new myrsa.PrivateKey(38078711048495828057533272691775548710365003198573578976227997586581518739174865806116625728712989663990373764545744025549548437591708348200203505694271465715432712879690220529767626334773502506556656441139762581937555180774410103411577287195923731157390475190626061584125319117372568900979969592650492515519845393060950261250715174142769510664115270252735136303391814434359725163198976137082286301397912758508702118130957282660842688127997216992525035654374088605112746347297125366447715080190676622347467277807634532167839632725539857344522220533446606824778646117643017956855517997810400828325782007852749201738753n,pubKey)

//nonce
let nonce = 0n;
//Codigo de votacion
const code = "balondeoro2022"
//Crear secreto
const secret =Buffer.from('ESTE ES EL SECRETO DE PRUEBA') 
const shares = shamir.split(secret, { shares: 3, threshold: 2 })
app.get('/', (req, res) => {
  res.send('Hello World!')
})
//Votar. Recibe las puntuaciones para cada candidato (cifradas con paillier y en Hex) y las convierte en un voto que guarda en la base de datos.
app.post('/vote', (req, res) => {
  console.log("Petición de voto recibida")
  console.log(JSON.stringify(req.body))
  if(req.body.certificado_n=='' || req.body.certificado_e=='' || req.body.certificado_sign=='' || req.body.voto1=='' || req.body.voto2=='' || req.body.voto3=='' || req.body.voto4=='' || req.body.voto5=='' || req.body.sign==''){
    let response = {
      message: "Petición no válida"
    }
    res.json(response)
  }
  let pubKeyClient_n = bigintConversion.hexToBigint(req.body.certificado_n);
  let pubKeyClient_e = bigintConversion.hexToBigint(req.body.certificado_e);
  let pubKeyClient = new myrsa.PublicKey(pubKeyClient_e, pubKeyClient_n)
  let hashreceived = bigintConversion.bigintToHex(pubKey.verify(bigintConversion.hexToBigint(req.body.certificado_sign)))
  let hash = CryptoJS.SHA256(bigintConversion.bigintToHex(pubKeyClient_n)).toString(CryptoJS.enc.Hex)
  if(hash[0]=='0')hashreceived = '0' + hashreceived
  console.log("[CERTIFICADO] Hash recibido: " + hashreceived)
  console.log("[CERTIFICADO] Hash calculado: " + hash)
  if(hashreceived!=hash){ //Comprobamos que el certificado sea válido
    let response = {
      message: "Autentificación no válida."
    }
    res.json(response)
  }
  else{
    let votos={
      voto1: req.body.voto1,
      voto2: req.body.voto2,
      voto3: req.body.voto3,
      voto4: req.body.voto4,
      voto5: req.body.voto5,
    }
    let hash_votos = CryptoJS.SHA256(JSON.stringify(votos)).toString(CryptoJS.enc.Hex)
    let hash_votos_verify = bigintConversion.bigintToHex(pubKeyClient.verify(bigintConversion.hexToBigint(req.body.sign)))
    console.log("[VOTOS] Hash votos recibidos: " + hash_votos)
    console.log("[VOTOS] Hash votos firma: " + hash_votos_verify)
    if (hash_votos != hash_votos_verify){ //comprobamos que el voto sea emitido por el cliente poseedor del certificado
      let response = {
        message: "Firma de los votos no válida."
      }
      res.json(response)
    }
    else{
        //comprobamos si el cliente ha votado con anterioridad
        voto.findOne({pkey: req.body.certificado_n}, function(err,q){
          if (q==null){
            const votox = new voto();
            votox.voto1 = req.body.voto1
            votox.voto2 = req.body.voto2
            votox.voto3 = req.body.voto3
            votox.voto4 = req.body.voto4
            votox.voto5 = req.body.voto5
            votox.pkey = req.body.certificado_n
            votox.save()
            console.log("Voto emitido correctamente.")
            let response = {
              message: "Voto emitido correctamente."
            }
            res.json(response)
          }
          else{
            q.voto1 = req.body.voto1
            q.voto2 = req.body.voto2
            q.voto3 = req.body.voto3
            q.voto4 = req.body.voto4
            q.voto5 = req.body.voto5
            q.pkey = req.body.certificado_n
            q.save()
            console.log("Voto actualizado correctamente.")
            let response = {
              message: "Voto actualizado correctamente."
            }
            res.json(response)
          }
        })
      }
  }
})

//Obtener el resultado de la votación
app.get('/result', (req, res) => {
  let suma1=publicKey.encrypt(BigInt(0))
  let suma2=publicKey.encrypt(BigInt(0))
  let suma3=publicKey.encrypt(BigInt(0))
  let suma4=publicKey.encrypt(BigInt(0))
  let suma5=publicKey.encrypt(BigInt(0))
  let result = voto.find({}, function (err, docs) {
    for (let i = 0;i<docs.length;i++){
      suma1=publicKey.addition(suma1,bigintConversion.hexToBigint(docs[i].voto1))
      suma2=publicKey.addition(suma2,bigintConversion.hexToBigint(docs[i].voto2))
      suma3=publicKey.addition(suma3,bigintConversion.hexToBigint(docs[i].voto3))
      suma4=publicKey.addition(suma4,bigintConversion.hexToBigint(docs[i].voto4))
      suma5=publicKey.addition(suma5,bigintConversion.hexToBigint(docs[i].voto5))
    }
    console.log("suma1 es: "+privateKey.decrypt(suma1))
    console.log("suma2 es: "+privateKey.decrypt(suma2))
    console.log("suma3 es: "+privateKey.decrypt(suma3))
    console.log("suma4 es: "+privateKey.decrypt(suma4))
    console.log("suma5 es: "+privateKey.decrypt(suma5))
    let response = {
      suma1: ""+privateKey.decrypt(suma1),
      suma2: ""+privateKey.decrypt(suma2),
      suma3: ""+privateKey.decrypt(suma3),
      suma4: ""+privateKey.decrypt(suma4),
      suma5: ""+privateKey.decrypt(suma5)
    }
    res.json(response)
  });
})
app.post('/decryptRSA', (req,res) =>{
  console.log("Texto recibido en base64: "+req.body.message)
  console.log("Texto recibido en bigint: "+bigintConversion.base64ToBigint(req.body.message))
  console.log("Mensaje: "+bigintConversion.bigintToText(privKey.decrypt(bigintConversion.base64ToBigint(req.body.message))))
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
  //console.log("Clave pública server bigint: "+"Public modulous: "+bigintConversion.hexToBigint(response.n)+"Exponente público: "+pubKey.e)
  console.log("Clave pública enviada al cliente.")
  res.json(response)
})
//Firmar texto
app.post('/signText', (req,res)=>{
  console.log("Texto en hex: "+req.body.text)
  const plaintext =  bigintConversion.hexToBigint(req.body.text)
  let signed = privKey.sign(plaintext)
  console.log("Texto en bigint" + plaintext)
  console.log("Firma en bigint: "+signed)
  console.log("Firma en hex: "+bigintConversion.bigintToHex(signed))
  
  let response = {
    signed: bigintConversion.bigintToHex(signed)
  }
  //console.log(bigintConversion.bigintToBase64(signed))
  res.json(response)
})
//Registrarse. 
app.post('/register', (req,res)=>{
  const ciegoHex = req.body.ciegoHex
  console.log("Código recibido: "+req.body.codigo)

  codigo.findOne({valor: req.body.codigo}, function(err,q){
    if(q == null || q.usado==true){
      console.log("Código no válido o ya usado.")
      let answer = {
        message: "NO"
      }
      res.json(answer)
    }
    else {
      //SI EL CÓDIGO EXISTE, LO MARCAMOS COMO USADO
      console.log("El código es válido.")
      q.usado = true;
      q.save();
      ciegoBigint = bigintConversion.hexToBigint(ciegoHex)
      const firma = privKey.sign(ciegoBigint)
      console.log("Firma del servidor del hash cegado de la clave pública del cliente: " + bigintConversion.bigintToHex(firma))
      let certificado = {
        n:bigintConversion.bigintToHex(pubKey.n),
        e:bigintConversion.bigintToHex(pubKey.e),
        sign: bigintConversion.bigintToHex(firma),
        message: "OK"
      }
      res.json(certificado)
    }
  })
})
/*
app.post('/login', (req,res)=>{
  const signed = bigintConversion.hexToBigint(req.body.sign)
  const n = pubKey.verify(signed)
  const e = 65537n
  this.pubKeyClient = new myrsa.PublicKey(e,n)
  this.nonce = BigInt(Math.floor(Math.random() * 1000));
  console.log("nonce: "+this.nonce)
  const nonceEncrypted = this.pubKeyClient.encrypt(this.nonce)
  let response = {
    nonce: bigintConversion.bigintToHex(nonceEncrypted)
  }
  res.json(response)
})
app.post('/checkNonce', (req,res)=>{
  const nonce = bigintConversion.hexToBigint(req.body.nonce)
  console.log("Nonce recibido: "+nonce)
  console.log("Nonce guardado: "+this.nonce)
  let reply
  if(this.nonce === nonce){
     reply = "OK"
     tokens.push(req.body.sign)
  }
  else {
    reply = "INTRUSO DETECTADO"
  }
  let response = {
    res: reply
  }
  res.json(response)
})
*/
//Send secret
app.get('/getSecret', (req,res)=>{
  let response = {
    share0: shares[0].toString('hex'),
    share1: shares[1].toString('hex'),
    share2: shares[2].toString('hex')
  }
  console.log(response)
  res.json(response)
})
app.get('/makeCodes', (req,res)=>{
  codigo.collection.drop()
  makeCodes()
  res.json("done")
})
//Listen requests
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
//Crear códigos de votación aleatoriamente
function makeCodes() {
  const length = 5
  //Crea un codigo aleatorio
  for(var j=0; j<10;j++){
    var result           = 'balondeoro2022';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
      charactersLength));
  }
  //Guarda el código no usado en la base de datos
  const codigox = new codigo()
  codigox.valor = result;
  codigox.usado = false;
  codigox.save()
 }
  
 return result;
}

