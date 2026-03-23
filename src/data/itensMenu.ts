import ItemMenu from "@/model/ItemMenu";
import { IconHome, IconBellRinging, IconSettings, IconReceipt } from "@tabler/icons-react";

const itensMenu: ItemMenu[] = [
    { url: "/home", texto: "Início", icone: IconHome },
    { url: "/notificacoes", texto: "Notificações", icone: IconBellRinging },
    { url: "/configuracoes", texto: "Configurações", icone: IconSettings },
    { url: "/pagamentos", texto: "Pagamentos", icone: IconReceipt },
];

export default itensMenu;
