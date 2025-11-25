export class KeyboardPlugin {
    init(sourceId) {
        this.sourceId = sourceId;
        this.pressedKeys = new Set();

        this.keyDown = this.keyDown.bind(this);
        this.keyUp = this.keyUp.bind(this);
    }

    enable(target, emit, actions) {
        this.emit = emit;
        this.actions = actions;
        this.target = target;

        target.addEventListener("keydown", this.keyDown);
        target.addEventListener("keyup", this.keyUp);
    }

    disable(target) {
        if (!target) return;

        target.removeEventListener("keydown", this.keyDown);
        target.removeEventListener("keyup", this.keyUp);

        this.pressedKeys.clear();
    }


    keyDown(event) {
        const code = event.keyCode;

        this.pressedKeys.add(code);

        this.updateActions();
    }

    keyUp(event) {
        const code = event.keyCode;

        this.pressedKeys.delete(code);

        this.updateActions();
    }

    updateActions() {
        for (const actionName in this.actions) {
            const actionConfig = this.actions[actionName];
            if (!actionConfig || !actionConfig.enabled) continue

            if (actionConfig.keys && actionConfig.keys.length > 0) {
                const isActive = actionConfig.keys.some(key => this.pressedKeys.has(key))
                this.emit(actionName, isActive);
            }
        }
    }
}