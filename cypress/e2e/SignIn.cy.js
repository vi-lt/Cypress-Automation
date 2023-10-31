import { loginPage } from "../models/LoginPage";
import { signUpPage } from "../models/SignUpPage";
const Constant = require('../support/Constant');

describe('This test case used to Sign Up - Sign In - Sign Out', () => {

    it('Navigate to Sign up page', () => {
        //navigate to Homepage
        cy.visit("/");
        signUpPage.click_MenuIcon();
        signUpPage.click_NavMyAccount();
        loginPage.LoginAccount(Constant.USERNAME, Constant.PASSWORD);
        loginPage.verify_UserLogin(Constant.USERNAME);
    });

});