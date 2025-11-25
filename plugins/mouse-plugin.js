export class MousePlugin {
    init(controller) {
        this.controller = controller;

        this.pressedButtons = new Set();

        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
    }

    enable() {
        const target = this.controller.target;

        if (!target) return;

        target.addEventListener("mousedown", this.mouseDown);
        target.addEventListener("mouseup", this.mouseUp);
    }

    disable() {
        const target = this.controller.target;

        if (target) {
            target.removeEventListener("mousedown", this.mouseDown);
            target.removeEventListener("mouseup", this.mouseUp);
        }

        this.pressedButtons.clear();
    }

    mouseDown(event) {
        if (!this.controller.enabled || !this.controller.focused) return;

        const button = event.button;

        this.pressedButtons.add(button);

        this.updateActions();
    }

    mouseUp(event) {
        if (!this.controller.enabled || !this.controller.focused) return;

        const button = event.button;

        this.pressedButtons.delete(button);

        this.updateActions();
    }

    updateActions() {
        for (const actionName in this.controller.actions) {
            const actionConfig = this.controller.getActionConfig(actionName);
            if (!actionConfig || !actionConfig.enabled) continue

            if (actionConfig.mouseButton !== undefined) {
                isActive = this.pressedButtons.has(actionConfig.mouseButton);
            }
            this.controller.setActionState(actionName, isActive);
        }
    }
}