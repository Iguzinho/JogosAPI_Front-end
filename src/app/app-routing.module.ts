import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './paginas/principal/principal.component';
import { IncluirJogoComponent } from './paginas/incluir-jogo/incluir-jogo.component';

const routes: Routes = [
  { path: '', component: PrincipalComponent },
  { path: 'incluir-jogo', component: IncluirJogoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
