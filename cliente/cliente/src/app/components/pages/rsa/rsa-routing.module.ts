import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RsaComponent } from './rsa.component';

const routes: Routes = [{ path: '', component: RsaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RsaRoutingModule { }
