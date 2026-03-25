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
    type funcaoAtualizacao = (dado:any, senha?:any)=> Promise<void>;
    type funcaoLogin = (param?:any)=> Promise<Usuario>;
    type funcaoCadastro = (nome: string, email: string, senha: string)=>Promise<void>
}
