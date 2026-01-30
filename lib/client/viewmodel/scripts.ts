import { proxy } from "valtio";

interface ScriptViewModel {
    script: string;
}

export const scriptViewModel = proxy<ScriptViewModel>({ script: "" });
