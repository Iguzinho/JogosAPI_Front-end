import { Injectable } from '@angular/core';

export interface Jogo {
  id: number;
  titulo: string;
  genero: string;
  plataforma: string;
  desenvolvedora: string;
  dataLancamento: string;
  multiplayer: boolean;
  classificacaoEtaria: string;
}

@Injectable({
  providedIn: 'root'
})
export class JogoService {
  private jogos: Jogo[] = [
    {
      id: 1,
      titulo: 'The Last of Us',
      genero: 'Ação',
      plataforma: 'PlayStation',
      desenvolvedora: 'Naughty Dog',
      dataLancamento: '2013-06-14',
      multiplayer: true,
      classificacaoEtaria: '18+'
    },
    {
      id: 2,
      titulo: 'Stardew Valley',
      genero: 'Simulação',
      plataforma: 'PC',
      desenvolvedora: 'ConcernedApe',
      dataLancamento: '2016-02-26',
      multiplayer: true,
      classificacaoEtaria: 'Livre'
    }
  ];

  private nextId = 3;

  listar(): Jogo[] {
    return [...this.jogos];
  }

  obterPorId(id: number): Jogo | undefined {
    return this.jogos.find(j => j.id === id);
  }

  adicionar(jogo: Jogo) {
    jogo.id = this.nextId++;
    this.jogos.push(jogo);
  }

  atualizar(jogo: Jogo) {
    const index = this.jogos.findIndex(j => j.id === jogo.id);
    if (index !== -1) {
      this.jogos[index] = jogo;
    }
  }
}
