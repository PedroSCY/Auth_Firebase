import { Loader } from "@mantine/core";
import useNavegacao from "@/data/hooks/useNavegacao";
import useAutenticacao from "@/data/hooks/useAutenticacao";

export default function ForcarAutenticacao(props: any) {
    const { irLogin } = useNavegacao();
    const {carregando, temUsuarioLogado} = useAutenticacao();


    function renderizarConteudo() {
        return <>{props.children}</>;
    }

    function renderizarCarregando() {
        return (
            <div
                className={`
                flex justify-center items-center h-screen
            `}
            >
                <Loader />
            </div>
        );
    }

    if (!carregando && temUsuarioLogado()) {
        return renderizarConteudo();
    } else if (carregando) {
        return renderizarCarregando();
    } else {
        irLogin?.();
    }
}
