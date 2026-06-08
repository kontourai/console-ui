import { appendClasses, numberAttribute } from "./base.js";

export class KProgress extends HTMLElement {
  static observedAttributes = ["value"];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    const normalized = Math.max(0, Math.min(100, numberAttribute(this, "value")));
    const progress = document.createElement("div");
    progress.className = appendClasses("progress", this.getAttribute("class-name"));
    const fill = document.createElement("span");
    fill.style.width = `${normalized}%`;
    progress.append(fill);
    this.replaceChildren(progress);
  }
}
