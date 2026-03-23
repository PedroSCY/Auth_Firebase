"use client";
import { Navbar, Group, Button } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import LinkMenu from "./LinkMenu";
import PerfilUsuario from "./PerfilUsuario";
import useAuth from "@/data/hooks/useAutenticacao";
import itensMenu from "@/data/itensMenu";
import Usuario from "@/model/Usuario";
import useAutenticacao from "@/data/hooks/useAutenticacao";

export default function NavbarSimple() {
    const {usuario, logout} = useAutenticacao()

    const links = itensMenu.map((item) => {
        return <LinkMenu key={item.texto} texto={item.texto} url={item.url} icone={item.icone} />;
    });

    return (
        <Navbar w={{ sm: 300 }} p="md" className="bg-gray-50">
            <Navbar.Section grow>
                <Group className={`mb-5 pb-4 border-solid border-0 border-b border-gray-500`} position="apart">
                    <PerfilUsuario usuario={usuario} />
                </Group>
                {links}
            </Navbar.Section>

            <Navbar.Section
                className={`mt-5 pt-4 border-solid 
            border-0 border-t border-gray-500`}
            >
                <Button
                    fullWidth
                    variant="white"
                    leftIcon={<IconLogout className="mr-5" />}
                    className={`  text-gray-500 hover:text-red-500`}
                    onClick={async()=> await logout() }
                >
                    Sair
                </Button>
            </Navbar.Section>
        </Navbar>
    );
}
