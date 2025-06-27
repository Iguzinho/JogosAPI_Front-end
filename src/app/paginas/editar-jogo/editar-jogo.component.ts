// src/app/paginas/editar-jogo/editar-jogo.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { JogoControllerService } from '../../api/services/jogo-controller.service';
import { Jogo } from '../../api/models/jogo';

@Component({
  selector: 'app-editar-jogo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './editar-jogo.component.html',
  styleUrls: ['./editar-jogo.component.scss']
})
export class EditarJogoComponent implements OnInit {
  jogoId: number | null = null;
  jogo: Partial<Jogo> = {};
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jogoControllerService: JogoControllerService
  ) {}

  ngOnInit(): void {
    console.log('EditarJogoComponent: ngOnInit iniciado.');
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.jogoId = Number(idParam);
        console.log('EditarJogoComponent: ID da rota:', this.jogoId);
        if (!isNaN(this.jogoId)) {
          this.carregarJogoParaEdicao(this.jogoId);
        } else {
          console.error('EditarJogoComponent: ID do jogo inválido na URL:', idParam);
          this.errorMessage = 'ID do jogo inválido! Redirecionando...';
          setTimeout(() => this.router.navigate(['/']), 3000);
        }
      } else {
        console.error('EditarJogoComponent: Nenhum ID de jogo fornecido na URL.');
        this.errorMessage = 'Nenhum ID de jogo fornecido! Redirecionando...';
        setTimeout(() => this.router.navigate(['/']), 3000);
      }
    });
  }

  carregarJogoParaEdicao(id: number): void {
    console.log('EditarJogoComponent: Carregando jogo com ID:', id);
    this.jogoControllerService.getById({ id: id }).subscribe({
      next: (response) => {
        console.log('EditarJogoComponent: Resposta do backend (getById):', response);

        // --- INÍCIO DA CORREÇÃO PARA LER O BLOB ---
        if (response instanceof Blob && response.type === 'application/json') {
          response.text().then((text) => {
            try {
              const parsedResponse = JSON.parse(text);
              this.jogo = { ...parsedResponse };

              // Após popular this.jogo, formatamos a data
              if (this.jogo.dataLancamento) {
                try {
                  const data = new Date(this.jogo.dataLancamento);
                  if (!isNaN(data.getTime())) {
                    this.jogo.dataLancamento = data.toISOString().split('T')[0];
                  } else {
                    console.warn('EditarJogoComponent: Data de lançamento inválida do backend:', this.jogo.dataLancamento);
                  }
                } catch (e) {
                  console.error('EditarJogoComponent: Erro ao parsear data de lançamento:', e);
                }
              }
              console.log('EditarJogoComponent: Jogo carregado e formatado:', this.jogo);

            } catch (e) {
              console.error('EditarJogoComponent: Erro ao parsear JSON da resposta do backend:', e);
              this.errorMessage = 'Erro ao carregar jogo: Formato de dados inválido do servidor.';
            }
          }).catch(() => {
            this.errorMessage = 'Erro ao carregar jogo: Não foi possível ler a resposta do servidor.';
          });
        } else {
          // Se por algum motivo não for um Blob JSON, assuma que já veio parseado (fallback)
          // Isso é menos provável dado os logs, mas é uma segurança.
          this.jogo = { ...response };
          if (this.jogo.dataLancamento) {
            try {
              const data = new Date(this.jogo.dataLancamento);
              if (!isNaN(data.getTime())) {
                this.jogo.dataLancamento = data.toISOString().split('T')[0];
              } else {
                console.warn('EditarJogoComponent: Data de lançamento inválida do backend:', this.jogo.dataLancamento);
              }
            } catch (e) {
              console.error('EditarJogoComponent: Erro ao parsear data de lançamento:', e);
            }
          }
          console.log('EditarJogoComponent: Jogo carregado e formatado (fallback):', this.jogo);
        }
        // --- FIM DA CORREÇÃO PARA LER O BLOB ---
      },
      error: (error) => {
        console.error('EditarJogoComponent: Erro ao carregar jogo para edição:', error);
        this.errorMessage = 'Erro ao carregar jogo. Por favor, tente novamente.';
        setTimeout(() => this.router.navigate(['/']), 3000);
      }
    });
  }

  salvar(): void {
    this.errorMessage = null;
    console.log('EditarJogoComponent: Iniciando processo de salvar...');

    if (this.jogoId && this.jogo && Object.keys(this.jogo).length > 0) {
      const jogoParaAtualizar: Jogo = {
        ...this.jogo,
        id: this.jogoId
      } as Jogo;

      console.log('EditarJogoComponent: Enviando jogo para atualização:', jogoParaAtualizar);
      this.jogoControllerService.update({ id: this.jogoId, body: jogoParaAtualizar }).subscribe({
        next: (response) => {
          console.log('EditarJogoComponent: Jogo atualizado com sucesso:', response);
          alert('Jogo atualizado com sucesso!');
          this.router.navigate(['/']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('EditarJogoComponent: Erro ao atualizar jogo:', error);

          if (error.error instanceof Blob && error.error.type === 'application/json') {
            error.error.text().then((text) => {
              try {
                const errorBody = JSON.parse(text);
                this.errorMessage = errorBody.message || 'Erro desconhecido ao salvar as alterações.';

                if (this.errorMessage!.includes('restricción de unicidad «jogo_titulo_key»') && this.errorMessage!.includes('Detalhe: Ya existe la llave (titulo)=')) {
                  const match = this.errorMessage!.match(/Detalhe: Ya existe la llave \(titulo\)=\((.*?)\)\./);
                  if (match && match[1]) {
                    this.errorMessage = `O título '${match[1]}' já existe! Por favor, escolha um título único.`;
                  }
                }
              } catch (e) {
                this.errorMessage = 'Erro ao salvar. Resposta do servidor ilegível.';
                console.error('Erro ao parsear JSON do erro:', e);
              }
            }).catch(() => {
              this.errorMessage = 'Erro ao salvar. Não foi possível ler a resposta do servidor.';
            });
          } else if (error.error && typeof error.error === 'object' && (error.error as any).message) {
            this.errorMessage = (error.error as any).message;
          } else if (error.message) {
            this.errorMessage = `Ocorreu um erro: ${error.status} - ${error.statusText}`;
            if (error.status === 500) {
              this.errorMessage += '. Verifique o console para detalhes do servidor.';
            }
          } else {
            this.errorMessage = 'Erro desconhecido ao salvar as alterações.';
          }
        }
      });
    } else {
      console.warn('EditarJogoComponent: Tentativa de salvar sem dados de jogo válidos ou ID.');
      this.errorMessage = 'Preencha os campos corretamente para salvar.';
    }
  }
}
