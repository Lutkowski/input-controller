export class InputContoller {
    constructor(actionsToBind = {}, target) {
        this.enabled = false;
        this.focused = true;
        this.target = target;

        this.ACTION_ACTIVATED = "input-controller:activate";
        this.ACTION_DEACTIVATED = "input-controller:deactivate";

        this.actions = {};
        this.pressedKeys = new Set();

        this.keyDown = this.keyDown.bind(this);
        this.keyUp = this.keyUp.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);

        this.plugins = [];

        this.bindActions(actionsToBind);

        if (target) {
            this.attach(target);
        }
    }

    registerPlagin(plagin) {
        plagin.init(this);
        this.plugins.push(plagin);
        if (this.enabled) {
            plagin.enable();
        }
    }

    bindActions(actionsToBind) {
        for (const action in actionsToBind) {
            const existing = this.actions[action];
            const actionConfig = actionsToBind[action];

            if (existing) {
                this.actions[action] = {
                    keys: actionConfig.keys || existing.keys || [],
                    enabled: actionConfig.enabled || existing.enabled || true,
                    active: existing.active || false
                };
            } else {
                this.actions[action] = {
                    keys: actionConfig.keys || [],
                    enabled: actionConfig.enabled || true,
                    active: false
                };
            }
        }
    }

    enableAction(actionName) {
        const action = this.actions[actionName];
        if (!action) return;
        action.enabled = true;
        this.updateActions();
    }

    disableAction(actionName) {
        const action = this.actions[actionName];
        if (!action) return;
        action.active = false;
        action.enabled = false;
    }

    isActionActive(actionName) {
        const action = this.actions[actionName];
        if (!action) return false;
        if (!action.enabled) return false;
        return action.active === true;
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

    detach() {
        this.enabled = false;

        if (!this.target) return

        this.target.removeEventListener("keydown", this.keyDown);
        this.target.removeEventListener("keyup", this.keyUp);

        window.removeEventListener("blur", this.onBlur);
        window.removeEventListener("focus", this.onFocus);
    }

    keyDown(event) {
        if (!this.enabled || !this.focused) return;

        const code = event.keyCode;

        this.pressedKeys.add(code);

        this.updateActions();
    }

    keyUp(event) {
        if (!this.enabled || !this.focused) return;

        const code = event.keyCode;

        this.pressedKeys.delete(code);

        this.updateActions();
    }

    onBlur() {
        this.focused = false;

        this.pressedKeys.clear();

        for (const name in this.actions) {
            this.actions[name].active = false;
        }

        this.updateActions();
    }

    onFocus() {
        this.focused = true;
    }

    updateActions() {
        if (!this.enabled || !this.focused || !this.target) return;

        for (const actionName in this.actions) {
            const action = this.actions[actionName];

            if (!action.enabled) {
                action.active = false;
                continue;
            }

            const isActionActive = action.keys.some(keyCode => this.pressedKeys.has(keyCode));

            if (isActionActive === action.active) {
                continue
            }

            action.active = isActionActive;

            const eventName = isActionActive ? this.ACTION_ACTIVATED : this.ACTION_DEACTIVATED;

            this.target.dispatchEvent(
                new CustomEvent(eventName, { detail: actionName })
            );
        }
    }
}