export class KeyboardPlugin {
    init(controller) {
        this.controller = controller;
        this.pressedKeys = new Set();

        this.keyDown = this.keyDown.bind(this);
        this.keyUp = this.keyUp.bind(this);
    }

    enable() {
        const target = this.controller.target;

        if (!target) return;

        target.addEventListener("keydown", this.keyDown);
        target.addEventListener("keyup", this.keyUp);
    }

    disable() {
        const target = this.controller.target;

        if (target) {
            target.removeEventListener("keydown", this.keyDown);
            target.removeEventListener("keyup", this.keyUp);
        }

        this.pressedKeys.clear();
    }


    keyDown(event) {
        if (!this.controller.enabled || !this.controller.focused) return;

        const code = event.keyCode;

        this.pressedKeys.add(code);

        this.updateActions();
    }

    keyUp(event) {
        if (!this.controller.enabled || !this.controller.focused) return;

        const code = event.keyCode;

        this.pressedKeys.delete(code);

        this.updateActions();
    }

    updateActions() {
        for (const actionName in this.controller.actions) {
            const actionConfig = this.controller.getActionConfig(actionName);
            if (!actionConfig || !actionConfig.enabled) continue

            if (actionConfig.keys && actionConfig.keys.length > 0) {
                const isActive = actionConfig.keys.some(key => this.pressedKeys.has(key))
                this.controller.setActionState(actionName, "keyboard", isActive);
            }
        }
    }
}