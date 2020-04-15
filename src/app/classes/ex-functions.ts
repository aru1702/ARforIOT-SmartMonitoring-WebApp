export class ExFunctions {

    public static getUTCTime () {
        let newDate = new Date();
        
        const dateYear = newDate.getUTCFullYear();
        const dateMonth = newDate.getUTCMonth();
        const dateDay = newDate.getUTCDate();
        const dateHour = newDate.getUTCHours();
        const dateMin = newDate.getUTCMinutes();
        const dateSec = newDate.getUTCSeconds();

        return new Date(
            dateYear,
            dateMonth,
            dateDay,
            dateHour,
            dateMin,
            dateSec,
            0
        );
    }

    public static checkLocalSession (lastLogin: Date) {
        let returnV = false;

        const nowDate = this.getUTCTime();
        const diffTime = nowDate.getTime() - lastLogin.getTime();
        
        if (diffTime < 3600000) {
            returnV = true;
        }

        return returnV;
    }

}
