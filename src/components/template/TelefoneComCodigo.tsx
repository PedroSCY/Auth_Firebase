"use client";
import { TextInput, Button, Title } from "@mantine/core";
import { useState } from "react";

interface TelefoneComCodigoProps {
    enviarCodigo: (telefone: string) => any;
    validarCodigo: (codigo: string) => any;
    textoValidar: string;
    enunciado?: string;
}

export default function TelefoneComCodigo(props: TelefoneComCodigoProps) {
    const [telefone, setTelefone] = useState<string>("");
    const [codigo, setCodigo] = useState<string>("");

    return (
        <div className="basis-60">
            <Title order={3}>{props.enunciado}</Title>
            <TextInput label="Telefone" value={telefone} onChange={(e) => setTelefone(e.currentTarget.value)} />
            <Button
                fullWidth
                mt="sm"
                mb="md"
                color="blue"
                variant="outline"
                onClick={async () => await props.enviarCodigo(telefone)}
            >
                Enviar Código
            </Button>
            <TextInput label="Código" value={codigo} onChange={(e) => setCodigo(e.currentTarget.value)} />
            <Button
                fullWidth
                mt="sm"
                mb="md"
                color="blue"
                variant="outline"
                onClick={async () => await props.validarCodigo(codigo)}
            >
                {props.textoValidar}
            </Button>
        </div>
    );
}
