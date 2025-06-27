// src/app/paginas/incluir-jogo/incluir-jogo.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
// Mude estas importações para usar os arquivos gerados pelo ng-openapi-gen
import { JogoControllerService } from '../../api/services/jogo-controller.service'; // O serviço gerado
import { Jogo } from '../../api/models/jogo'; // O modelo Jogo gerado

@Component({
  selector: 'app-incluir-jogo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './incluir-jogo.component.html',
  styleUrls: ['./incluir-jogo.component.scss']
})
export class IncluirJogoComponent {
  // Use o tipo Jogo do modelo gerado
  jogo: Partial<Jogo> = {};

  constructor(
    private jogoControllerService: JogoControllerService, // Injetando o serviço gerado
    private router: Router
  ) {}

  salvar() {
    // Crie o objeto com base no modelo Jogo gerado.
    // O `id` geralmente não é enviado para uma operação de criação (POST),
    // pois é gerado pelo backend. Verifique a documentação Swagger do seu backend.
    const jogoParaEnviar: Jogo = {
      titulo: this.jogo.titulo || '',
      genero: this.jogo.genero || '',
      plataforma: this.jogo.plataforma || '',
      desenvolvedora: this.jogo.desenvolvedora || '',
      // Certifique-se de que a data está no formato correto (ex: 'YYYY-MM-DD' para backend)
      dataLancamento: this.jogo.dataLancamento ? new Date(this.jogo.dataLancamento).toISOString().split('T')[0] : '',
      multiplayer: this.jogo.multiplayer || false,
      classificacaoEtaria: this.jogo.classificacaoEtaria || ''
      // Remova o `id` se o backend o gera
      // id: 0 // Remova se o backend não espera um id para criação
    };

    this.jogoControllerService.create({ body: jogoParaEnviar }).subscribe({ //
      next: (response) => {
        console.log('Jogo salvo com sucesso:', response);
        this.router.navigate(['/']); // Navega para a página principal após o sucesso
      },
      error: (error) => {
        console.error('Erro ao salvar jogo:', error);
        // Adicione uma lógica para mostrar um erro ao usuário, se desejar
      }
    });
  }
}
