"use client";
import { TextInput, PasswordInput, Text, Group, Button } from "@mantine/core";
import { IconBrandGoogle, IconBrandGithub, IconUser, IconPhone, IconMail, IconLink } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import LayoutExterno from "@/components/template/LayoutExterno";
import useAutenticacao from "@/data/hooks/useAutenticacao";

export default function Home() {
    const [email, setEmail] = useState<string>("");
    const [senha, setSenha] = useState<string>("");
    const [telefone, setTelefone] = useState<string>("");
    const {login, enviarLoginSemSenha, loginGoogle, loginGitHub, loginAnonimo} = useAutenticacao()

    const linkCadastro = () => {
        return (
            <Text color="dimmed" size="sm" align="center" mt={5}>
                Não tem uma conta?{" "}
                <Link href={"/cadastro"} className="font-bold">
                    Crie uma conta aqui
                </Link>
            </Text>
        );
    };

    return (
        <LayoutExterno titulo="Boas vindas à aplicação" complementoTitulo={linkCadastro}>
            <TextInput label="Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
            <PasswordInput label="Senha" mt="md" value={senha} onChange={(e) => setSenha(e.currentTarget.value)} />
            <TextInput label="Telefone" mt="md" value={telefone} onChange={(e) => setTelefone(e.currentTarget.value)} />
            <Group position="apart" mt="lg">
                <Link href="/esqueciSenha">Esqueceu a senha?</Link>
                <Button leftIcon={<IconMail />} fullWidth mt="xl" color="blue" variant="outline" onClick={async()=> login({email,senha})}>
                    Entrar
                </Button>
                <Button leftIcon={<IconLink />} fullWidth color="violet" variant="outline" onClick={async()=> {await enviarLoginSemSenha(email)}}>
                    Login sem senha
                </Button>
                <Button leftIcon={<IconBrandGoogle />} fullWidth color="red" variant="outline" onClick={async()=> await loginGoogle()}>
                    Login com o Google
                </Button>
                <Button leftIcon={<IconBrandGithub />} fullWidth color="dark" variant="outline" onClick={async()=> await loginGitHub()}>
                    Login com o Github
                </Button>
                <Button leftIcon={<IconPhone />} fullWidth color="orange" variant="outline">
                    Login com telefone
                </Button>
                <Button leftIcon={<IconUser />} fullWidth color="gray" variant="outline" onClick={async() => await loginAnonimo()}>
                    Login Anônimo
                </Button>
            </Group>
        </LayoutExterno>
    );
}
