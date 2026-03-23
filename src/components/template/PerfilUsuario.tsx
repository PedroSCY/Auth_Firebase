import { Group, Avatar, Text } from "@mantine/core";
import Usuario from "@/model/Usuario";

interface PerfilUsuarioProps {
    usuario?: Usuario | null;
}

export default function PerfilUsuario(props: PerfilUsuarioProps) {
    const { nome, email, imagem, telefone } = props.usuario ?? { nome: "", email: "", imagem: "", telefone: "" };
    return (
        <Group className="p-4 w-full">
            <Avatar src={imagem} radius="xl" />

            <div style={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                    {nome ? nome : "Anônimo"}
                </Text>

                <Text color="dimmed" size="xs">
                    {email ? email : "desconhecido@mail.com"}
                </Text>

                <Text color="dimmed" size="xs">
                    {telefone ? telefone : ""}
                </Text>
            </div>
        </Group>
    );
}
