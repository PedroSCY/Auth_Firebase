import Usuario from "@/model/Usuario";
import Cookies from "js-cookie";

export default class CookieSessao {
    private static readonly NOME_COOKIE: string = "usuarioLogado";

    static criar(conteudo: string) {
        Cookies.set(this.NOME_COOKIE, conteudo);
    }

    static pegar() {
        return Cookies.get(this.NOME_COOKIE);
    }

    static limpar() {
        Cookies.remove(this.NOME_COOKIE);
    }

    static gerenciar(usuario: Usuario | null) {
        if (usuario) {
            CookieSessao.criar("sim");
        } else {
            CookieSessao.limpar();
        }
    }
}
