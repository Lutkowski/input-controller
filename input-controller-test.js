import { InputContoller } from "./input-controller.js";
import { KeyboardPlugin } from "./plugins/keyboard-plugin.js";
import { MousePlugin } from "./plugins/mouse-plugin.js";

const controller = new InputContoller({
    left: { keys: [37, 65], enabled: true },
    right: { keys: [39, 68], enabled: true },
    up: { keys: [38, 87], enabled: true },
    down: { keys: [40, 83], enabled: true },
})

controller.registerPlugin(new KeyboardPlugin(), "keyboard");
controller.registerPlugin(new MousePlugin(), "mouse");

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
    } else if (controller.isActionActive("color")) {
        box.style.background = "blue";
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
document.getElementById('bind-jump-mouse').onclick = () => controller.bindActions({ jump: { mouseButton: 0, enabled: false } });
document.getElementById('bind-color-mouse').onclick = () => controller.bindActions({ color: { mouseButton: 1, enabled: false } });
document.getElementById('enable-color-mouse').onclick = () => controller.enableAction("color");
document.getElementById('disable-color-mouse').onclick = () => controller.disableAction("color");

window.addEventListener(controller.ACTION_ACTIVATED, e => {
    console.log('activated', e.detail);
})

window.addEventListener(controller.ACTION_DEACTIVATED, e => {
    console.log('deactivated', e.detail);
})