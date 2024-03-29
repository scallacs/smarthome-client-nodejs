import {
    Command,
    command,
    param,
    option
} from 'clime';

@command({
    description: 'This is a command for printing a greeting message',
})
export default class extends Command {

    execute(
        @param({
            description: 'Your loud name',
            required: true,
        })
        name: string,
    ) {
        return `Hello, ${name}!`;
    }

}