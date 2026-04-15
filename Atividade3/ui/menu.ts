import * as readline from "readline";
import { CatalogoFilmes } from "../model/CatalogoFilmes";
import { Filme } from "../model/Filme";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const catalogo = new CatalogoFilmes();

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer: string) => resolve(answer.trim()));
  });
}

function displayMenu(movieCount: number): void {
  console.clear();
  console.log("CATALOGO DE FILMES");
  console.log("-".repeat(56));
  console.log(`Filmes cadastrados: ${movieCount}\n`);

  console.log("1 - Adicionar novo filme");
  console.log("2 - Listar todos os filmes");
  console.log("3 - Buscar filme por titulo");
  console.log("4 - Buscar filmes por genero");
  console.log("5 - Remover filme por titulo");
  console.log("0 - Sair\n");
}

function displayMovie(movie: Filme, index?: number): void {
  const prefix = index !== undefined ? `${index + 1}. ` : "- ";
  const rating = movie.avaliacao !== undefined ? `${movie.avaliacao}/10` : "Nao avaliado";

  console.log(`${prefix}${movie.titulo}`);
  console.log(`   Ano: ${movie.anoLancamento} | Genero: ${movie.genero} | Duracao: ${movie.duracaoMinutos} min | Avaliacao: ${rating}`);
}

function displayMovieList(movies: Filme[], title: string): void {
  console.log(`\n${title}`);
  console.log("-".repeat(56));

  if (movies.length === 0) {
    console.log("Nenhum filme encontrado.\n");
    return;
  }

  console.log(`Total: ${movies.length} filme(s)\n`);
  movies.forEach((movie, index) => displayMovie(movie, index));
  console.log("");
}

function displaySeparator(): void {
  console.log("-".repeat(56));
}

function displaySuccess(message: string): void {
  console.log(`\nSucesso: ${message}\n`);
}

function displayError(message: string): void {
  console.log(`\nErro: ${message}\n`);
}

function displayWarning(message: string): void {
  console.log(`\nAviso: ${message}\n`);
}

async function waitForEnter(): Promise<void> {
  await askQuestion("\nPressione Enter para continuar...");
}

async function addMovie(): Promise<void> {
  console.clear();
  console.log("\nADICIONAR NOVO FILME\n");

  const titulo = await askQuestion("Titulo: ");
  if (!titulo) {
    displayError("O titulo nao pode estar vazio.");
    await waitForEnter();
    return;
  }

  const anoStr = await askQuestion("Ano de lancamento: ");
  const ano = parseInt(anoStr);
  if (isNaN(ano) || ano < 1888 || ano > new Date().getFullYear() + 5) {
    displayError("Ano invalido.");
    await waitForEnter();
    return;
  }

  const genero = await askQuestion("Genero: ");
  if (!genero) {
    displayError("O genero nao pode estar vazio.");
    await waitForEnter();
    return;
  }

  const duracaoStr = await askQuestion("Duracao (minutos): ");
  const duracao = parseInt(duracaoStr);
  if (isNaN(duracao) || duracao <= 0) {
    displayError("Duracao invalida.");
    await waitForEnter();
    return;
  }

  const avaliacaoStr = await askQuestion("Avaliacao (0-10, deixe em branco para pular): ");
  let avaliacao: number | undefined = undefined;

  if (avaliacaoStr !== "") {
    avaliacao = parseFloat(avaliacaoStr);
    if (isNaN(avaliacao) || avaliacao < 0 || avaliacao > 10) {
      displayError("A avaliacao deve ser entre 0 e 10.");
      await waitForEnter();
      return;
    }
  }

  const newMovie: Filme = {
    titulo,
    anoLancamento: ano,
    genero,
    duracaoMinutos: duracao,
    avaliacao,
  };

  try {
    catalogo.addMovie(newMovie);
    displaySuccess(`"${titulo}" adicionado com sucesso.`);
  } catch (e: any) {
    displayError(e.message);
  }

  await waitForEnter();
}

async function listAllMovies(): Promise<void> {
  console.clear();
  const movies = catalogo.getMovies();
  displayMovieList(movies, "TODOS OS FILMES");
  await waitForEnter();
}

async function searchByTitle(): Promise<void> {
  console.clear();
  console.log("\nBUSCAR POR TITULO\n");

  const termo = await askQuestion("Digite o titulo (ou parte dele): ");
  if (!termo) {
    displayWarning("Nenhum termo informado.");
    await waitForEnter();
    return;
  }

  const result = catalogo.getMoviesByTitle(termo);
  displayMovieList(result, `RESULTADOS PARA: "${termo}"`);
  await waitForEnter();
}

async function searchByGenre(): Promise<void> {
  console.clear();
  console.log("\nBUSCAR POR GENERO\n");

  const genero = await askQuestion("Digite o genero (ou parte dele): ");
  if (!genero) {
    displayWarning("Nenhum genero informado.");
    await waitForEnter();
    return;
  }

  const result = catalogo.getMoviesByGenre(genero);
  displayMovieList(result, `GENERO: "${genero}"`);
  await waitForEnter();
}

async function removeMovie(): Promise<void> {
  console.clear();
  console.log("\nREMOVER FILME\n");

  const titulo = await askQuestion("Titulo exato para remover: ");
  if (!titulo) {
    displayWarning("Titulo nao informado.");
    await waitForEnter();
    return;
  }

  const confirmation = await askQuestion(`Confirma remocao de "${titulo}"? (s/n): `);
  if (confirmation.toLowerCase() !== "s") {
    displayWarning("Operacao cancelada.");
    await waitForEnter();
    return;
  }

  const removed = catalogo.removeMovieByTitle(titulo);
  if (removed) {
    displaySuccess(`"${titulo}" removido com sucesso.`);
  } else {
    displayError(`Filme "${titulo}" nao encontrado.`);
  }

  await waitForEnter();
}

async function handleMenuOption(option: string): Promise<boolean> {
  switch (option) {
    case "1":
      await addMovie();
      return true;
    case "2":
      await listAllMovies();
      return true;
    case "3":
      await searchByTitle();
      return true;
    case "4":
      await searchByGenre();
      return true;
    case "5":
      await removeMovie();
      return true;
    case "0":
      console.log("\nEncerrando o catalogo de filmes. Ate logo!\n");
      rl.close();
      return false;
    default:
      displayWarning("Opcao invalida. Tente novamente.");
      await waitForEnter();
      return true;
  }
}

export async function startMenuApp(): Promise<void> {
  let isRunning = true;
  while (isRunning) {
    displayMenu(catalogo.getMovieCount());
    const option = await askQuestion("Escolha uma opcao: ");
    displaySeparator();
    isRunning = await handleMenuOption(option);
  }
}
