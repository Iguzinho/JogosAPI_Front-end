import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./paginas/principal/principal.component').then(m => m.PrincipalComponent)
  },
  {
    path: 'incluir-jogo',
    loadComponent: () =>
      import('./paginas/incluir-jogo/incluir-jogo.component').then(m => m.IncluirJogoComponent)
  },
  {
    path: 'editar-jogo/:id',
    loadComponent: () =>
      import('./paginas/editar-jogo/editar-jogo.component').then(m => m.EditarJogoComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
