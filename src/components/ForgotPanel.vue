<script setup lang="ts">
import DisplayValidationError from './modals/DisplayValidationError.vue'
import MainImageIcon from './icons/MainImageIcon.vue'
import Main from '../components/functions/ScrollToFunction'
import { useRouter, Router } from 'vue-router'
import { ref, onMounted } from 'vue'

import UserService from '../services/UserService.ts'

const router: Router = useRouter()

const newPassword = ref<string>("")
const phoneNumber = ref<number | null>(null)
const code = ref<number | null>(null)
    
const processStep = ref<number>(1)
const buttonText = ref<string>('Wyślij kod')
const confirmButtonText = ref<string>('Potwierdź')

const displayError = ref<boolean>(false)

const messageContent = ref<string>('')

const isVerificatonCodeNotCorrect = ref<boolean>(false)
const isPhoneNumberNotCorrect = ref<boolean>(false)
const isPasswordNotCorrect = ref<boolean>(false)

const useRedirection = ref<boolean>(router.currentRoute.value.query.redirect === 'true' ? true : false)

const sendCode = async () => {
    displayError.value = false
    validateInput('phoneNumber')

    if (isPhoneNumberNotCorrect.value) {
        return
    }

    buttonText.value = 'Wysyłanie...'

    var response = await UserService.resetPassword(phoneNumber.value)

    if (response) {
        if ((response.code === 'ACCEPTED' && response.message === 'PHONE_NUMBER_EXISTS') || (response.code === 'ACCEPTED' && response.message === 'EMAIL_EXISTS')) {
            processStep.value += 1
        }
        if (response.code === 'BAD_REQUEST' && response.message === 'INVALID_PHONE_NUMBER') {
            messageContent.value = 'Niepoprawny numer telefonu'
            displayError.value = true
        }
    }

    buttonText.value = 'Wyślij kod'
}

const validateInput = (key: string) => {

    if (key === 'phoneNumber') {

        if (phoneNumber.value?.toString().length !== 9) {
            isPhoneNumberNotCorrect.value = true
        }
        else if (phoneNumber.value?.toString().length === 9) {
            isPhoneNumberNotCorrect.value = false
        }
    }
    else if (key === 'password') {

        if (newPassword.value.length < 6) {
            isPasswordNotCorrect.value = true
        }
        else if (newPassword.value.length >= 6) {
            isPasswordNotCorrect.value = false
        }
    }

    else if (key === 'code') {

        if (code.value?.toString().length !== 6) {
            isVerificatonCodeNotCorrect.value = true
        }
        else if (code.value?.toString().length === 6) {
            isVerificatonCodeNotCorrect.value = false
        }
    }
}

const setNewPassword = async () => {

    validateInput('code')
    validateInput('password')
    if (isVerificatonCodeNotCorrect.value || isPasswordNotCorrect.value) {
        return
    }

    confirmButtonText.value = 'Potwierdzanie...'
    var response = await UserService.setNewPassword(phoneNumber.value, code.value, newPassword.value)

    if (response) {
        if (response.code === 'ACCEPTED' && response.message === 'CORRECT_DATA') {
            router.replace({ query: { action: 'signIn' } })
        }
        if (response.code === 'BAD_REQUEST' && response.message === 'INVALID_CODE') {
            displayError.value = true
            messageContent.value = 'Niepoprawny kod'
            confirmButtonText.value = 'Potwierdź'
        }
    }
}

onMounted(() => {
    if (useRedirection.value === true) {
        Main.scrollToElementById('main-part')
    }
    else {
        Main.scrollToTopInstant()
    }
})


</script>

<template>
    <div style="">
        <MainImageIcon style="width: 60%; height: auto; margin-bottom: 20px; display: flex; margin: auto;" class="display-mobile" />
        <div style="width: 100%; margin-bottom: 40px;" v-if="processStep === 1" id="main-part" >
            <div class="title-text" style="margin-bottom: 20px; text-align: center;">
                Zapomniałeś hasła?
            </div>
            <div class="basic-text" style="text-align: center;">
                Podaj numer telefonu aby otrzymać link do zresetowania hasła.
            </div>
        </div>
        <div style="width: 100%; margin-bottom: 40px;" v-if="processStep === 2">
            <div class="title-text" style="margin-bottom: 20px; text-align: center;">
                Ustaw nowe hasło
            </div>
            <div class="basic-text" style="text-align: center;">
                Wpisz nowe hasło i kod aby uzyskać dostęp do konta
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
            <div style="display: flex; align-items: center;" v-if="processStep === 1">
                <span class="icon" v-if="phoneNumber?.toString().length !== 0">
                    +48
                </span>
                <input class="input-main" placeholder="Numer telefonu" max="999999999" type="number" v-model="phoneNumber" :class="{ 'wrong-input': isPhoneNumberNotCorrect, 'set-padding': phoneNumber?.toString().length !== 0 }"  maxlength="9" autocomplete="tel-local"/>
            </div>
            <div v-if="isPhoneNumberNotCorrect">
                <DisplayValidationError msg="Nieprawidłowy format telefonu" />
            </div>
            <div style="display: flex; align-items: center;" v-if="processStep === 2">
                <input class="input-main" placeholder="Kod" type="number" v-model="code" :class="{ 'wrong-input': isVerificatonCodeNotCorrect }" maxlength="6" autocomplete="one-time-code"/>
            </div>
            <div v-if="isVerificatonCodeNotCorrect">
                <DisplayValidationError msg="Kod powinien mieć 6 znaków" />
            </div>
            <div style="display: flex; align-items: center;" v-if="processStep === 2">
                <input class="input-main" placeholder="Nowe hasło" v-model="newPassword" :class="{ 'wrong-input': isPasswordNotCorrect }" maxlength="20" autocomplete="new-password" type="password"/>
            </div>
            <div v-if="isPasswordNotCorrect">
                <DisplayValidationError msg="Hasło musi zawierać co najmniej 6 znaków" />
            </div>
        </div>
        <div v-if="displayError" style="margin-top: 20px;">
            <DisplayValidationError :msg="messageContent" />
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 20px; gap: 30px;" v-if="processStep === 1">
            <div style="width: 50%;">
                <button class="main-button gradient-button" style="font-size: 18px; width: 100%;"
                    @click="router.replace({ query: { action: 'signIn' } })">
                    Cofnij
                </button>
            </div>
            <div style="width: 50%;">
                <button class="main-button orange-button" style="font-size: 18px; width: 100%;" @click="sendCode()"
                    :disabled="buttonText === 'Wysyłanie...'">
                    {{ buttonText }}
                </button>
            </div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 20px; gap: 30px;" v-if="processStep === 2">
            <div style="width: 50%;">
                <!-- <button class="main-button gradient-button" style="font-size: 24px; width: 100%;"
                    @click="router.replace({ query: { action: 'signIn' } })">
                    Cofnij
                </button> -->
            </div>
            <div style="width: 50%;">
                <button class="main-button orange-button" style="font-size: 18px; width: 100%;" @click="setNewPassword()"
                    :disabled="confirmButtonText === 'Potwierdzanie...'">
                    {{ confirmButtonText }}
                </button>
            </div>
        </div>

        <div style="margin-top: 70px; font-size: 24px; text-align: center;">
            <div style="margin-bottom: 15px;">
                Nie masz jeszcze konta?
            </div>
            <div>
                <a style="text-decoration: underline; cursor: pointer;"
                    @click="router.replace({ query: { action: 'signUp' } })">
                    Zarejestruj się!
                </a>
            </div>
        </div>
    </div>
</template>