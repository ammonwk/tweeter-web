import { useContext } from "react";
import { ToastActionsContext, ToastListContext } from "./ToastContexts";

export const useMessageActions = () => useContext(ToastActionsContext);
export const useMessageList = () => useContext(ToastListContext);
