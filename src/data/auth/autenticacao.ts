import {
    createUserWithEmailAndPassword,
    isSignInWithEmailLink,
    sendEmailVerification,
    sendPasswordResetEmail,
    sendSignInLinkToEmail,
    signInWithEmailAndPassword,
    signInWithEmailLink,
    signOut,
    updateProfile,
    User,
} from "firebase/auth";
import auth from "../../config/firebase";
import Usuario from "@/model/Usuario";

export default class Autenticacao {
    static async cadastrar(
        nome: string,
        email: string,
        senha: string,
    ): Promise<void> {
        await createUserWithEmailAndPassword(auth, email, senha);
        await Autenticacao.mudarNome(nome);
        await Autenticacao.mandarEmailVerificacao();
    }

    static normalizarUsuario(usuario: any): Usuario | null {
        if (usuario) {
            return {
                nome: usuario.displayName,
                email: usuario.email,
                token: usuario.accessToken,
                imagem: usuario.photoURL,
                telefone: usuario.phoneNumber,
                ehAnonimo: usuario.isAnonymous,
            };
        } else {
            return null;
        }
    }

    static async login(email: string, senha: string): Promise<Usuario | null> {
        const resultado = await signInWithEmailAndPassword(auth, email, senha);
        return Autenticacao.normalizarUsuario(resultado.user);
    }

    static async logout(): Promise<void> {
        await signOut(auth);
    }

    static async mandarEmailVerificacao(): Promise<void> {
        await sendEmailVerification(auth.currentUser as User);
    }

    static async mudarNome(nome: string): Promise<void> {
        await updateProfile(auth.currentUser as User, { displayName: nome });
    }

    static async enviarRecuperacaoSenha(email: string): Promise<void> {
        await sendPasswordResetEmail(auth, email);
    }

    static async enviarLoginSemSenha(email: string): Promise<void> {
        const config = {
            url: `${process.env.NEXT_PUBLIC_URL_BASE}/confirmarLogin/email`,
            handleCodeInApp: true,
        };
        await sendSignInLinkToEmail(auth, email, config);
    }

    static async validarLoginSemSenha(
        email: string,
        paginaAtual: () => string,
    ): Promise<void> {
        if (isSignInWithEmailLink(auth, paginaAtual())) {
            await signInWithEmailLink(auth, email, paginaAtual());
        }
    }
}
