interface TituloProps {
    titulo: string;
    subtitulo: string;
}

export default function Titulo(props: TituloProps) {
    return (
        <div className="m-8">
            <h1
                className={`
                font-black text-3xl
                text-gray-900 
            `}
            >
                {props.titulo}
            </h1>
            <h2
                className={`
                font-light text-sm
            `}
            >
                {props.subtitulo}
            </h2>
        </div>
    );
}
