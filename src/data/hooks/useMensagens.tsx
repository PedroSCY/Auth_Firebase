import { useContext } from "react";
import ContextoMensagens from "../context/ContextoMensagens";

const useMensagens = () => useContext(ContextoMensagens);

export default useMensagens;
