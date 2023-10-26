//xpath
const btn_nav_Login = '#navLoginBtn';
const txt_Email = 'input[type="email"]';
const txt_Password = 'input[type = "password"]';
const btn_Login = 'input[type="submit"]';

export class LoginPage {

    click_NavLogin() {
        cy.get(btn_nav_Login).click();
    }

    inputEmail(email) {
        cy.get(txt_Email).type(email);
    }

    inputPassword(password) {
        cy.get(txt_Password).type(password);
    }

    click_Loginbtn() {
        cy.get(btn_Login).click();
    }

    LoginAccount(email, password) {
        this.click_NavLogin();
        this.inputEmail(email);
        this.inputPassword(password);
        this.click_Loginbtn();
    }

}

export const loginPage = new LoginPage();   