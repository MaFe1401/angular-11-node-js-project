import { Component, OnInit } from '@angular/core';
import * as myRsa from 'my-rsa' 
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit{
  constructor(private router: Router) { }

  ngOnInit(): void {
    myRsa.generateKeys()
  }
  message: string = '';


  clickme(message:string) {
    console.log('it does nothing',message);
  }
}
