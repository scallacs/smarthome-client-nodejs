
import { DirectiveDispatcherInterface } from "./directive-dispatcher-interface";
import { IotDirectiveInterface } from "./iot-directive-interface";

export class DirectiveDispatcher implements DirectiveDispatcherInterface {
    protected _registeredDirectives: {[key: string]: any} = {};

    dispatch(directives: Array<IotDirectiveInterface> | IotDirectiveInterface) {
        if (!Array.isArray(directives)) {
            directives = [directives];
        }
        for (let directive of directives) {
            let actions = this.getDirectiveActions(directive);
            if (actions.length > 0){
                console.log('[DIRECTIVE] ' + directive.fullName() + ' => ' + actions.length + ' action(s) defined');
                let index = 0;
                for (let action of actions){
                    console.log('\t- ' + (index + 1) + ') Running...');
                    action(directive);
                    index++;
                }
            }
            else{
                console.warn('[DIRECTIVE] ' + directive.fullName() + ' => NO ACTION REGISTERED' );
                // console.log(this._registeredDirectives);
            }
        }
    }

    getDirectiveActions(directive: IotDirectiveInterface): Array<any> {
        let actionId = directive.fullName();
        // let namespace = directive.namespace();
        // if (!(namespace in this._registeredDirectives)) {
        //     return [];
        // }
        // if (!(directive.name() in this._registeredDirectives[namespace])) {
        //     return [];
        // }
        if (!(actionId in this._registeredDirectives)) {
            return [];
        }
        // return this._registeredDirectives[namespace][directive.name()];
        return this._registeredDirectives[actionId];
    }

    isRegistered(directive: IotDirectiveInterface) {
        let actionId = directive.fullName();
        // if (!(namespace in this._registeredDirectives)) {
        //     return false;
        // }
        // if (!(directive.name() in this._registeredDirectives[namespace])) {
        //     return false;
        // }
        if (!(actionId in this._registeredDirectives)) {
            return false;
        }
        return true;
    }

    registerAction(actionId: string, action: any): void {
        if (!(actionId in this._registeredDirectives)) {
            this._registeredDirectives[actionId] = [];
        }
        // if (!(name in this._registeredDirectives[namespace])) {
        //     this._registeredDirectives[namespace][name] = [];
        // }
        // console.log('\t-' + namespace + '.' + name + ' registered!')
        console.log('\t-' + actionId + ' registered!');
        // this._registeredDirectives[namespace][name].push(action);
        this._registeredDirectives[actionId].push(action);
    }

}