import { InputContoller } from "./input-controller.js";

const controller = new InputContoller({
    left: { keys: [37, 65], enabled: true },
    right: { keys: [38, 68], enabled: true },
    up: { keys: [39, 87], enabled: true },
    down: { keys: [40, 83], enabled: true },
})

const box = document.getElementById('box');
let x = 100;
let y = 100;

function animate() {
    if (controller.isActionActive("left")) x -= 2
    if (controller.isActionActive("right")) x += 2
    if (controller.isActionActive("up")) y -= 2
    if (controller.isActionActive("down")) y += 2

    if (controller.isActionActive("jump")) {
        box.style.background = "yellow";
    } else {
        box.style.background = "red";
    }

    box.style.transform = `translate(${x}px, ${y}px`;
    requestAnimationFrame(animate);
}

animate();

document.getElementById('attach').onclick = () => controller.attach(window);
document.getElementById('detach').onclick = () => controller.detach();
document.getElementById('enable').onclick = () => controller.enabled = true;
document.getElementById('disable').onclick = () => controller.enabled = false;
document.getElementById('bind-jump').onclick = () => controller.bindActions({ jump: { keys: [32], enabled: false } });
document.getElementById('enable-jump').onclick = () => controller.enableAction("jump");
document.getElementById('disable-jump').onclick = () => controller.disableAction("jump");

window.addEventListener(controller.ACTION_ACTIVATED, e => {
    console.log('activated', e.detail);
})

window.addEventListener(controller.ACTION_DEACTIVATED, e => {
    console.log('deactivated', e.detail);
})