const dialTemplate = fetch("/components/dial/dial.html").then(res => res.text());

const TAU = Math.PI * 2;

class ZvDial extends HTMLElement {
    constructor() {
        console.log("constructor");
        super();

        // Initialized when component connected.
        this.value = null;
        this.minValue = null;
        this.maxValue = null;

        // Initialized when component clicked.
        this.startingValue = null;
        this.startingY = null;
    }

    async connectedCallback() {
        // Set fields for consumers before awaiting the template.
        this.minValue = Number(this.getAttribute("data-min")) ?? 0;
        this.maxValue = Number(this.getAttribute("data-max")) ?? 100;
        this.setValue(Number(this.getAttribute("data-value")) ?? this.minValue);

        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = await dialTemplate;

        this.updateHand();

        const handleMouseMove = this.handleMouseMove.bind(this);

        // Clean up listeners.
        const callbackCleanup = () => {
            this.startingValue = null;
            this.startingY = null;
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", callbackCleanup);
        }

        this.addEventListener("mousedown", (event) => {
            this.startingValue = this.value;
            this.startingY = event.pageY;
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", callbackCleanup);
        });
    }

    handleMouseMove(event) {
        const unitsPerRadian = this.range / TAU;
        const distance = (this.startingY - event.pageY) / 16;
        this.setValue(this.startingValue + distance * unitsPerRadian);
        this.updateHand();
        this.dispatchEvent(new CustomEvent("rotate"));
    }

    get range() {
        return this.maxValue - this.minValue;
    }

    // Returns the value in the range of 0.0-1.0
    get normalizedValue() {
        return (this.value - this.minValue) / this.range
    }

    setValue(value) {
        if (value < this.minValue) {
            this.value = this.minValue;
            return;
        }
        if (value > this.maxValue) {
            this.value = this.maxValue;
            return;
        } 
        this.value = value;
    }

    updateHand() {
        const pointer = this.shadowRoot.getElementById("dial-pointer");
        const angle = (this.normalizedValue * TAU) + (TAU / 4);
        const x2 = (Math.cos(angle) * 16) + 16;
        const y2 = (Math.sin(angle) * 16) + 16;
        pointer.setAttribute("x2", x2);
        pointer.setAttribute("y2", y2);
    }
}

customElements.define("zv-dial", ZvDial);