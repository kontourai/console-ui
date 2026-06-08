import { normalizedClassSuffix, toneClass, toneForValue, type SemanticTone } from "../react/tones.js";
import { appendClasses, textAttribute } from "./base.js";

const toneValues = new Set<SemanticTone>(["positive", "caution", "negative", "active", "neutral"]);

export class KStatusBadge extends HTMLElement {
  static observedAttributes = ["status", "tone"];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    const status = textAttribute(this, "status", this.textContent?.trim() ?? "unknown");
    const toneAttribute = this.getAttribute("tone") as SemanticTone | null;
    const tone = toneAttribute && toneValues.has(toneAttribute) ? toneAttribute : toneForValue(status);
    const badge = document.createElement("div");
    badge.className = appendClasses("status", `status-${normalizedClassSuffix(status)}`, toneClass(tone), this.getAttribute("class-name"));
    badge.textContent = status;
    this.replaceChildren(badge);
  }
}
