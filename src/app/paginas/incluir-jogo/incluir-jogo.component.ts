import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { JogoService, Jogo } from '../../servicos/jogo.service';

@Component({
  selector: 'app-incluir-jogo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './incluir-jogo.component.html',
  styleUrls: ['./incluir-jogo.component.scss']
})
export class IncluirJogoComponent {
  jogo: Partial<Jogo> = {};

  constructor(private jogoService: JogoService, private router: Router) {}

  salvar() {
    const novoJogo: Jogo = {
      id: 0,
      titulo: this.jogo.titulo || '',
      genero: this.jogo.genero || '',
      plataforma: this.jogo.plataforma || '',
      desenvolvedora: this.jogo.desenvolvedora || '',
      dataLancamento: this.jogo.dataLancamento || '',
      multiplayer: this.jogo.multiplayer || false,
      classificacaoEtaria: this.jogo.classificacaoEtaria || ''
    };

    this.jogoService.adicionar(novoJogo);
    this.router.navigate(['/']);
  }
}
