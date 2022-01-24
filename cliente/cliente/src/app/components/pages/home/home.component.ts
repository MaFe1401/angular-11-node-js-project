import { Component, OnInit } from '@angular/core';
//import * as myRsa from 'my-rsa' 
import { FormControl, FormGroup, FormBuilder, Validators, PatternValidator} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import * as paillierBigint from 'paillier-bigint'
import * as bigintConversion from 'bigint-conversion'
import { listenerCount } from 'process';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { CookieService } from 'ngx-cookie-service';
import * as myrsa from 'my-rsa'
import * as CryptoJS from 'crypto-js'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

 
export class HomeComponent implements OnInit{
  publicKey : paillierBigint.PublicKey;
  publicRSA : myrsa.PublicKey;
  privateRSA : myrsa.PrivateKey;

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) { 
  this.publicKey = new paillierBigint.PublicKey(BigInt(0), BigInt(0))
  this.publicRSA = new myrsa.PublicKey(BigInt(0), BigInt(0))
  this.privateRSA = new myrsa.PrivateKey(BigInt(0), this.publicRSA)
  }

  ngOnInit(): void {
    //Recuperamos el par de claves del cliente del localstorage
    let pub_n = bigintConversion.hexToBigint(this.cookieService.get("pubkey_n"))
    let pub_e = BigInt(65537)
    this.publicRSA = new myrsa.PublicKey(pub_e, pub_n)
    let priv_d = bigintConversion.hexToBigint(this.cookieService.get("privkey_d"))
    this.privateRSA = new myrsa.PrivateKey(priv_d, this.publicRSA)
    
    var req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:3000/getPkey', false);
    req.send(null);
    if(req.status == 200){
      let json = JSON.parse(req.response)
      console.log("Clave pública server paillier: n: "+json['n']+" g: "+json['g'])
      this.publicKey = new paillierBigint.PublicKey(bigintConversion.hexToBigint(json['n']), bigintConversion.hexToBigint(json['g']))
      }
    }
    rsaClick(){
        this.router.navigateByUrl('/rsa');
    };
    resultClick(){
      this.router.navigateByUrl('/resultado');
  };
  async clickme(c1:string, c2:string, c3:string, c4:string, c5:string) {
    if(c1.includes("-") || c1.includes(".") || c1.includes(",") || c2.includes("-") || c2.includes(".") || c2.includes(",") ||c3.includes("-") || c3.includes(".") || c3.includes(",")){
      alert("No se permiten números decimales ni negativos.")
    }
    else{
      let vot1 = parseInt(c1, 10);
      let vot2 = parseInt(c2, 10);
      let vot3 = parseInt(c3, 10);
      let vot4 = parseInt(c4, 10);
      let vot5 = parseInt(c5, 10);
      if(isNaN(vot1) || isNaN(vot2)|| isNaN(vot3)|| isNaN(vot4)|| isNaN(vot5)){
        alert("Introduce los cinco valores correctamente.")
      }
      else{
        let votos = '' + vot1 + '' + vot2 + '' + vot3 + '' + vot4 + '' + vot5
        console.log("Los votos son "+votos)
        if ((votos.length != 5) || !(votos.includes("1"))|| !(votos.includes("2"))|| !(votos.includes("3"))|| !(votos.includes("4"))|| !(votos.includes("6"))){
            alert("Los valores introducidos no son correctos")
        }
        else{
          
          let enc1 = this.publicKey.encrypt(BigInt(vot1))
          let enc2 = this.publicKey.encrypt(BigInt(vot2))
          let enc3 = this.publicKey.encrypt(BigInt(vot3))
          let enc4 = this.publicKey.encrypt(BigInt(vot4))
          let enc5 = this.publicKey.encrypt(BigInt(vot5))
          let jsontemporal = {
            voto1: bigintConversion.bigintToHex(enc1),
            voto2: bigintConversion.bigintToHex(enc2),
            voto3: bigintConversion.bigintToHex(enc3),
            voto4: bigintConversion.bigintToHex(enc4),
            voto5: bigintConversion.bigintToHex(enc5),
          }
          //Firmamos los votos con la clave privada del cliente
          let hashvotes = CryptoJS.SHA256(JSON.stringify(jsontemporal)).toString(CryptoJS.enc.Hex)
          let sign = this.privateRSA.sign(bigintConversion.hexToBigint(hashvotes))
          console.log("Firma de los votos encriptados (Paillier): " + sign )
          let json = {
            voto1: bigintConversion.bigintToHex(enc1),
            voto2: bigintConversion.bigintToHex(enc2),
            voto3: bigintConversion.bigintToHex(enc3),
            voto4: bigintConversion.bigintToHex(enc4),
            voto5: bigintConversion.bigintToHex(enc5),
            sign: bigintConversion.bigintToHex(sign),
            certificado_sign: this.cookieService.get("certificado_sign"),
            certificado_n: this.cookieService.get("certificado_n"),
            certificado_e: this.cookieService.get("certificado_e")
          }
          let url = 'http://localhost:3000/vote'
          this.http.post(url,json).toPromise().then((data:any) => {
            const mensaje = data.message
            alert(mensaje)
          })
        }
      }
    }
}
}
