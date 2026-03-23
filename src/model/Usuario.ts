export default interface Usuario {
    nome: string;
    email: string;
    token: string;
    imagem?: string;
    telefone?: string;
    ehAnonimo?: boolean;
}
