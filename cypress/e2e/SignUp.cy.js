import { signUpPage } from "../models/SignUpPage";
import { loginPage } from "../models/LoginPage";
import { common } from "../support/Common";
const Constant = require('../support/Constant');
const randomEmail = common.getRandomEmail();
describe('This test case used to Sign Up - Sign In - Sign Out', () => {

  it('Navigate to Sign up page', () => {
    //navigate to Homepage
    cy.visit("/");
    signUpPage.click_MenuIcon();
    signUpPage.click_NavMyAccount();
    signUpPage.signUpAccount(randomEmail, Constant.PASSWORD)
    loginPage.verify_UserLogin(randomEmail);
  });

});