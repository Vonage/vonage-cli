import VonageCommand from '@vonage/cli-utils';

export default abstract class NumberInsightCommand<T>
    extends VonageCommand<typeof NumberInsightCommand> {
    async catch(error: any) {
        return super.catch(error);
    }

    getInsights(number, level = 'basic'): any {
        return new Promise((res, rej) => {
            this.vonage.numberInsight.get(
                { level: level, number: number },
                (error: any, result: any) => {
                    if (error) {
                        rej(error);
                    } else {
                        res(result);
                    }
                },
            );
        });
    }
}
