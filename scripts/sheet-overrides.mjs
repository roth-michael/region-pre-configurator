import { openRegionConfig, createElement } from "./helpers.mjs";

export function registerDnd4eSheetOverrides() {
  Hooks.on("renderItemSheet4e", patchDnd4eItemSheet);
}
export function registerPF2eSheetOverrides() {
  Hooks.on("renderItemSheetPF2e", patchPF2eItemSheet);
}
export function registerSwadeSheetOverrides() {
  Hooks.on("renderSwadeItemSheetV2", patchSwadeItemSheet);
}

function getAttachRegionHtml(document) {
  let shouldDisable = document.sheet && !document.sheet.isEditable;
  return createElement(`
    <div class="form-group">
      <label>${_loc("REGION-PRE-CONFIGURATOR.RegionPreConfigurator")}</label>
      <div class="form-fields">
        <button id="configureRegionButton" style="flex: 1; white-space: nowrap;"${shouldDisable ? " disabled" : ""}>
          <i class="fa fa-gear"></i>
          ${_loc("REGION-PRE-CONFIGURATOR.ConfigureBehaviors")}
        </button>
      </div>
    </div>
  `);
}

// dnd4e
function patchDnd4eItemSheet(app, html) {
  if (!game.user.isGM) return;
  const item = app.document;
  let targetTypeElem = html.querySelector("select[name='system.rangeType']");
  if (!targetTypeElem) return;
  if (!item.hasAreaTarget) return;
  let targetElem = targetTypeElem.parentNode.parentNode;
  if (!targetElem) return;
  targetElem.after(getAttachRegionHtml(item));
  html.querySelector("#configureRegionButton")?.addEventListener("click", () => {openRegionConfig(item)});
}

// pf2e
function patchPF2eItemSheet(app, html) {
  if (!game.user.isGM) return;
  html = html instanceof HTMLElement ? html : html[0];
  const item = app.document;
  let elementFound = html.querySelector("select[name='system.area.type']");
  let position;
  // For non-spell items with an inline @Template in the description
  if (!elementFound && item.system?.description?.value?.includes("@Template")) {
    elementFound = html.querySelector("fieldset.publication");
    position = "beforebegin";
    if (!elementFound) return;
  } else {
    // For spells, put it next to the Area input
    elementFound = elementFound?.parentNode?.parentNode;
    position = "afterend";
    if (!elementFound) return;
  }
  elementFound.insertAdjacentHTML(position, getAttachRegionHtml(item).outerHTML);
  html.querySelector("#configureRegionButton").addEventListener("click", () => {openRegionConfig(item)});
}

// swade
function patchSwadeItemSheet(app, html) {
  if (!game.user.isGM) return;
  const item = app.document;
  // Check if any of the template types are enabled
  const templateSection = html.querySelector("div[class='templates']");
  const hasTemplate = !!templateSection?.querySelector("input[checked]");
  if (!hasTemplate) return;
  //If we have a template, insert the config button
  templateSection.after(getAttachRegionHtml(item));
  html.querySelector("#configureRegionButton").addEventListener("click", () => {openRegionConfig(item)});
}
