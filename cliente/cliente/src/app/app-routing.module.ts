import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';

const routes: Routes = [{ path: 'home', component: HomeComponent },{path: '', redirectTo: 'login', pathMatch: 'full'},
{ path: 'rsa', loadChildren: () => import('./components/pages/rsa/rsa.module').then(m => m.RsaModule) },
{ path: 'resultado', loadChildren: () => import('./components/pages/resultado/resultado.module').then(m => m.ResultadoModule) },
{ path: 'login', loadChildren: () => import('./components/pages/login/login.module').then(m => m.LoginModule) }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
