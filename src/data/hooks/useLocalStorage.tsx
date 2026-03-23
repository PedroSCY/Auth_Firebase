export default function useLocalStorage() {
    const adicionarLocalStorage = (chave: string, valor: any) => {
        localStorage.setItem(chave, valor);
    };

    const tirarLocalStorage = (chave?: string) => {
        if (chave) {
            localStorage.removeItem(chave);
        }
    };

    const pegarLocalStorage = (chave?: string) => {
        if (chave) {
            return localStorage.getItem(chave);
        }
    };

    return { adicionarLocalStorage, tirarLocalStorage, pegarLocalStorage };
}
