import { appendClasses, textAttribute } from "./base.js";

export class KEmpty extends HTMLElement {
  static observedAttributes = ["label"];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    const empty = document.createElement("p");
    empty.className = appendClasses("empty", this.getAttribute("class-name"));
    empty.textContent = textAttribute(this, "label", this.textContent?.trim() ?? "");
    this.replaceChildren(empty);
  }
}
