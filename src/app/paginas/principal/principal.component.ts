// src/app/paginas/principal/principal.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para diretivas como *ngFor
import { RouterModule } from '@angular/router'; // Para o routerLink no template
import { HttpErrorResponse } from '@angular/common/http'; // Importe para tratamento de erro

// **IMPORTAÇÕES DO NG-OPENAPI-GEN (RESPEITANDO SEU CAMINHO)**
// Certifique-se de que este caminho está correto no seu projeto
import { JogoControllerService } from '../../api/services/jogo-controller.service';
import { Jogo } from '../../api/models/jogo';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, RouterModule], // Adicione CommonModule aqui para usar *ngFor
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {
  jogos: Jogo[] = []; // Array para armazenar os jogos
  errorMessage: string | null = null; // Para exibir mensagens de erro na tela

  constructor(private jogoControllerService: JogoControllerService) { }

  ngOnInit(): void {
    this.carregarJogos(); // Carrega os jogos ao iniciar o componente
  }

  carregarJogos(): void {
    this.errorMessage = null; // Limpa qualquer erro anterior ao carregar
    this.jogoControllerService.listAll().subscribe({
      next: (response) => {
        // --- INÍCIO DA CORREÇÃO: Lidar com resposta Blob do GET ---
        if (response instanceof Blob && response.type === 'application/json') {
          response.text().then((text) => {
            try {
              const parsedResponse = JSON.parse(text);
              this.jogos = parsedResponse; // Atribui o JSON parseado à lista de jogos
              console.log('PrincipalComponent: Jogos carregados e parseados:', this.jogos);
            } catch (e) {
              console.error('PrincipalComponent: Erro ao parsear JSON de jogos:', e);
              this.errorMessage = 'Erro ao carregar lista de jogos: formato de dados inválido do servidor.';
            }
          }).catch(() => {
            this.errorMessage = 'Erro ao carregar lista de jogos: Não foi possível ler a resposta do servidor.';
          });
        } else {
          // Se a resposta já vier como Array<Jogo> (menos comum se vier como Blob)
          this.jogos = response as Jogo[];
          console.log('PrincipalComponent: Jogos carregados (resposta direta):', this.jogos);
        }
        // --- FIM DA CORREÇÃO ---
      },
      error: (error: HttpErrorResponse) => { // Tipagem para HttpErrorResponse
        console.error('PrincipalComponent: Erro ao carregar jogos:', error);
        // Tenta extrair mensagem de erro mais detalhada do backend
        if (error.error instanceof Blob && error.error.type === 'application/json') {
          error.error.text().then((text) => {
            try {
              const errorBody = JSON.parse(text);
              this.errorMessage = errorBody.message || 'Erro desconhecido ao carregar jogos.';
            } catch (e) {
              this.errorMessage = 'Erro ao carregar jogos. Resposta do servidor ilegível.';
              console.error('Erro ao parsear JSON do erro:', e);
            }
          }).catch(() => {
            this.errorMessage = 'Erro ao carregar jogos. Não foi possível ler a resposta do servidor.';
          });
        } else if (error.error && typeof error.error === 'object' && (error.error as any).message) {
          this.errorMessage = (error.error as any).message;
        } else if (error.message) {
          this.errorMessage = `Ocorreu um erro: ${error.status} - ${error.statusText}`;
          if (error.status === 500) {
            this.errorMessage += '. Verifique o console para detalhes do servidor.';
          }
        } else {
          this.errorMessage = 'Erro desconhecido ao carregar jogos.';
        }
      }
    });
  }

  excluirJogo(id: number): void {
    this.errorMessage = null; // Limpa qualquer erro anterior
    // Confirmação com o usuário antes de excluir
    if (confirm('Tem certeza que deseja excluir este jogo? Esta ação não pode ser desfeita.')) {
      console.log('PrincipalComponent: Tentando excluir jogo com ID:', id);
      this.jogoControllerService.delete({ id: id }).subscribe({
        next: () => {
          console.log('PrincipalComponent: Jogo excluído com sucesso!');
          alert('Jogo excluído com sucesso!'); // Feedback simples de sucesso
          this.carregarJogos(); // Recarrega a lista para refletir a exclusão
        },
        error: (error: HttpErrorResponse) => {
          console.error('PrincipalComponent: Erro ao excluir jogo:', error);
          // Tenta extrair a mensagem de erro do backend (similar ao salvar na edição)
          if (error.error instanceof Blob && error.error.type === 'application/json') {
            error.error.text().then((text) => {
              try {
                const errorBody = JSON.parse(text);
                this.errorMessage = errorBody.message || 'Erro desconhecido ao excluir o jogo.';
                // Adicione lógica para mensagens específicas de erro de exclusão aqui, se houver
              } catch (e) {
                this.errorMessage = 'Erro ao excluir. Resposta do servidor ilegível.';
                console.error('Erro ao parsear JSON do erro:', e);
              }
            }).catch(() => {
              this.errorMessage = 'Erro ao excluir. Não foi possível ler a resposta do servidor.';
            });
          } else if (error.error && typeof error.error === 'object' && (error.error as any).message) {
            this.errorMessage = (error.error as any).message;
          } else if (error.message) {
            this.errorMessage = `Ocorreu um erro: ${error.status} - ${error.statusText}`;
          } else {
            this.errorMessage = 'Erro desconhecido ao excluir o jogo.';
          }
        }
      });
    }
  }
}
