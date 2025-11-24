export class InputContoller {
    constructor(actionsToBind = {}, target) {
        this.enabled = false;
        this.focus = true;
        this.target = target;

        this.actions = {};
        this.bindActions(actionsToBind);

        this.pressedKeys = new Set();
    }

    bindActions(actionsToBind) {
        for (const action in actionsToBind) {
            const actionConfig = actionsToBind[action];
            this.actions[action] = actionConfig;
        }
    }

    isActionActive(actionName) {
        const action = this.actions[actionName];
        if (action && action.enabled) {
            return true;
        }
        return false;
    }

    isKeyPressed(keyCode) {
        return this.pressedKeys.has(keyCode);
    }

    attach(target, dontEnable) {
        this.target = target;

        this.target.addEventListener("keydown", this.keyDown);
        this.target.addEventListener("keyup", this.keyUp);

        window.addEventListener("blur", this.onBlur);
        window.addEventListener("focus", this.onFocus);

        if (!dontEnable) {
            this.enabled = true;
        }
    }

    keyDown(event) {
        if (!this.enabled || !this.focus) return;

        const code = event.keyCode;

        this.pressedKeys.add(code);

        this.updateActions();
    }

    keyUp(event) {
        if (!this.enabled || !this.focus) return;

        const code = event.keyCode;

        this.pressedKeys.delete(code);

        this.updateActions();
    }

    onBlur() {
        this.focus = false;

        this.pressedKeys.clear();

        for (const name in this.actions) {
            this.actions[name].active = false;
        }

        this.updateActions();
    }

    onFocus() {
        this.focus = true;
    }

    updateActions() {
        if (!this.enabled || !this.focus) return;

        for (const actionName in this.actions) {
            const action = this.actions[actionName];

            if (!action.enabled) {
                if (action.active) {
                    action.active = false;
                    this.target.dispatchEvent(
                        new CustomEvent("input-controller:deactivate", {
                            detail: name
                        })
                    )
                }
                continue;
            }

            const isActionActive = action.keys.some(keyCode => this.pressedKeys.has(keyCode));

            if (isActionActive === action.active) {
                continue
            }

            action.active = isActionActive;

            const eventName = isActionActive ? "input-controller:activate" : "input-controller:deactivate";

            this.target.dispatchEvent(
                new CustomEvent(eventName, { detail: name })
            );
        }
    }
}