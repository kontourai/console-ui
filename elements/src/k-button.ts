import { appendClasses, booleanAttribute, textAttribute } from "./base.js";

type ButtonVariant = "primary" | "ghost" | "positive" | "caution" | "negative";

const variants = new Set<ButtonVariant>(["primary", "ghost", "positive", "caution", "negative"]);

export class KButton extends HTMLElement {
  static observedAttributes = ["variant", "label", "type", "disabled"];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    const variantAttribute = this.getAttribute("variant") as ButtonVariant | null;
    const variant = variantAttribute && variants.has(variantAttribute) ? variantAttribute : "ghost";
    const button = document.createElement("button");
    button.className = appendClasses("btn", `btn-${variant}`, this.getAttribute("class-name"));
    button.type = textAttribute(this, "type", "button") as "button" | "submit" | "reset";
    button.disabled = booleanAttribute(this, "disabled");
    button.textContent = textAttribute(this, "label", this.textContent?.trim() ?? "");
    this.replaceChildren(button);
  }
}
