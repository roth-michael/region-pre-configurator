import { FLAGS, MODULE_NAME } from "./constants.mjs";
import { patchFlags } from "./helpers.mjs";

export default function registerHooks() {
  Hooks.on("createRegion", async (region) => {
    if (!game.user.isActiveGM || region.getFlag(MODULE_NAME, FLAGS.IS_CONFIG_REGION)) return;
    const systemId = game.system.id;
    const originPath = systemId === "pf2e" ? "origin.uuid" : "origin";
    const originUuid = region.getFlag(systemId, originPath);
    const flagDocument = await fromUuid(originUuid);
    if (!flagDocument) return;
    await patchFlags(flagDocument);
    const behaviors = flagDocument.getFlag(MODULE_NAME, FLAGS.REGION_BEHAVIORS) ?? [];
    await region.createEmbeddedDocuments("RegionBehavior", behaviors);
  });

  Hooks.on("closeRegionConfig", async ({document: region}) => {
    if (!game.user.isGM) return;
    if (!region.getFlag(MODULE_NAME, FLAGS.IS_CONFIG_REGION)) return;
    const regionBehaviors = Array.from(region.behaviors) ?? [];
    const parentDocument = await fromUuid(region.getFlag(MODULE_NAME, FLAGS.ORIGIN));
    if (!parentDocument) return;
    await parentDocument.setFlag(MODULE_NAME, FLAGS.REGION_BEHAVIORS, regionBehaviors);
    await region.delete();
  });

  Hooks.on("renderRegionConfig", async ({document: region}, element) => {
    if (!game.user.isGM) return;
    if (!region.getFlag(MODULE_NAME, FLAGS.IS_CONFIG_REGION)) return;
    element.querySelector("nav")?.classList?.add("hidden");
    element.querySelector("section.tab.region-appearance")?.classList?.add("hidden");
    element.querySelector("section.tab.region-area")?.classList?.add("hidden");
    element.querySelector("section.tab.region-behaviors").classList.add("active");
  });
}
