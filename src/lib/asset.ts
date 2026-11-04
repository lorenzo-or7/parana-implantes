/** Caminho de um arquivo em public/, respeitando o `base` relativo do Vite. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
