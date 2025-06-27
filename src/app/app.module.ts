// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ApiModule } from './api/api.module'; // Importe o ApiModule gerado pelo ng-openapi-gen
import { HttpClientModule } from '@angular/common/http'; // <--- ADICIONE ESTA LINHA

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ApiModule, // Já estava aqui, mas é importante para os serviços do ng-openapi-gen
    HttpClientModule // <--- ADICIONE ESTA LINHA
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
