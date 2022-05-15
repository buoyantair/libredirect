import instagramHelper from "../../../assets/javascripts/helpers/instagram.js";
import commonHelper from "../../../assets/javascripts/helpers/common.js";

const disable = document.getElementById("disable-bibliogram");
const protocol = document.getElementById("protocol");

document.addEventListener("change", async () => {
    await browser.storage.local.set({
        disableInstagram: disable.checked,
        instagramProtocol: protocol.value,
    })
    changeProtocolSettings();
})

function changeProtocolSettings() {
    let normalDiv = document.getElementsByClassName("normal")[0];
    let torDiv = document.getElementsByClassName("tor")[0];
    if (protocol.value == 'normal') {
        normalDiv.style.display = 'block';
        torDiv.style.display = 'none';
    }
    else if (protocol.value == 'tor') {
        normalDiv.style.display = 'none';
        torDiv.style.display = 'block';
    }
}

browser.storage.local.get(
    [
        "disableInstagram",
        "instagramProtocol"
    ],
    r => {
        disable.checked = !r.disableInstagram;
        protocol.value = r.instagramProtocol;
        changeProtocolSettings();
    })

commonHelper.processDefaultCustomInstances('instagram', 'bibliogram', 'normal', document);
commonHelper.processDefaultCustomInstances('instagram', 'bibliogram', 'tor', document);

let latencyElement = document.getElementById("latency");
let latencyLabel = document.getElementById("latency-label");
latencyElement.addEventListener("click",
    async () => {
        let reloadWindow = () => location.reload();
        latencyElement.addEventListener("click", reloadWindow);
        await instagramHelper.init();
        let redirects = instagramHelper.getRedirects();
        const oldHtml = latencyLabel.innerHTML;
        latencyLabel.innerHTML = '...';
        commonHelper.testLatency(latencyLabel, redirects.bibliogram.normal).then(r => {
            browser.storage.local.set({ bibliogramLatency: r });
            latencyLabel.innerHTML = oldHtml;
            commonHelper.processDefaultCustomInstances('instagram', 'bibliogram', 'normal', document);
            latencyElement.removeEventListener("click", reloadWindow);
        });
    }
);