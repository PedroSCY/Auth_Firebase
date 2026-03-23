export {};

declare global {
    interface Window {
        recaptchaVerifier: any;
        confirmationResult: any;
        resolver: any;
    }

    type Mensagem = {
        texto: string;
        tipo: "ERRO" | "AVISO" | "SUCESSO";
    };

    type dadosCadastro = { nome: string; email: string; senha: string };
    type funcaoAtualizacao = (dado:any, senha?:any)=> Usuario;
    type funcaoLogin = (param?:any)=> Usuario;
}
