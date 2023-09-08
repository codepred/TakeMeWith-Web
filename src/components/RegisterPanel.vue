<script setup lang="ts">
import DisplayValidationError from './modals/DisplayValidationError.vue'
import MainImageIcon from './icons/MainImageIcon.vue'
import { useRouter, Router } from 'vue-router'
import { ref, Ref, onMounted } from 'vue'
import Main from '../components/functions/ScrollToFunction'
import UserService from '../services/UserService.ts'

const router: Router = useRouter()

const buttonText = ref<string>('Dalej')
const confirmButtonText = ref<string>('Zarejestruj się')
const messageContent = ref<string>('')
const displayError = ref<boolean>(false)

interface FormObject {
    name: string,
    lastname: string,
    password: string,
    email: string,
    phoneNumber: number | null,
    verificationCode: number | null,
    [key: string]: string | number | null
}

const formObject: Ref<FormObject> = ref(
    {
        name: "",
        lastname: "",
        password: "",
        email: "",
        phoneNumber: null,
        verificationCode: null,
    }
)

const processStep = ref<number>(1)

interface ValidationObject {
    name: boolean,
    lastname: boolean,
    password: boolean,
    email: boolean,
    phoneNumber: boolean,
    verificationCode: boolean,
    [key: string]: boolean
}

const validationObject: Ref<ValidationObject> = ref(
    {
        name: false,
        lastname: false,
        password: false,
        email: false,
        phoneNumber: false,
        verificationCode: false,
    }
)

const validateInput = (key: string) => {

    if (formObject.value[key]?.toString().length === 0) {
        validationObject.value[key] = true;
    }

    else {
        validationObject.value[key] = false;
    }

    if (key === 'phoneNumber') {
        if (formObject.value[key]?.toString().length !== 9) {
            validationObject.value[key] = true;
        }
        else {
            validationObject.value[key] = false;
        }
    }
    else if (key === 'email') {
        if (formObject.value[key].length <= 3 || !formObject.value[key].includes('@')) {
            validationObject.value[key] = true;
        }
    }
    else if (key === 'password') {
        if (formObject.value[key].length <= 6) {
            validationObject.value[key] = true;
        }
    }
    else if (key === 'verificationCode') {
        if (formObject.value[key]?.toString().length !== 6) {
            validationObject.value[key] = true;
        }
        else if (formObject.value[key]?.toString().length === 6) {
            validationObject.value[key] = false;
        }
    }
}

const setNextStep = () => {

    for (const key of Object.keys(formObject.value)) {
        const temporaryValue = formObject.value[key];

        if (temporaryValue?.toString().length === 0 && key !== 'verificationCode') {
            validationObject.value[key] = true;
        }

        if (temporaryValue?.toString().length !== 0 && key !== 'verificationCode') {
            validationObject.value[key] = false;
        }
    }

    const anyTrue = Object.entries(validationObject.value).some(([key, value]) => {
        return key !== 'verificationCode' && value === true;
    });

    if (anyTrue) {
        return
    }

    registerUser()

}

const registerUser = async () => {

    displayError.value = false
    buttonText.value = 'Potwierdzanie...'

    var response = await UserService.registerUser(formObject.value)

    if (response) {
        if (response.code === 'ACCEPTED' && response.message === 'DATA_SUCCESFULY_ADDED') {
            processStep.value = 2
            Main.scrollToElementById('confirm-div')
        }
        else if (response.code === 'BAD_REQUEST' && response.message === 'PHONE_NUMBER_IS_TAKEN') {
            displayError.value = true
            messageContent.value = 'Użytkownik jest już zarejestrowany'
        }
    }

    buttonText.value = 'Dalej'

}

const checkVerificationCode = async () => {

    displayError.value = false

    validateInput('verificationCode')
    console.log(validationObject.value.verificationCode)
    if (validationObject.value.verificationCode) {
        displayError.value = true
        messageContent.value = 'Kod powinien mieć 6 znaków'
        return
    }

    confirmButtonText.value = 'Rejestrowanie...'
    
    var response = await UserService.verifyAccount(formObject.value.phoneNumber, formObject.value.verificationCode)

    if (response) {
        if (response.code === 'ACCEPTED' && response.message === 'REGISTRATION_CONFIRMED') {
            localStorage.setItem('takemewith-token', response.token)
            router.replace({ query: { action: 'profileView' } })
        }
        else if (response.code === 'BAD_REQUEST' && response.message === 'INVALID_CODE') {
            displayError.value = true
            messageContent.value = 'Kod jest niepoprawny'
        }
    }

    confirmButtonText.value = 'Zarejestruj się'
}

onMounted(() => {
    Main.scrollToElementById('main-part')
})


</script>

<template>
    <div style="">
        <MainImageIcon style="width: 60%; height: auto; margin-bottom: 20px; display: flex; margin: auto;"
            class="display-mobile" />
        <div style="width: 100%; margin-bottom: 40px;" id="main-part">
            <div class="title-text" style="margin-bottom: 20px; text-align: center;">
                Utwórz konto TakeMeWith
            </div>
            <div class="basic-text" style="text-align: center;">
                Uzupełnij dane aby założyć nowy profil użytkownika.
            </div>
        </div>
        <div style="display: flex; width: 100%; padding: 0 24px; gap: 20px; margin-bottom: 15px;" v-if="processStep === 1">
            <div style="border-bottom: solid 3px var(--main-blue); width: 50%;">
            </div>
            <div style="border-bottom: solid 3px #CCD6ED; width: 50%;">
            </div>
        </div>
        <div style="display: flex; width: 100%; padding: 0 24px; gap: 20px; margin-bottom: 15px;"
            v-else-if="processStep === 2">
            <div style="border-bottom: solid 3px #CCD6ED; width: 50%;">
            </div>
            <div style="border-bottom: solid 3px var(--main-blue); width: 50%;">
            </div>
        </div>
        <div class="action-field"
            style="display: block; height: fit-content; display: flex; flex-direction: column; gap: 20px; padding: 24px; justify-content: center;">
            <div style="display: flex; align-items: center; gap: 10px;" v-if="processStep === 1" class="display-flex-block">
                <div style="width: 50%; display: flex; align-items: center;" class="display-full">
                    <input class="input-main" v-model="formObject.name" placeholder="Imię"
                        :class="{ 'wrong-input': validationObject.lastname }" maxlength="15" autocomplete="given-name"
                        @keyup="validateInput('name')" />
                </div>
                <div style="width: 50%; display: flex; align-items: center;" class="display-full">
                    <input class="input-main" v-model="formObject.lastname" placeholder="Nazwisko"
                        :class="{ 'wrong-input': validationObject.lastname }" @keyup="validateInput('lastname')"
                        maxlength="15" autocomplete="family-name" />
                </div>
            </div>
            <div style="display: flex; align-items: center;" v-if="processStep === 1">
                <input class="input-main" v-model="formObject.password" placeholder="Hasło"
                    :class="{ 'wrong-input': validationObject.password }" maxlength="30" type="password"
                    autocomplete="new-password" @keyup="validateInput('password')" />
            </div>
            <DisplayValidationError msg="Hasło musi zawierać co najmniej 6 znaków" v-if="validationObject.password" />
            <div style="display: flex; align-items: center;" v-if="processStep === 1">
                <span class="icon" v-if="formObject.phoneNumber?.toString().length !== 0">
                    +48
                </span>
                <input class="input-main" placeholder="Numer telefonu" v-model="formObject.phoneNumber" type="number"
                    autocomplete="tel-local"
                    :class="{ 'wrong-input': validationObject.phoneNumber, 'set-padding': formObject.phoneNumber?.toString().length !== 0 }"
                    @keyup="validateInput('phoneNumber')" maxlength="9" />
            </div>
            <div style="display: flex; align-items: center;" v-if="processStep === 1">
                <input class="input-main" placeholder="Adres email (opcjonalnie)" v-model="formObject.email"
                    :class="{ 'wrong-input': validationObject.email }" maxlength="30" autocomplete="email" />
            </div>
            <div style="display: flex; align-items: center;" v-else-if="processStep === 2" >
                <input class="input-main" placeholder="Wpisz kod wysłany na nr telefonu" v-model="formObject.verificationCode" type="number" autocomplete="one-time-code"
                    :class="{ 'wrong-input': validationObject.verificationCode }" maxlength="6"
                    @keyup="validateInput('verificationCode')" />
            </div>
            <div style="display: none;" id="confirm-div">
            </div>
            <div v-if="displayError">
                <DisplayValidationError :msg="messageContent" />
            </div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <div style="width: 100%;">
                <button class="main-button orange-button" style="font-size: 18px; width: 100%;" @click="setNextStep()"
                    :disabled="buttonText === 'Potwierdzanie...'" v-if="processStep === 1">
                    {{ buttonText }}
                </button>
                <button class="main-button orange-button" style="font-size: 18px; width: 100%;"
                    @click="checkVerificationCode()" :disabled="buttonText === 'Rejestrowanie...'"
                    v-else-if="processStep === 2">
                    {{ confirmButtonText }}
                </button>
            </div>
        </div>
        <div style="margin-top: 70px; font-size: 24px; text-align: center;">
            <div style="margin-bottom: 15px;">
                Masz już konto?
            </div>
            <div>
                <a style="text-decoration: underline; cursor: pointer;"
                    @click="router.replace({ query: { action: 'signIn' } })">
                    Zaloguj się!
                </a>
            </div>
        </div>
</div></template>