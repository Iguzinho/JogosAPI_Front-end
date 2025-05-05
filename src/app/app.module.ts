import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { PrincipalComponent } from './paginas/principal/principal.component';
import { IncluirJogoComponent } from './paginas/incluir-jogo/incluir-jogo.component';

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    IncluirJogoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
