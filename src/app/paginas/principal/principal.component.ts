import { Component, OnInit } from '@angular/core';
import { Jogo, JogoService } from '../../servicos/jogo.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {
  jogos: Jogo[] = [];

  constructor(private jogoService: JogoService) {}

  ngOnInit(): void {
    this.jogos = this.jogoService.listar();
  }
}
