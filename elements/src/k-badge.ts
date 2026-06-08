import { toneClass, toneForValue, type SemanticTone } from "../react/tones.js";
import { appendClasses, textAttribute } from "./base.js";

const toneValues = new Set<SemanticTone>(["positive", "caution", "negative", "active", "neutral"]);

export class KBadge extends HTMLElement {
  static observedAttributes = ["value", "tone"];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    const value = textAttribute(this, "value", this.textContent?.trim() ?? "");
    const toneAttribute = this.getAttribute("tone") as SemanticTone | null;
    const tone = toneAttribute && toneValues.has(toneAttribute) ? toneAttribute : toneForValue(value);
    const badge = document.createElement("span");
    badge.className = appendClasses("badge", toneClass(tone), this.getAttribute("class-name"));
    badge.textContent = value;
    this.replaceChildren(badge);
  }
}
