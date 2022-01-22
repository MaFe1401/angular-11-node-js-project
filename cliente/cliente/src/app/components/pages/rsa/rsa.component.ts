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
    //Conseguir clave pública del servidor
    req.open('GET', 'http://localhost:3000/getRSAkey', false);
    req.send(null);
    if(req.status == 200){
      let json = JSON.parse(req.response)
      this.publicKey = new myrsa.PublicKey(bigintConversion.hexToBigint(json['e']), bigintConversion.hexToBigint(json['n']))
      console.log("Clave pública del servidor: "+"Public modulous bigint: "+bigintConversion.hexToBigint(json['n'])+"Exponente público bigint: "+bigintConversion.hexToBigint(json['e']))
      this.r = bcu.randBetween(this.publicKey.n, BigInt(128))
      }
    }
    clickEncrypt(message: string): void {
      //Encriptar con la clave pública del servidor
      console.log("Texto a enviar: "+message)
      let encryptedMessage = this.publicKey.encrypt(bigintConversion.textToBigint(message))
      console.log("Mensaje encriptado RSA bigint: "+encryptedMessage)
      let json = {
        message: bigintConversion.bigintToBase64(encryptedMessage)
      }
      console.log("Mensaje encriptado RSA en base64: "+bigintConversion.bigintToBase64(encryptedMessage))
      let url = 'http://localhost:3000/decryptRSA'
      this.http.post(url,json).toPromise().then((data:any) => {
      })

    }
    askRSASignedMsg(text: string):void {
      //El servidor firma con su clave privada el texto y el cliente verifica con la clave pública del servidor
      let url = 'http://localhost:3000/signText'
      let textBigint = bigintConversion.textToBigint(text)
      let json = {
        text:bigintConversion.bigintToHex(textBigint)
      }
      console.log("Texto enviado en base64: "+bigintConversion.bigintToHex(textBigint))
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
    //Pedirle al servidor que firme un texto cegado
    askRSASignedBlindedMsg(texto: string):void {
      let url = 'http://localhost:3000/signText'
      console.log("Mensaje a cegar: "+texto)
      const blindedMessage = this.blinding(bigintConversion.textToBigint(texto))
      console.log("Mensaje cegado: "+blindedMessage)
      let json = {
        text: bigintConversion.bigintToHex(blindedMessage)
      }
      console.log("Mensaje cegado y en hex: "+bigintConversion.bigintToHex(blindedMessage))
      this.http.post(url,json).toPromise().then((data:any) => {
        console.log("Mensaje firmado por el servidor en hex: "+data['signed'])
        let signed = bigintConversion.hexToBigint(data['signed'])
        console.log("Mensaje firmado por el servidor en bigint: "+signed)
        let descegado = this.unblinding(signed)
        console.log("Mensaje descegado en bigint: "+descegado)
        const verificado = this.publicKey.verify(descegado)
        console.log("Mensaje verificado en bigint: "+verificado)
        const textox = bigintConversion.bigintToText(verificado)
        console.log("Mensaje verificado en texto: "+textox)
        console.log("texto original: "+texto)
        if (textox == texto){
          alert("firma verificada OK")
        }
        else alert("verificación de firma errónea")
      })
    
    }
    //Cegar con la clave pública RSA del servidor y un número random r
    blinding(m: bigint):bigint {
     
      const bm = m * this.publicKey.encrypt(this.r) % this.publicKey.n
      return bm
    }
    //Descegar
    unblinding (signedBlindedMessage: bigint): bigint {
      const s = signedBlindedMessage * bcu.modInv(this.r,this.publicKey.n) % this.publicKey.n
      return s
    }
    //Obtener secreto del servidor
    partsClick ():void {
      this.http.get('http://localhost:3000/getSecret').toPromise().then((data:any) => {
        this.parte0=data.share0
        this.parte1=data.share1
        this.parte2=data.share2
        console.log("Parte 0: "+data.share0)
        console.log("Parte 1: "+data.share1)
        console.log("Parte 2: "+data.share2)
      })
    }
    //Unir partes para revelar el secreto
    joinParts (part1:string, part2:string): void {
      let buff1 = Buffer.from(part1,"hex")
      let buff2 = Buffer.from(part2, "hex")
      this.recovered = shamir.combine([buff1,buff2])
    }
  
  }


