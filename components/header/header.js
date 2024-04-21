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
            siteLogoEl.src = e.target.checked
                ? "/assets/images/zakku-dark.png"
                : "/assets/images/zakku.png";
        });

        const siteLogoEl = document.getElementById("site-logo");
        if (localStorage.getItem("theme") === "dark") {
            siteLogoEl.src = "/assets/images/zakku-dark.png";
        }
    }
}

customElements.define("zv-header", ZvHeader);