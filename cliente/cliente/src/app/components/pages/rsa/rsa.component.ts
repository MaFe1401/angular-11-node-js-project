import { Component, OnInit } from '@angular/core';
//import * as myRsa from 'my-rsa' 
import { FormControl, FormGroup, FormBuilder, Validators, PatternValidator} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import * as paillierBigint from 'paillier-bigint'
import * as bigintConversion from 'bigint-conversion'
import { listenerCount } from 'process';
import * as myrsa from 'my-rsa';

@Component({
  selector: 'app-rsa',
  templateUrl: './rsa.component.html',
  styleUrls: ['./rsa.component.css']
})
export class RsaComponent implements OnInit {
  publicKey : myrsa.PublicKey;
  constructor(private router: Router, private http: HttpClient) { 
    this.publicKey = new myrsa.PublicKey(BigInt(0), BigInt(0))
    }

  ngOnInit(): void {
    var req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:3000/getRSAkey', false);
    req.send(null);
    if(req.status == 200){
      let json = JSON.parse(req.response)
      this.publicKey = new myrsa.PublicKey(bigintConversion.base64ToBigint(json['e']),bigintConversion.base64ToBigint(json['n']))
      console.log(this.publicKey.n+"$$$$"+this.publicKey.e)
      }
    }
    clickEncrypt(message: string): void {
      console.log(message)
      let encryptedMessage = this.publicKey.encrypt(BigInt(message))
      let json = {
        message: bigintConversion.bigintToBase64(encryptedMessage)
      }
      console.log(encryptedMessage)
      console.log(bigintConversion.bigintToBase64(encryptedMessage))
      let url = 'http://localhost:3000/decryptRSA'
      this.http.post(url,json).toPromise().then((data:any) => {
      })

    }

  }


