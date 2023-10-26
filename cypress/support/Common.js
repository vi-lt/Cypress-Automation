export class Common {

    getRandomNumber(min, max) {
        // Generate a random number within the specified range
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomFirstName() {
        const names = ["Henry", "Blake", "Vi", "Quynh", "Tammy", "PeTiu"];
        const randomIndex = Math.floor(Math.random() * names.length);
        const randomFirstName = names[randomIndex];
        return randomFirstName;
    }

    getRandomLastName() {
        const names = ["Automation", "QA"];
        const randomIndex = Math.floor(Math.random() * names.length);
        const randomLastName = names[randomIndex] + this.getRandomNumber(1000000, 9999999);
        return randomLastName;
    }

    getRandomEmail() {
        const randomEmail = this.getRandomFirstName() + this.getRandomLastName() + '@gmailos.com';
        return randomEmail;
    }
}

export const common = new Common();   
