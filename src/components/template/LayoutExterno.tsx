"use client";
import Mensagens from "./Mensagens";
import { Container, Title, Paper } from "@mantine/core";

interface LayoutExternoProps {
    titulo: string;
    complementoTitulo?: any;
    children?: any;
}

export default function LayoutExterno(props: LayoutExternoProps) {
    return (
        <Container w={500}>
            <Title align="center">{props.titulo}</Title>
            {props.complementoTitulo ? <props.complementoTitulo /> : <></>}
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                {props.children}
            </Paper>
            <Mensagens />
        </Container>
    );
}
