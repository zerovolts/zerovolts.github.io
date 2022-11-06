const template = fetch("/components/header/header.html").then(res => res.text());

const githubPath = "https://github.com/zerovolts/zerovolts.github.io/blob/main";

class ZvHeader extends HTMLElement {
    async connectedCallback() {
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = await template;

        const title = this.getAttribute("data-title");
        if (title !== null) {
            const titleEl = this.shadowRoot.getElementById("header-title");
            titleEl.innerText = title;
        }

        const relativePath = this.getAttribute("data-source");
        if (relativePath !== null) {
            const sourceEl= this.shadowRoot.getElementById("header-source");
            sourceEl.innerText = "Source";
            sourceEl.setAttribute("href", `${githubPath}${relativePath}`);
        }
    }
}

customElements.define("zv-header", ZvHeader);