"use client";
import Menu from "./Menu";
import Titulo from "./Titulo";
import ForcarAutenticacao from "../auth/ForcarAutenticacao";
import Mensagens from "./Mensagens";
interface LayoutInternoProps {
    titulo: string;
    subtitulo: string;
    children?: any;
}

export default function LayoutInterno(props: LayoutInternoProps) {
    return (
        <ForcarAutenticacao>
            <div className="w-screen m-0 p-0 text-gray-500 flex">
                <Menu />
                <div>
                    <Titulo titulo={props.titulo} subtitulo={props.subtitulo} />
                    {props.children}
                </div>
                <Mensagens />
            </div>
        </ForcarAutenticacao>
    );
}
