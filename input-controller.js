export class InputContoller {
    constructor(actionsToBind = {}, target) {
        this.enabled = false;
        this.focused = true;
        this.target = target;

        this.ACTION_ACTIVATED = "input-controller:activate";
        this.ACTION_DEACTIVATED = "input-controller:deactivate";

        this.actions = {};

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

    setActionState(actionName, source, isActive) {
        const action = this.actions[actionName];
        if (!action || !action.enabled) return;

        if (!action.sources) action.sources = {};
        action.sources[source] = isActive;

        const state = Object.values(action.sources).some(s => s === true)
        if (state === action.active) return

        action.active = state;

        const eventName = state ? this.ACTION_ACTIVATED : this.ACTION_DEACTIVATED;

        if (this.target) {
            this.target.dispatchEvent(new CustomEvent(eventName, { detail: actionName }))
        };
    }

    getActionConfig(actionName) {
        return this.actions[actionName];
    }

    bindActions(actionsToBind) {
        for (const action in actionsToBind) {
            const existing = this.actions[action];
            const actionConfig = actionsToBind[action];


            if (existing) {
                const { enabled, ...rest } = actionConfig
                Object.assign(existing, rest)
            } else {
                this.actions[action] = {
                    enabled: actionConfig.enabled || true,
                    active: false,
                    ...actionConfig,
                };
            }
        }
    }

    enableAction(actionName) {
        const action = this.actions[actionName];
        if (!action) return;
        action.enabled = true;
    }

    disableAction(actionName) {
        const action = this.actions[actionName];
        if (!action) return;
        action.enabled = false;
        this.setActionState(actionName, false);
    }

    isActionActive(actionName) {
        const action = this.actions[actionName];
        if (!action) return false;
        if (!action.enabled) return false;
        return action.active === true;
    }

    attach(target, dontEnable) {
        this.target = target;

        window.addEventListener("blur", this.onBlur);
        window.addEventListener("focus", this.onFocus);

        if (!dontEnable) {
            this.enabled = true;
        }

        for (const plugin of this.plugins) {
            plugin.enable();
        }
    }

    detach() {
        this.enabled = false;

        if (!this.target) return

        window.removeEventListener("blur", this.onBlur);
        window.removeEventListener("focus", this.onFocus);

        for (const plugin of this.plugins) {
            plugin.disable();
        }
    }

    onBlur() {
        this.focused = false;

        for (const name in this.actions) {
            this.setActionState(name, false);
        }
    }

    onFocus() {
        this.focused = true;
    }
}