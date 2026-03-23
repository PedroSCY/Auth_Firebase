"use client";
import { TextInput, Button, Title } from "@mantine/core";
import { useState } from "react";

interface SenhaComCodigoProps {
    enviarCodigo: (senha: string) => any;
    validarCodigo: (codigo: string) => any;
    textoValidar: string;
    enunciado?: string;
}

export default function SenhaComCodigo(props: SenhaComCodigoProps) {
    const [senha, setSenha] = useState<string>("");
    const [codigo, setCodigo] = useState<string>("");

    return (
        <div className="basis-60">
            <Title order={3}>{props.enunciado}</Title>
            <TextInput label="Senha" value={senha} onChange={(e) => setSenha(e.currentTarget.value)} />
            <Button
                fullWidth
                mt="sm"
                mb="md"
                color="blue"
                variant="outline"
                onClick={async () => await props.enviarCodigo(senha)}
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
