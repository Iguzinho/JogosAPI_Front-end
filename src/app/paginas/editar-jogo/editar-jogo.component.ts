import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JogoService, Jogo } from '../../servicos/jogo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-jogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-jogo.component.html',
  styleUrls: ['./editar-jogo.component.scss']
})
export class EditarJogoComponent implements OnInit {
  jogo?: Jogo;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jogoService: JogoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const jogoEncontrado = this.jogoService.obterPorId(id);
    if (jogoEncontrado) {
      this.jogo = { ...jogoEncontrado };
    } else {
      alert('Jogo não encontrado!');
      this.router.navigate(['/']);
    }
  }

  salvar() {
    if (this.jogo) {
      this.jogoService.atualizar(this.jogo);
      this.router.navigate(['/']);
    }
  }
}
