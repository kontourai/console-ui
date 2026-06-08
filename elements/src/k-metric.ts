import { appendClasses, textAttribute } from "./base.js";

export class KMetric extends HTMLElement {
  static observedAttributes = ["label", "value"];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    const metric = document.createElement("div");
    metric.className = appendClasses("metric", this.getAttribute("class-name"));
    const label = document.createElement("span");
    label.textContent = textAttribute(this, "label");
    const value = document.createElement("strong");
    value.textContent = textAttribute(this, "value", this.textContent?.trim() ?? "");
    metric.append(label, value);
    this.replaceChildren(metric);
  }
}
