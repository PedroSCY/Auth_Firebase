import auth from "@/config/firebase";
import { EmailAuthProvider, GithubAuthProvider, GoogleAuthProvider, linkWithCredential, signInAnonymously, signInWithCredential, signInWithPopup, User } from "firebase/auth";
import AutenticacaoEmail from "./AutenticacaoEmail";

export default class AutenticacaoProvedores {

    static async loginGoogle():Promise<void>{
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth,provider)
    }

    static async loginGitHub():Promise<void>{
        const provider = new GithubAuthProvider();
        await signInWithPopup(auth,provider)
    }

    static async loginAnonimo():Promise<void>{
        await signInAnonymously(auth);
    }

    static async cadastrarUsuarioAnonimo(nome: string, email:string, senha:string): Promise<void> {
        const credencial = EmailAuthProvider.credential(email,senha)
        await linkWithCredential(auth.currentUser as User, credencial)
        await AutenticacaoProvedores.reautenticar(email,senha)
        await AutenticacaoEmail.mudarNome(nome)
        await AutenticacaoEmail.mandarEmailVerificacao();
    }

    static async reautenticar(email:string, senha:string):Promise<void>{
        const credencial = EmailAuthProvider.credential(email, senha)
        await signInWithCredential(auth, credencial)
    }

}