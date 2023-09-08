<script setup lang="ts">
import PhoneIcon from './icons/PhoneIcon.vue'
import { useRouter, Router } from 'vue-router'
import { onMounted, ref, Ref } from 'vue'
import Main from '../components/functions/ScrollToFunction'
import UserService from '../services/UserService.ts'

const router: Router = useRouter()

interface UserData {
    name: string,
    lastName: string,
    phoneNumber: number | null,
    email: string
}

const userData: Ref<UserData> = ref(
    {
        name: "",
        lastName: "",
        phoneNumber: null,
        email: "",
    }
)

const logoutUser = () => {
    localStorage.removeItem('takemewith-token')
    router.replace({ query: { action: 'signIn' } })
}

const getUserData = async () => {
    var response = await UserService.getUserData()

    if (response) {
        userData.value = response
    }
}

onMounted(() => {
    Main.scrollToTopInstant()
    getUserData()
})

</script>

<template>
    <div style="">
        <div style="width: 100%; margin-bottom: 40px;">
            <div class="title-text" style="margin-bottom: 20px; text-align: center; word-break: break-word;">
                Witaj ponownie {{ userData.name }}!
            </div>
        </div>
        <div class="action-field"
            style="display: block; height: fit-content; display: flex; gap: 20px; padding: 12px 16px;">
            <div
                style="width: 100%; height: 100%; display: flex; flex-direction: column; gap: 10px; justify-content: center;">
                <div class="white-field" style="width: 100%; height: 50%; display: flex; align-items: center; gap: 12px;">
                    <div style="display: flex;">
                        <img src="../assets/default-profile.png" height="25" alt="">
                    </div>
                    <div style="">
                        {{ userData.name + ' ' + userData.lastName }}
                    </div>
                </div>
                <div class="white-field" style="width: 100%; height: 50%; display: flex; gap: 10px; align-items: center;">
                    <div style="display: flex;">
                        <PhoneIcon style="width: auto; height: 30px;" />
                    </div>
                    <div style="">
                        {{ userData.phoneNumber }}
                    </div>
                </div>
            </div>
        </div>
        <div class="action-field gradient-button"
            style="height: fit-content; min-height: 50px; font-size: 18px; margin-top: 40px; display: flex; justify-content: space-between; align-items: center;">
            <div style="color: #FAFAFA; padding: 12px 16px; height: 100%; width: 60%;">
                Historia przejazdów
            </div>
            <div
                style="cursor: not-allowed; background-color: #FAFAFA; color: #263238; padding: 16px; font-size: 14px; height: 100%; width: 40%; display: flex; text-align: center; justify-content: center; border: 2px solid var(--main-orange); border-radius: 12px; display: flex; align-items: center;">
                Wkrótce dostępne
            </div>
        </div>
        <div class="action-field gradient-button"
            style="height: fit-content; min-height: 50px; font-size: 18px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div style="color: #FAFAFA; padding: 12px 16px; height: 100%; width: 60%;">
                Twoje oferty przejazdów
            </div>
            <div
                style="cursor: not-allowed; background-color: #FAFAFA; color: #263238; padding: 16px; font-size: 14px; height: 100%; width: 40%; display: flex; justify-content: center; border: 2px solid var(--main-orange); text-align: center; border-radius: 12px; display: flex; align-items: center;">
                Wkrótce dostępne
            </div>
        </div>
        <div
            style="cursor: pointer; margin-top: 20px; background-color: #FAFAFA; color: #263238; font-size: 14px; height: 100%; width: 40%; display: flex; justify-content: center; border: 2px solid var(--main-orange); padding: 12px 16px; border-radius: 12px; display: flex; align-items: center;" @click="logoutUser()">
            Wyloguj
        </div>
    </div>
</template>