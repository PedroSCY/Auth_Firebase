import auth from "@/config/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword, updateProfile, User, verifyBeforeUpdateEmail } from "firebase/auth";
import AutenticacaoEmail from "./AutenticacaoEmail";

export default class AutenticacaoModificacoes {

    static async alterarNome(nome:string): Promise<void> {
        await updateProfile(auth.currentUser as User, {displayName: nome})
    }

    static async reautenticar(senha:string):Promise<void>{
        const usuario = auth.currentUser;
        const credencial = EmailAuthProvider.credential(usuario?.email!, senha)
        await reauthenticateWithCredential(usuario!,credencial)
    }

    static async alterarSenha(novaSenha:string, senhaAtual:string):Promise<void>{
        await AutenticacaoModificacoes.reautenticar(senhaAtual)
        await updatePassword(auth.currentUser!, novaSenha)
    }
    
    static async alterarEmail(novoEmail:string, senhaAtual:string): Promise<void>{
        await AutenticacaoModificacoes.reautenticar(senhaAtual)
        await verifyBeforeUpdateEmail(auth.currentUser!, novoEmail)
    }

}