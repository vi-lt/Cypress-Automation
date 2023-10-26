import { loginPage } from "../models/LoginPage";
import { signUpPage } from "../models/SignUpPage";
import { common } from "../support/Common";

describe('This test case used to Sign Up - Sign In - Sign Out', () => {

  it('Navigate to Sign up page', () => {
    //navigate to Homepage
    cy.visit("/");
    loginPage.click_NavLogin();
    signUpPage.click_CreateNew();
    //compare 2 string
    signUpPage.input_NewEmail(common.getRandomEmail());
    signUpPage.input_FirstName(common.getRandomFirstName());
    signUpPage.input_MiddleInitial('a');
    signUpPage.input_LastName(common.getRandomLastName());
    signUpPage.selectRandomOptionCountry();
    //signUpPage.input_Password();
    //signUpPage.input_PasswordConfirm();
    signUpPage.selectRandomOptionQuestion();
    //signUpPage.input_SecurityAnswer();
    signUpPage.click_CheckBox();
    //signUpPage.click_Register();
  });

  // it('Sign up an Account', () => {
  //     signUp.inputEmailAddress.type(common.getRandomName());

  // });

});