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
}