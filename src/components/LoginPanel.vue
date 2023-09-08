<script setup lang="ts">
import DisplayValidationError from './modals/DisplayValidationError.vue'
import MainImageIcon from './icons/MainImageIcon.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import Main from '../components/functions/ScrollToFunction'
import UserService from '../services/UserService.ts'

const router = useRouter()

const phoneNumber = ref<number | null>(null)
const password = ref<string>("")

const isPhoneNumberNotCorrect = ref<boolean>(false)
const isPasswordNotCorrect = ref<Boolean>(false)

const buttonText = ref<string>('Zaloguj się')
const messageContent = ref<string>('')
const displayError = ref<boolean>(false)

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

        if (password.value.length < 6) {
            isPasswordNotCorrect.value = true
        }
        else if (password.value.length >= 6) {
            isPasswordNotCorrect.value = false
        }
    }
}

const loginUser = async () => {

    validateInput('password')
    validateInput('phoneNumber')
    if (isPasswordNotCorrect.value || isPhoneNumberNotCorrect.value) {
        return
    }

    buttonText.value = 'Logowanie...'
    displayError.value = false

    var response = await UserService.loginUser(phoneNumber.value, password.value)

    if (response) {
        if (response.code === 'ACCEPTED' && response.message === 'CORRECT_LOGIN_DATA') {
            localStorage.setItem('takemewith-token', response.token)
            router.replace({ query: { action: 'profileView' } })
        }
        else if (response.message === 'WRONG_DATA' && response.code === 'UNAUTHORIZED') {
            displayError.value = true
            messageContent.value = 'Niepoprawne dane'
        }
    }

    buttonText.value = 'Zaloguj się'
}

onMounted(() => {
    Main.scrollToElementById('main-part')
})

</script>

<template>
    <div style="">
        <MainImageIcon style="width: 60%; height: auto; margin-bottom: 20px; display: flex; margin: auto;" class="display-mobile" />
        <div style="width: 100%; margin-bottom: 40px;" id="main-part" >
            <div class="title-text" style="margin-bottom: 20px; text-align: center;">
                Zacznij korzystać z TakeMeWith
            </div>
            <div class="basic-text" style="text-align: center; font-size: 24px;">
                Zaloguj się lub utwórz nowe konto.
            </div>
        </div>
        <div class="action-field"
            style="display: block; height: fit-content; display: flex; flex-direction: column; gap: 20px; padding: 24px; justify-content: center;">
            <div style="display: flex; align-items: center;">
                <span class="icon" v-if="phoneNumber?.toString().length !== 0">
                    +48
                </span>
                <input class="input-main" v-model="phoneNumber" placeholder="Numer telefonu" :class="{ 'wrong-input': isPhoneNumberNotCorrect, 'set-padding': phoneNumber?.toString().length !== 0 }" type="number" maxlength="9" autocomplete="tel-local"/>
            </div>
            <div style="display: flex; align-items: center;" >
                <input class="input-main" placeholder="Hasło" v-model="password" :class="{ 'wrong-input': isPasswordNotCorrect }"  maxlength="20" type="password" autocomplete="password"/>
            </div>
            <div v-if="displayError">
                <DisplayValidationError :msg="messageContent" />
            </div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <a style="text-decoration: underline; cursor: pointer;"
                @click="router.replace({ query: { action: 'forgotPassword', redirect: 'true' } })">
                Zapomniałeś hasła?
            </a>
            <div style="width: 50%;">
                <button class="main-button orange-button" style="width: 100%; font-size: 18px;" @click="loginUser()"
                    :disabled="buttonText === 'Logowanie...'">
                    {{ buttonText }}
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