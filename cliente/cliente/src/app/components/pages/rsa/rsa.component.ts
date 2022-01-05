import { Component, OnInit } from '@angular/core';
//import * as myRsa from 'my-rsa' 
import { FormControl, FormGroup, FormBuilder, Validators, PatternValidator} from '@angular/forms';
import { Data, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import * as paillierBigint from 'paillier-bigint'
import * as bigintConversion from 'bigint-conversion'
import * as bcu from 'bigint-crypto-utils'
import { listenerCount } from 'process';
import * as myrsa from 'my-rsa';
import * as shamir from 'shamirs-secret-sharing-ts'

@Component({
  selector: 'app-rsa',
  templateUrl: './rsa.component.html',
  styleUrls: ['./rsa.component.css']
})
export class RsaComponent implements OnInit {
  publicKey : myrsa.PublicKey;
  r : bigint;
  parte1 : string = ""
  parte2 : string = ""
  parte0 : string = ""
  recovered: any
  parts: any [] = []
  constructor(private router: Router, private http: HttpClient) { 
    this.publicKey = new myrsa.PublicKey(BigInt(0), BigInt(0))
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
      this.publicKey = new myrsa.PublicKey(bigintConversion.hexToBigint(json['e']), bigintConversion.hexToBigint(json['n']))
      console.log(bigintConversion.hexToBigint(json['n'])+"$$$$"+bigintConversion.hexToBigint(json['e']))
      this.r = bcu.randBetween(this.publicKey.n, BigInt(128))
      }
    }
    clickEncrypt(message: string): void {
      console.log(message)
      let encryptedMessage = this.publicKey.encrypt(bigintConversion.textToBigint(message))
      let json = {
        message: bigintConversion.bigintToBase64(encryptedMessage)
      }
      console.log(encryptedMessage)
      console.log(bigintConversion.bigintToBase64(encryptedMessage))
      let url = 'http://localhost:3000/decryptRSA'
      this.http.post(url,json).toPromise().then((data:any) => {
      })

    }
    askRSASignedMsg(text: string):void {
      let url = 'http://localhost:3000/signText'
      let textBigint = bigintConversion.textToBigint(text)
      let json = {
        text:bigintConversion.bigintToHex(textBigint)
      }

      this.http.post(url,json).toPromise().then((data:any) => {
        console.log("Firma (en hex): "+data['signed'])
        let signed = bigintConversion.hexToBigint(data['signed'])
        console.log("Firma (en bigint): "+signed)
        let verificado = this.publicKey.verify(signed)
        console.log("Verificado: "+verificado)
        const texto = bigintConversion.bigintToText(verificado)
        console.log("texto: "+texto)
        if (texto == text){
          alert("verificación OK")
        }
        else alert("verificación errónea")
      })
    
    }
    askRSASignedBlindedMsg(texto: string):void {
      let url = 'http://localhost:3000/signText'
      
      const blindedMessage = this.blinding(bigintConversion.textToBigint(texto))
      console.log("Cegado: "+blindedMessage)
      let json = {
        text: bigintConversion.bigintToHex(blindedMessage)
      }

      this.http.post(url,json).toPromise().then((data:any) => {
        console.log("Firma (en hex): "+data['signed'])
        let signed = bigintConversion.hexToBigint(data['signed'])
        console.log("Firma (en bigint): "+signed)
        let descegado = this.unblinding(signed)
        console.log("Descegado: "+descegado)
        const verificado = this.publicKey.verify(descegado)
        const textox = bigintConversion.bigintToText(verificado)
        console.log("texto: "+texto)
        if (textox == texto){
          alert("firma verificada OK")
        }
        else alert("verificación de firma errónea")
      })
    
    }
    //Firma ciega
    blinding(m: bigint):bigint {
     
      const bm = m * this.publicKey.encrypt(this.r) % this.publicKey.n
      return bm
    }
    
    unblinding (signedBlindedMessage: bigint): bigint {
      const s = signedBlindedMessage * bcu.modInv(this.r,this.publicKey.n) % this.publicKey.n
      return s
    }
    partsClick ():void {
      this.http.get('http://localhost:3000/getSecret').toPromise().then((data:any) => {
        this.parte0=data.share0
        this.parte1=data.share1
        this.parte2=data.share2
        console.log(data.share0)
      })
    }
    joinParts (part1:string, part2:string): void {

      //let partes1 = part1.split(",").map(Number)
      //let partes2 = part1.split(",").map(Number)
      let buff1 = Buffer.from(part1,"hex")
      let buff2 = Buffer.from(part2, "hex")
      console.log(buff1)
     //this.recovered = shamir.combine(this.parts.slice(0,2)).toString()
     this.recovered = shamir.combine([buff1,buff2])
    }
  
  }


