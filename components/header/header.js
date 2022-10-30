const template = fetch("/components/header/header.html").then(res => res.text());

class ZvHeader extends HTMLElement {
    async connectedCallback() {
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = await template;
        if (this.hasAttribute("data-title")) {
            const title = this.shadowRoot.getElementById("header-title");
            title.innerText = this.getAttribute("data-title");
        }
    }
}

customElements.define("zv-header", ZvHeader);