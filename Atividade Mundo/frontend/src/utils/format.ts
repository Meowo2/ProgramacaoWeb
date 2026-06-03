export function formatPopulacao(pop: string | number | null | undefined): string {
  if (!pop) return '-';
  return Number(pop).toLocaleString('pt-BR');
}
