// Every procedure: steps that close a routed routine. Each lives in its own
// directory: DESCRIPTION.md (meaning), one file per step, _index.mjs (assembly).
import bootstrapping from "./bootstrapping/_index.mjs";
import closing from "./closing/_index.mjs";
import { hooking, installingHooks } from "./hooking/_index.mjs";
import inspecting from "./inspecting/_index.mjs";
import loading from "./loading/_index.mjs";
import locating from "./locating/_index.mjs";
import opening from "./opening/_index.mjs";
import promoting from "./promoting/_index.mjs";
import sinking from "./sinking/_index.mjs";

export default { locating, loading, inspecting, bootstrapping, opening, closing, sinking, hooking, installingHooks, promoting };
