import { Component, OnInit } from '@angular/core';
import * as myrsa from 'my-rsa';
import * as bigintConversion from 'bigint-conversion'
import * as bcu from 'bigint-crypto-utils'
import { Data, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  publicKey = new myrsa.PublicKey(BigInt("65537"),BigInt("32130391117724744728511475104754973338103394088710687429632290957811088800447243911655403310663685272980723750409329769872398460131960668062543528680359231980364241737537539666895972761135648964632206363470126105749571411536931709843115471484886529826746763191274561010062059979131213821682521490382340241439496534270154932350352313538161693475726479704966898422981388218452670418588841996581981782632642289951959572299364983616336809126154760415162755965981441755200904677582027440088428929389726922732934912735736829780037065535088247168162276475912040325739419991574776112095485030248012098677762440928163425048289"))
  privateKey = new myrsa.PrivateKey(BigInt("8235444252796744769359838851483498514327186381771550840639077521237021372200631753482574191869151551269209722132168415922555950582063190291203536853573925855717511218199728265323688152365177400672777247868702844566905726093617023390522204098495871462375331920701742158582518020804219445147367075017815148323765339568714285314998238096914568994129420544769853149690965997015726340696403448354669949148792201083204783820322937359425011306319347660349738482797814511496604087319293062894506052884811203831090400983740924294614407147436386075718177662837886452832072120628283856855614429346264017943220837743698851006553"),this.publicKey)
  publicKeyServer : myrsa.PublicKey;
  
  r : bigint;
  cert : any;
  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) { 
    this.publicKeyServer = new myrsa.PublicKey(BigInt(0), BigInt(0))
    this.r = BigInt(0)
    }

  ngOnInit(): void {
    var req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:3000/getRSAkey', false);
    req.send(null);
    if(req.status == 200){
      let json = JSON.parse(req.response)
      //console.log(json['n'])
      //console.log(bigintConversion.hexToBigint(json['n']))
      this.publicKeyServer = new myrsa.PublicKey(bigintConversion.hexToBigint(json['e']), bigintConversion.hexToBigint(json['n']))
      this.r = bcu.randBetween(this.publicKey.n, BigInt(128))
      }
  }
  //Registro. Se ciega la clave pública del cliente y se envia en hex al server junto con el código secreto de votación.
  //El servidor firma esa clave pública y el cliente desciega la firma. Se crea un certificado junto con la clave pública del server.
  //La firma descegada se utiliza como token de autenticación.
  register(codigo: string): void{
    const ciego = this.blinding(this.publicKey.n)
    let url = 'http://localhost:3000/register'
    let json = {
      ciegoHex: bigintConversion.bigintToHex(ciego),
      codigo: codigo
    }
    
    this.http.post(url,json).toPromise().then((data:any) => {
      const message = data.message
      if(message == "OK"){
        const signed = bigintConversion.hexToBigint(data.sign)
        const unblinded= this.unblinding(signed)
        this.cert = {
          sign: bigintConversion.bigintToHex(unblinded),
          n: data.n,
          e: data.e
        }
        this.cookieService.set('certificado_sign', this.cert.sign)
        this.cookieService.set('certificado_n', this.cert.n)
        this.cookieService.set('codigo', codigo)
        alert("Certificate obtained")
       // console.log(this.cert)
      }
      else{
        alert("El código de votación no es válido")
      }
     
    })
  }
  //Login. Se envia el certificado y se recibe un nonce, cifrado con la clave pública del cliente. El cliente desencripta el nonce y lo envia otra vez.
  login(){
    let url = 'http://localhost:3000/login'
    let urlNonce = 'http://localhost:3000/checkNonce'

    this.http.post(url,this.cert).toPromise().then((data:any) => {
      const nonce = bigintConversion.hexToBigint(data.nonce)
      const nonceDecrypted = this.privateKey.decrypt(nonce)
      console.log("nonce decrypted: "+nonceDecrypted)
      const json = {
        nonce: bigintConversion.bigintToHex(nonceDecrypted),
        sign:this.cert.sign
      }
      this.http.post(urlNonce, json).toPromise().then((data:any) => {
        const res = data.res
        alert(res)
        this.navigateToVote()
      })
      
    })
  }
  blinding(m: bigint):bigint {
     
    const bm = m * this.publicKeyServer.encrypt(this.r) % this.publicKeyServer.n
    return bm
  }
  unblinding (signedBlindedMessage: bigint): bigint {
    const s = signedBlindedMessage * bcu.modInv(this.r,this.publicKeyServer.n) % this.publicKeyServer.n
    return s
  }
  navigateToVote(){
    this.router.navigateByUrl('/home');
};



}
