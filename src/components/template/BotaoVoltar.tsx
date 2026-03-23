import { Button } from "@mantine/core";
import Link from "next/link";

export default function BotaoVoltar() {
    return (
        <Link href="/">
            <Button fullWidth mt="md" color="red" variant="outline">
                Voltar
            </Button>
        </Link>
    );
}
