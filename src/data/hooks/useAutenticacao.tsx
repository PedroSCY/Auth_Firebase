import { useContext } from "react";
import ContextoAutenticacao from "../context/ContextoAutenticacao";

const useAutenticacao = () => useContext(ContextoAutenticacao);

export default useAutenticacao;
