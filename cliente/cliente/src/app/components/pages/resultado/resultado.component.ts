import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css']
})
export class ResultadoComponent implements OnInit {
 resultado1 : string = ""
 resultado2 : string = ""
 resultado3 : string = ""
 resultado4 : string = ""
 resultado5 : string = ""
  constructor(private http: HttpClient) { 
    
  }

  ngOnInit(): void {
  }
  resultClick(){
  
    this.http.get('http://localhost:3000/result').toPromise().then((data:any) => {
      this.resultado1=data.suma1
      this.resultado2=data.suma2
      this.resultado3=data.suma3
      this.resultado4=data.suma4
      this.resultado5=data.suma5
      console.log(data)
    })

  }

}
