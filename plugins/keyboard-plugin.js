export class KeyboardPlugin {
    init(controller) {
        this.controller = controller;
        this.pressedKeys = new Set();

        this.keyDown = this.keyDown.bind(this);
        this.keyUp = this.keyUp.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    enable() {
        const target = this.controller.target;
        if (!target) return;

        this.target.addEventListener("keydown", this.keyDown);
        this.target.addEventListener("keyup", this.keyUp);
        window.addEventListener("blur", this.onBlur);
    }

    disable() {
        const target = this.controller.target;

        if (target) {
            this.target.removeEventListener("keydown", this.keyDown);
            this.target.removeEventListener("keyup", this.keyUp);
        }

        window.removeEventListener("blur", this.onBlur);
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

    onBlur() {
        this.pressedKeys.clear();
        for (const actionName in this.controller.actions) {
            this.controller.setActionState(actionName, false);
        }
    }

    updateActions() {
        for (const actionName in this.controller.actions) {
            const actionConfig = this.controller.getAction(actionName);
            if (!actionConfig || !actionConfig.enable) continue

            if (actionConfig.keys && actionConfig.keys.length > 0) {
                const isActive = actionConfig.keys.some(key => this.pressedKeys.has(key))
                this.controller.setActionState(actionName, isActive);
            }
        }
    }
}