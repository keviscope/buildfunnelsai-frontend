import { useContext } from "react";
import FunnelContext from "../context/FunnelContext";

export default function useFunnels() {
    return useContext(FunnelContext);
}