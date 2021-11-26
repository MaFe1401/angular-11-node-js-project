import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RsaRoutingModule } from './rsa-routing.module';
import { RsaComponent } from './rsa.component';


@NgModule({
  declarations: [
    RsaComponent
  ],
  imports: [
    CommonModule,
    RsaRoutingModule
  ]
})
export class RsaModule { }
