//xpath
const txt_Email = '#username';
const txt_Password = '#password';
const btn_Login = 'input[name="login"]';
const lable_NameAccount = 'strong';

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

    verify_UserLogin(name) {
        var expectedName = name.substring(0, name.indexOf('@'));
        cy.get(lable_NameAccount).should('have.text', expectedName);
    }

    LoginAccount(email, password) {
        this.inputEmail(email);
        this.inputPassword(password);
        this.click_Loginbtn();
    }

}

export const loginPage = new LoginPage();   