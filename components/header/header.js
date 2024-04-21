const template = fetch("/components/header/header.html").then(res => res.text());

const githubPath = "https://github.com/zerovolts/zerovolts.github.io/blob/main";

class ZvHeader extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = await template;

        const title = this.getAttribute("data-title");
        if (title !== null) {
            const titleEl = document.getElementById("header-title");
            titleEl.innerText = title;
        }

        const relativePath = this.getAttribute("data-source");
        if (relativePath !== null) {
            const sourceEl= document.getElementById("header-source");
            sourceEl.innerText = "Source";
            sourceEl.setAttribute("href", `${githubPath}${relativePath}`);
        }

        const initialTheme = localStorage.getItem("theme");
        const themeToggleEl = document.getElementById("theme-toggle");
        themeToggleEl.checked = initialTheme === "dark";
        themeToggleEl.addEventListener("click", e => {
            const value = e.target.checked ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", value);
            localStorage.setItem("theme", value)
        });
    }
}

customElements.define("zv-header", ZvHeader);