import { appendClasses, prepareLightDomHost, textAttribute } from "./base.js";

export class KPanel extends HTMLElement {
  static observedAttributes = ["title", "count"];

  private content: Node[] | null = null;
  private connected = false;
  private renderQueued = false;

  connectedCallback() {
    this.connected = true;
    this.queueRender();
  }

  attributeChangedCallback() {
    if (this.connected) this.queueRender();
  }

  private queueRender() {
    if (this.renderQueued) return;
    this.renderQueued = true;
    queueMicrotask(() => {
      this.renderQueued = false;
      if (this.isConnected) this.render();
    });
  }

  private render() {
    prepareLightDomHost(this);
    if (!this.content) this.content = [...this.childNodes];
    const panel = document.createElement("section");
    panel.className = appendClasses("panel", this.getAttribute("class-name"));
    const head = document.createElement("div");
    head.className = "panel-head";
    const title = document.createElement("h2");
    title.textContent = textAttribute(this, "title");
    const count = document.createElement("span");
    count.textContent = textAttribute(this, "count");
    head.append(title, count);
    panel.append(head, ...this.content);
    this.replaceChildren(panel);
  }
}
