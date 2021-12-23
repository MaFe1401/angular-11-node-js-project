import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultadoRoutingModule } from './resultado-routing.module';
import { ResultadoComponent } from './resultado.component';


@NgModule({
  declarations: [
    ResultadoComponent
  ],
  imports: [
    CommonModule,
    ResultadoRoutingModule
  ]
})
export class ResultadoModule { }
