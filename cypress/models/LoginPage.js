//xpath
const txt_Email = '#username';
const txt_Password = '#password';
const btn_Login = 'input[name="login"]';

export class LoginPage {

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
        this.inputEmail(email);
        this.inputPassword(password);
        this.click_Loginbtn();
    }

}

export const loginPage = new LoginPage();   