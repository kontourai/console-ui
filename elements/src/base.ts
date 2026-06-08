export function appendClasses(...values: Array<string | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function textAttribute(element: HTMLElement, name: string, fallback = "") {
  return element.getAttribute(name) ?? fallback;
}

export function numberAttribute(element: HTMLElement, name: string, fallback = 0) {
  const value = Number(element.getAttribute(name));
  return Number.isFinite(value) ? value : fallback;
}

export function booleanAttribute(element: HTMLElement, name: string) {
  return element.hasAttribute(name) && element.getAttribute(name) !== "false";
}

export function prepareLightDomHost(element: HTMLElement) {
  if (!element.style.display) element.style.display = "contents";
}

export function defineElement(name: string, constructor: CustomElementConstructor) {
  if (!customElements.get(name)) customElements.define(name, constructor);
}
