import { useContext } from "react";
import ContextoNavegacao from "../context/ContextoNavegacao";

const useNavegacao = () => useContext(ContextoNavegacao);

export default useNavegacao;
