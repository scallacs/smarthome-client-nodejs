
import { DirectiveDispatcherInterface } from "./directive-dispatcher-interface";
import { IotDirectiveInterface } from "./iot-directive-interface";

export class DirectiveDispatcher implements DirectiveDispatcherInterface {
    protected _registeredDirectives: any = {};

    dispatch(directives: Array<IotDirectiveInterface> | IotDirectiveInterface) {
        if (!Array.isArray(directives)) {
            directives = [directives];
        }
        for (let directive of directives) {
            let actions = this.getDirectiveActions(directive);
            if (actions.length > 0){
                console.log('[DIRECTIVE] ' + directive.fullName() + ' => ' + actions.length + ' action(s) defined');
                for (let action of actions){
                    action(directive);
                }
            }
            else{
                console.warn('[DIRECTIVE] ' + directive.fullName() + ' => NO ACTION REGISTERED' );
                // console.log(this._registeredDirectives);
            }
        }
    }

    getDirectiveActions(directive: IotDirectiveInterface): Array<any> {
        let namespace = directive.namespace();
        if (!(namespace in this._registeredDirectives)) {
            return [];
        }
        if (!(directive.name() in this._registeredDirectives[namespace])) {
            return [];
        }
        return this._registeredDirectives[namespace][directive.name()];
    }

    isRegistered(directive: IotDirectiveInterface) {
        let namespace = directive.namespace();
        if (!(namespace in this._registeredDirectives)) {
            return false;
        }
        if (!(directive.name() in this._registeredDirectives[namespace])) {
            return false;
        }
        return true;
    }

    registerAction(namespace: string, name: string, action: any): void {
        if (!(namespace in this._registeredDirectives)) {
            this._registeredDirectives[namespace] = {};
        }
        if (!(name in this._registeredDirectives[namespace])) {
            this._registeredDirectives[namespace][name] = [];
        }
        console.log('\t-' + namespace + '.' + name + ' registered!')
        this._registeredDirectives[namespace][name].push(action);
    }

}