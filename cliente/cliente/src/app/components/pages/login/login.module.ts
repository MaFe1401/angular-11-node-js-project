import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { RequestOptions } from 'https';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
  ],
  providers: [
    CookieService
  ]
})
export class LoginModule { }
