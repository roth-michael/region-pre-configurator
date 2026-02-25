import { FLAGS, MODULE_NAME } from "./constants.mjs";

export async function openRegionConfig(parentDocument) {
  if (!canvas.scene) return;
  await patchFlags(parentDocument);
  const region = await RegionDocument.implementation.create({
    name: RegionDocument.implementation.defaultName({parent: canvas.scene}),
    shapes: [],
    behaviors: parentDocument.getFlag(MODULE_NAME, FLAGS.REGION_BEHAVIORS) ?? [],
    flags: {
      [MODULE_NAME]: {
        [FLAGS.IS_CONFIG_REGION]: true,
        [FLAGS.ORIGIN]: parentDocument.uuid
      }
    }
  }, {parent: canvas.scene});
  if (!region) return;
  new foundry.applications.sheets.RegionConfig({document: region}).render({force: true});
}

export function createElement(innerHTML) {
  const template = document.createElement("template");
  template.innerHTML = innerHTML;
  return template.content.children[0];
}

export async function patchFlags(document) {
  if ("region-attacher" in document.flags) {
    await document.update({
      flags: {
        [MODULE_NAME]: parentDocument.flags["region-attacher"],
        "region-attacher": _del
      }
    });
  }
}
