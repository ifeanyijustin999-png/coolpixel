const palette = document.getElementById("color-picker-palette");
const root = document.documentElement
const slider = document.querySelector(".hue-slider");
const marker = document.querySelector(".marker");
const colorCode = document.querySelector(".color-picker-code")
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const hue = getComputedStyle(root).getPropertyValue("--hue");
const copyIcon = document.querySelector(".icon");
const rgbButton = document.getElementById("code-in-rgb");
const hexButton = document.getElementById("code-in-hex");
const hslButton = document.getElementById("code-in-hsl");
const colorCodeType = document.querySelector(".color-code-type");

let selectedFormat = "hsl";

const selectedColor = {
    hue: 240,
    saturation: 100,
    lightness: 50,

    red: 0,
    green: 0,
    blue: 255,

    hex: "#0000ff",

    x: canvas.width - 1,
    y: 0
};

let dragging = false;

initiatizeCanvas()
function initiatizeCanvas() {
    updateCodeDisplayInHSL();

    const hue = getComputedStyle(root).getPropertyValue("--hue");
    const hueColor = `hsl(${hue}, 100%, 50%)`;

    const gradient1 = ctx.createLinearGradient(0, 0.5, 0, canvas.height - 0.5);
    gradient1.addColorStop(0, "transparent");
    gradient1.addColorStop(1, "black");

    const gradient2 = ctx.createLinearGradient(0.5, 0, canvas.width - 0.5, 0);
    gradient2.addColorStop(0, "white");
    gradient2.addColorStop(1, hueColor);

    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

palette.addEventListener("pointerdown", event => {
    dragging = true;

    palette.setPointerCapture(event.pointerId);

    const rect = palette.getBoundingClientRect();

    let localX = event.clientX - rect.left;
    let localY = event.clientY - rect.top;

    localX = Math.max(0, Math.min(localX, rect.width - 1));
    localY = Math.max(0, Math.min(localY, rect.height - 1));

    let x = Math.floor(localX * canvas.width / rect.width);
    let y = Math.floor(localY * canvas.height / rect.height);

    console.log(canvas.height / rect.height)

    selectedColor.x = x;
    selectedColor.y = y;
    marker.style.display = "block";
    marker.style.left = `${localX - 10}px`;
    marker.style.top = `${localY - 10}px`;

    getPaletteValue(x, y);
});

palette.addEventListener("pointermove", event => {
    if (!dragging) return;

    const rect = palette.getBoundingClientRect();

    let localX = event.clientX - rect.left;
    let localY = event.clientY - rect.top;

    localX = Math.max(0, Math.min(localX, rect.width - 1));
    localY = Math.max(0, Math.min(localY, rect.height - 1));

    let x = Math.floor(localX * canvas.width / rect.width);
    let y = Math.floor(localY * canvas.height / rect.height);

    selectedColor.x = x;
    selectedColor.y = y;

    marker.style.display = "block";
    marker.style.left = `${localX - 10}px`;
    marker.style.top = `${localY - 10}px`;

    getPaletteValue(x, y);
});

palette.addEventListener("pointerup", event => {
    dragging = false;
    palette.releasePointerCapture(event.pointerId);
});

function getPaletteValue(x, y) {
    let imageData = ctx.getImageData(x, y, 1, 1);
    let data = imageData.data;

    calculateValue(data)
}

function calculateValue(data) {
    let [r, g, b, a] = data;

    selectedColor.red = r;
    selectedColor.green = g;
    selectedColor.blue = b;

    r = r / 255;
    g = g / 255;
    b = b / 255;
    a = a / 255;

    let Cmax = Math.max(r, g, b);
    let Cmin = Math.min(r, g, b);

    let lightness = (Cmax + Cmin) / 2;

    let saturation;

    if ((Cmax - Cmin) === 0) {
        saturation = 0;
    } else {
        saturation =
            (Cmax - Cmin) /
            (1 - Math.abs((2 * lightness) - 1));
    }

    saturation = saturation * 100;
    lightness = lightness * 100;

    root.style.setProperty("--saturation", `${saturation}%`);
    root.style.setProperty("--lightness", `${lightness}%`);

    selectedColor.saturation = saturation;
    selectedColor.lightness = lightness;

    if (selectedFormat === "rgb") {
        updateCodeDisplayInRGB();
    } else if (selectedFormat === "hex") {
        updateCodeDisplayInHEX();
    } else {
        updateCodeDisplayInHSL();
    }
}

hslButton.addEventListener("click", updateCodeDisplayInHSL);

function updateCodeDisplayInHSL() {
    selectedFormat = "hsl";

    let hue = selectedColor.hue;
    let saturation = selectedColor.saturation;
    let lightness = selectedColor.lightness;

    saturation = Math.round(saturation);
    lightness = Math.round(lightness);

    colorCode.textContent = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    colorCodeType.textContent = "HSL"
}

rgbButton.addEventListener("click", updateCodeDisplayInRGB);

function updateCodeDisplayInRGB() {
    selectedFormat = "rgb";

    let r = selectedColor.red;
    let g = selectedColor.green;
    let b = selectedColor.blue;

    colorCode.textContent = `rgb(${r}, ${g}, ${b})`;
    colorCodeType.textContent = "RGB";
}

hexButton.addEventListener("click", updateCodeDisplayInHEX)

function updateCodeDisplayInHEX() {
    selectedFormat = "hex";

    let r = selectedColor.red;
    let g = selectedColor.green;
    let b = selectedColor.blue;

    selectedColor.hex = "#" + [r, g, b].map(value => value.toString(16).padStart(2, "0")).join("");
    colorCodeType.textContent = "HEX";
    colorCode.textContent = selectedColor.hex;
}

function updatePaletteHue() {
    const hue = getComputedStyle(root).getPropertyValue("--hue");
    const hueColor = `hsl(${hue}, 100%, 50%)`;

    const gradient1 = ctx.createLinearGradient(0, 0.5, 0, canvas.height - 0.5);
    gradient1.addColorStop(0, "transparent");
    gradient1.addColorStop(1, "black");

    const gradient2 = ctx.createLinearGradient(0.5, 0, canvas.width - 0.5, 0);
    gradient2.addColorStop(0, "white");
    gradient2.addColorStop(1, hueColor);

    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

slider.addEventListener("input", event => {

    const newHueValue = event.target.value;
    root.style.setProperty("--hue", newHueValue);

    selectedColor.hue = newHueValue;

    updatePaletteHue();

    getPaletteValue(selectedColor.x, selectedColor.y);
});

copyIcon.addEventListener("click", copyCodeValue);

function copyCodeValue() {
    navigator.clipboard.writeText(colorCode.textContent)
        .then(() => {
            copyIcon.innerHTML = '<span class="material-symbols-outlined">check</span>';

            setTimeout(() => {
                copyIcon.innerHTML = '<span class="material-symbols-outlined">content_copy</span>'
            }, 1500)
        })
        .catch(error => {
            console.error("Failed to copy text: ", error);
        });
}