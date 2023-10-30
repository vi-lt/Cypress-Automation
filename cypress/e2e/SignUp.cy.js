import { signUpPage } from "../models/SignUpPage";
import { common } from "../support/Common";
const Constant = require('../support/Constant');

describe('This test case used to Sign Up - Sign In - Sign Out', () => {

  it('Navigate to Sign up page', () => {
    //navigate to Homepage
    cy.visit("/");
    signUpPage.click_MenuIcon();
    signUpPage.click_NavMyAccount();
    signUpPage.input_Email(common.getRandomEmail());
    signUpPage.input_Password(Constant.PASSWORD);
    cy.wait(3000);
    signUpPage.click_Register();
  });

});