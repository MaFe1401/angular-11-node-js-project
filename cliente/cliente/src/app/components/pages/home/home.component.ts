import { Component, OnInit } from '@angular/core';
//import * as myRsa from 'my-rsa' 
import { FormControl, FormGroup, FormBuilder, Validators, PatternValidator} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import * as paillierBigint from 'paillier-bigint'
import * as bigintConversion from 'bigint-conversion'
import { listenerCount } from 'process';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

 
export class HomeComponent implements OnInit{
  publicKey : paillierBigint.PublicKey;
  constructor(private router: Router, private http: HttpClient) { 
  this.publicKey = new paillierBigint.PublicKey(BigInt(0), BigInt(0))
  }

  ngOnInit(): void {
    var req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:3000/getPkey', false);
    req.send(null);
    if(req.status == 200){
      let json = JSON.parse(req.response)
      this.publicKey = new paillierBigint.PublicKey(bigintConversion.base64ToBigint(json['n']), bigintConversion.base64ToBigint(json['g']))
      }
    }

  async clickme(c1:string, c2:string, c3:string) {
    if(c1.includes("-") || c1.includes(".") || c1.includes(",") || c2.includes("-") || c2.includes(".") || c2.includes(",") ||c3.includes("-") || c3.includes(".") || c3.includes(",")){
      alert("No se permiten números decimales ni negativos.")
    }
    else{
      let vot1 = parseInt(c1, 10);
      let vot2 = parseInt(c2, 10);
      let vot3 = parseInt(c3, 10);
      if(isNaN(vot1) || isNaN(vot2)|| isNaN(vot3)){
        alert("Introduce los tres valores correctamente.")
      }
      else{
        if(vot1+vot2+vot3!=10){
          alert("La suma de los tres valores debe de ser 10.")
        }
        else{
          alert("Voto ok")
          let enc1 = this.publicKey.encrypt(BigInt(vot1))
          let enc2 = this.publicKey.encrypt(BigInt(vot2))
          let enc3 = this.publicKey.encrypt(BigInt(vot3))
          let json = {
            voto1: bigintConversion.bigintToBase64(enc1),
            voto2: bigintConversion.bigintToBase64(enc2),
            voto3: bigintConversion.bigintToBase64(enc3)
          }
          /*
          var req = new XMLHttpRequest();
          req.open('POST', 'localhost:3000/vote', false);
          req.setRequestHeader("Content-Type", "application/json");
          req.send(JSON.stringify(json));
          alert("VOTE SENT!!")
          */
          let url = 'http://localhost:3000/vote'
          this.http.post(url,json).toPromise().then((data:any) => {
          })
        }
      }
    }
}
}
