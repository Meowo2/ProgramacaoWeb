import { Filme } from "./Filme";

export class CatalogoFilmes {
  private filmes: Filme[] = [];

  addMovie(filme: Filme): void {
    if (filme.avaliacao !== undefined) {
      if (filme.avaliacao < 0 || filme.avaliacao > 10) {
        throw new Error("A avaliacao deve estar entre 0 e 10.");
      }
    }

    const jaExiste = this.filmes.find(
      (f) => f.titulo.toLowerCase() === filme.titulo.toLowerCase()
    );
    if (jaExiste) {
      throw new Error(`Ja existe um filme com o titulo "${filme.titulo}".`);
    }

    this.filmes.push(filme);
  }

  getMovies(): Filme[] {
    return [...this.filmes];
  }

  getMoviesByTitle(titulo: string): Filme[] {
    return this.filmes.filter((f) =>
      f.titulo.toLowerCase().includes(titulo.toLowerCase())
    );
  }

  getMoviesByGenre(genero: string): Filme[] {
    return this.filmes.filter((f) =>
      f.genero.toLowerCase().includes(genero.toLowerCase())
    );
  }

  removeMovieByTitle(titulo: string): boolean {
    const tamanhoAntes = this.filmes.length;
    this.filmes = this.filmes.filter(
      (f) => f.titulo.toLowerCase() !== titulo.toLowerCase()
    );
    return this.filmes.length < tamanhoAntes;
  }

  getMovieCount(): number {
    return this.filmes.length;
  }
}
