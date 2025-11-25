export class MousePlugin {
    init(sourceId) {
        this.sourceId = sourceId;
        this.pressedButtons = new Set();

        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
    }

    enable(target, emit, actions) {
        this.emit = emit;
        this.actions = actions;
        this.target = target;

        target.addEventListener("mousedown", this.mouseDown);
        target.addEventListener("mouseup", this.mouseUp);
    }

    disable(target) {
        if (!target) return;

        target.removeEventListener("mousedown", this.mouseDown);
        target.removeEventListener("mouseup", this.mouseUp);

        this.pressedButtons.clear();
    }

    mouseDown(event) {
        const button = event.button;

        this.pressedButtons.add(button);

        this.updateActions();
    }

    mouseUp(event) {
        const button = event.button;

        this.pressedButtons.delete(button);

        this.updateActions();
    }

    updateActions() {
        for (const actionName in this.actions) {
            const actionConfig = this.actions[actionName];
            if (!actionConfig || !actionConfig.enabled) continue

            let isActive = false;

            if (actionConfig.mouseButton !== undefined) {
                isActive = this.pressedButtons.has(actionConfig.mouseButton);
            }
            this.emit(actionName, isActive);
        }
    }
}