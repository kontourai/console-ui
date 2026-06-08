import { appendClasses, prepareLightDomHost, textAttribute } from "./base.js";

interface TopbarMetaItem {
  label: string;
  value: string;
}

interface TopbarActionItem {
  label: string;
  variant: string;
}

const buttonVariants = new Set(["primary", "ghost", "positive", "caution", "negative"]);

function parseMeta(value: string | null): TopbarMetaItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const record = item as Record<string, unknown>;
      return [{ label: String(record.label ?? ""), value: String(record.value ?? "") }];
    });
  } catch {
    return value.split("|").flatMap((entry) => {
      const [label, itemValue] = entry.split(":");
      return label && itemValue ? [{ label: label.trim(), value: itemValue.trim() }] : [];
    });
  }
}

function parseActions(value: string | null): TopbarActionItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const record = item as Record<string, unknown>;
      return [{ label: String(record.label ?? ""), variant: String(record.variant ?? "ghost") }];
    });
  } catch {
    return value.split("|").flatMap((entry) => {
      const [label, variant] = entry.split(":");
      return label ? [{ label: label.trim(), variant: variant?.trim() || "ghost" }] : [];
    });
  }
}

function normalizeButtonVariant(value: string) {
  const normalized = value.trim().toLowerCase();
  return buttonVariants.has(normalized) ? normalized : "ghost";
}

export class KTopbar extends HTMLElement {
  static observedAttributes = ["eyebrow", "title", "body", "meta", "actions", "aria-label"];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    prepareLightDomHost(this);
    const topbar = document.createElement("section");
    topbar.className = appendClasses("topbar", this.getAttribute("class-name"));
    const ariaLabel = this.getAttribute("aria-label");
    if (ariaLabel) topbar.setAttribute("aria-label", ariaLabel);

    const copy = document.createElement("div");
    copy.className = "topbar-copy";
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = textAttribute(this, "eyebrow");
    const title = document.createElement("h1");
    title.textContent = textAttribute(this, "title");
    copy.append(eyebrow, title);
    const bodyText = this.getAttribute("body");
    if (bodyText) {
      const body = document.createElement("div");
      body.className = "topbar-body";
      body.textContent = bodyText;
      copy.append(body);
    }
    topbar.append(copy);

    const metaItems = parseMeta(this.getAttribute("meta"));
    if (metaItems.length) {
      const meta = document.createElement("div");
      meta.className = "topbar-meta";
      for (const item of metaItems) {
        const entry = document.createElement("div");
        entry.className = "topbar-meta-item";
        const label = document.createElement("span");
        label.textContent = item.label;
        const value = document.createElement("strong");
        value.textContent = item.value;
        entry.append(label, value);
        meta.append(entry);
      }
      topbar.append(meta);
    }

    const actionItems = parseActions(this.getAttribute("actions"));
    if (actionItems.length) {
      const actions = document.createElement("div");
      actions.className = "topbar-actions";
      for (const item of actionItems) {
        const button = document.createElement("button");
        button.className = appendClasses("btn", `btn-${normalizeButtonVariant(item.variant)}`);
        button.type = "button";
        button.textContent = item.label;
        actions.append(button);
      }
      topbar.append(actions);
    }

    this.replaceChildren(topbar);
  }
}
