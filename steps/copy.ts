const cpx = require("cpx");

export const copyFiles = (src: string, dest: string, options?: any): Promise<any> => {

    return new Promise((resolve, reject) => {

        if (options) {
            cpx.copy(src, dest, options, (err) => {
                if (err) {
                    reject();
                }

                resolve();
            });
        } else {
            cpx.copy(src, dest, (err) => {
                if (err) {
                    reject();
                }

                resolve();
            });
        }

    });

}
