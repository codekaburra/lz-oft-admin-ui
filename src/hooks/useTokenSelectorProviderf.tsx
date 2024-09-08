import { useContext } from "react";
import { TokenSelectorContext } from "./TokenSelector";

export const useTokenSelector = () => useContext(TokenSelectorContext);
