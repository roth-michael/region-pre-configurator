import registerHooks from "./hooks.mjs";
import { registerDnd4eSheetOverrides, registerPF2eSheetOverrides, registerSwadeSheetOverrides } from "./sheet-overrides.mjs";

Hooks.once("init", async function() {
  switch (game.system.id) {
    case "dnd4e":
      registerDnd4eSheetOverrides();
      break;
    case "pf2e":
      registerPF2eSheetOverrides();
      break;
    case "swade":
      registerSwadeSheetOverrides();
      break;
    default:
      return console.error(`Region Pre-Configurator is not compatible with the ${game.system.id} system.`);
  }
  registerHooks();
});
