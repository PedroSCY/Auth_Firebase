import ItemMenu from "@/model/ItemMenu";
import Link from "next/link";
import useNavegacao from "@/data/hooks/useNavegacao";

export default function LinkMenu(props: ItemMenu) {
    const { paginaAtual } = useNavegacao();
    const ativo = props.url === paginaAtual();

    return (
        <Link
            href={props.url}
            className={`
    mx-3 my-2 flex items-center p-3 rounded-md font-medium 
    hover:text-gray-800 hover:bg-gray-100
    ${ativo ? "text-sky-500 bg-sky-100" : ""}`}
        >
            <props.icone className="mr-5" />
            <span>{props.texto}</span>
        </Link>
    );
}
