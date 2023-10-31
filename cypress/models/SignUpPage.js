const menu_icon = '#menu-icon';
const menu_MyAccount = 'My Account';
const txt_Email = '#reg_email';
const txt_Password = '#reg_password';
const btn_Register = 'input[name="register"]';

export class SignUpPage {

    click_MenuIcon() {
        cy.get(menu_icon).click();
    }

    click_NavMyAccount() {
        cy.contains(menu_MyAccount).click();
    }

    input_Email(email) {
        cy.get(txt_Email).type(email);
    }

    input_Password(password) {
        cy.get(txt_Password).type(password);
    }

    click_Register() {
        cy.get(btn_Register).click();
    }

    signUpAccount(email, password) {
        cy.reload();
        cy.wait(1000);
        this.input_Email(email);
        this.input_Password(password);
        this.click_Register();
    }
    // selectRandomOptionCountry() {
    //     cy.xpath(select_Country).as('countryDropdown'); //gán 1 phần tử đặt tên là countryDropdown
    //     //find option là tìm các phần tử option trong select
    //     cy.get('@countryDropdown').find('option').then((options) => {
    //         const randomIndex = Math.floor(Math.random() * options.length);
    //         const randomOptionValue = options[randomIndex].value;
    //         //lấy phần tử thứ i trong select option = cy.get('select').select(i)
    //         cy.get('@countryDropdown').select(randomOptionValue);
    //     });
    // }

}

export const signUpPage = new SignUpPage();   