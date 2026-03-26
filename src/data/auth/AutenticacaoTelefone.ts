import auth from "@/config/firebase";
import { ApplicationVerifier, ConfirmationResult, getMultiFactorResolver, multiFactor, MultiFactorError, MultiFactorResolver, PhoneAuthProvider, PhoneInfoOptions, PhoneMultiFactorGenerator, signInWithPhoneNumber, updatePhoneNumber, User } from "firebase/auth";
import AutenticacaoModificacoes from "./AutenticacaoModificacoes";

export default class AutenticacaoTelefone {

    static async enviarMudarTelefone(info:PhoneInfoOptions, recaptcha: ApplicationVerifier):Promise<string> {
        const provedor = new PhoneAuthProvider(auth)
        const idVerificacao = provedor.verifyPhoneNumber(info,recaptcha)
        return idVerificacao
    } 

    static async validarMudarTelefone(idVerificacao: string, codigo:string): Promise<void> {
        const credencial = PhoneAuthProvider.credential(idVerificacao,codigo)
        await updatePhoneNumber(auth.currentUser!, credencial)
    }

    static async enviarLoginTelefone(telefone:string, recaptcha: ApplicationVerifier):Promise<ConfirmationResult> {
        const confirmacao = await signInWithPhoneNumber(auth, telefone, recaptcha)
        return confirmacao
    } 

    static async validarLoginTelefone(confirmacao: ConfirmationResult, codigo:string): Promise<boolean> {
        const credencial = await confirmacao.confirm(codigo)
        return credencial.user !==null
    }

    static async enviarCadastro2Fator(senha:string, recaptcha: ApplicationVerifier):Promise<string>{
        await AutenticacaoModificacoes.reautenticar(senha)
        const usuario = auth.currentUser
        const sessao = await multiFactor(usuario!).getSession();
        const info:PhoneInfoOptions = {
            phoneNumber:usuario?.phoneNumber ?? "",
            session: sessao
        }
        const idverificacao = await new PhoneAuthProvider(auth).verifyPhoneNumber(info,recaptcha)
        return idverificacao
    }

    static async validarCadastro2Fator(idVerificacao:string, codigo:string):Promise<void> {
        const credencial = PhoneAuthProvider.credential(idVerificacao,codigo)
        const pertenceAoUsuario = PhoneMultiFactorGenerator.assertion(credencial)
        const usuario = auth.currentUser as User
        multiFactor(usuario).enroll(pertenceAoUsuario, usuario.displayName)
    }

    static async enviarCodigo2FA(error:MultiFactorError, recaptcha: ApplicationVerifier):Promise<[string, MultiFactorResolver]> {
        const resolver = getMultiFactorResolver(auth,error);
        const segundoFator = resolver.hints.find(h=>{
            return h.factorId === PhoneMultiFactorGenerator.FACTOR_ID
        })
        if(segundoFator){
            const info:PhoneInfoOptions = {
                multiFactorHint:segundoFator,
                session: resolver.session
            }
            const idverificacao = await new PhoneAuthProvider(auth).verifyPhoneNumber(info,recaptcha)
            return [idverificacao,resolver]
        }
        throw Error("Houve um problema")
    }

    static async validarCodigo2FA(idVerificacao:string, codigo:string, resolver: MultiFactorResolver):Promise<void> {
        const credencial = PhoneAuthProvider.credential(idVerificacao,codigo)
        const pertenceAoUsuario = PhoneMultiFactorGenerator.assertion(credencial)
        await resolver.resolveSignIn(pertenceAoUsuario)
    }
}