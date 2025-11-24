export class InputContoller {
    constructor(actionsToBind = {}, target) {
        this.enabled = false;
        this.focus = true;
        this.target = target;
        this.actions = {};
        this.bindActions(actionsToBind);
    }

    bindActions(actionsToBind) {
        for (const action in actionsToBind) {
            const actionConfig = actionsToBind[action];
            this.actions[action] = actionConfig;
        }
    }
}