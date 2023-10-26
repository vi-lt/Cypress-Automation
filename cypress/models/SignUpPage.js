const btn_create_New = 'a[class="transition-all"]';
const txt_NewEmail = '#txtEmailAddress';
const txt_FirstName = '#txtFirstName';
const txt_MiddleInitial = '#txtMiddleInitial';
const txt_LastName = '#txtLastName';
const txt_Password = '#txtPassword';
const txt_PasswordConfirm = '#txtPasswordConfirm';
const txt_SecurityAnswer = '#txtSecurityAnswer';
const btn_checkBox = '#chkNotifyLocal';
const btn_Register = '#btnRegister';

const select_Country = '//select[contains(@id,"Country")]';
const select_Question = '//select[contains(@id,"SecurityQuestion")]';

export class SignUpPage {

    click_CreateNew() {
        cy.get(btn_create_New).click();
    }

    input_NewEmail(email) {
        cy.get(txt_NewEmail).type(email);
    }

    input_FirstName(firstName) {
        cy.get(txt_FirstName).type(firstName);
    }

    input_MiddleInitial(middleInitial) {
        cy.get(txt_MiddleInitial).type(middleInitial);
    }

    input_LastName(lastName) {
        cy.get(txt_LastName).type(lastName);
    }

    input_Password(password) {
        cy.get(txt_Password).type(password);
    }

    input_PasswordConfirm(passwordConfirm) {
        cy.get(txt_PasswordConfirm).type(passwordConfirm);
    }

    input_SecurityAnswer(securityAnswer) {
        cy.get(txt_SecurityAnswer).type(securityAnswer);
    }

    click_CheckBox() {
        cy.get(btn_checkBox).click();
    }

    click_Register() {
        cy.get(btn_Register).click();
    }

    selectRandomOptionCountry() {
        cy.xpath(select_Country).as('countryDropdown'); //gán 1 phần tử đặt tên là countryDropdown
        //find option là tìm các phần tử option trong select
        cy.get('@countryDropdown').find('option').then((options) => {
            const randomIndex = Math.floor(Math.random() * options.length);
            const randomOptionValue = options[randomIndex].value;
            //lấy phần tử thứ i trong select option = cy.get('select').select(i)
            cy.get('@countryDropdown').select(randomOptionValue);
        });
    }

    selectRandomOptionQuestion() {
        cy.xpath(select_Question).as('questionDropdown'); //gán 1 phần tử đặt tên là countryDropdown
        //find option là tìm các phần tử option trong select
        cy.get('@questionDropdown').find('option').then((options) => {
            const randomIndex = Math.floor(Math.random() * options.length);
            const randomOptionValue = options[randomIndex].value;
            //lấy phần tử thứ i trong select option = cy.get('select').select(i)
            cy.get('@questionDropdown').select(randomOptionValue);
        });
    }


}

export const signUpPage = new SignUpPage();   