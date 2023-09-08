<script setup lang="ts">
import LoginPanel from '../components/LoginPanel.vue'
import RegisterPanel from '../components/RegisterPanel.vue'
import ForgotPanel from '../components/ForgotPanel.vue'
import ProfileViewPanel from '../components/ProfileViewPanel.vue'
import AddRidePanel from '../components/AddRidePanel.vue'
import MainImageIcon from '../components/icons/MainImageIcon.vue'
import LandingPageCarIcon from '../components/icons/LandingPageCarIcon.vue'

import { ref, watchEffect } from 'vue'
import { useRouter, Router } from 'vue-router'

import UserService from '../services/UserService.ts'

const router: Router = useRouter()

const actionType = ref<string>(router.currentRoute.value.query.action as string || "")
const token = ref<string>(localStorage.getItem('takemewith-token') || "")

watchEffect(async () => {
    actionType.value = router.currentRoute.value.query.action as string || ""
    token.value = localStorage.getItem('takemewith-token') || ""


    let response : any
    response = await UserService.getLoginCheck()

    if (actionType.value === 'signIn' || actionType.value === 'signUp' || actionType.value === 'forgotPassword') {
        if (response.code === 'ACCEPTED' && response.message === 'TOKEN_VALID') {
            router.replace({ query: { action: 'profileView' } })
        }
    }
    else if (actionType.value === 'profileView' || actionType.value === 'addRide') {
        if (!token.value || (response.code === 'FORBIDDEN' && response.message === 'ACCESS_DENIED')) {
            localStorage.removeItem('takemewith-token')
            router.replace({ query: { action: 'signIn' } })
        }
    }
})

</script>

<template>
    <div style="display: flex; gap: 20%; padding-bottom: 150px;" class="display-flex-block">
        <div style="width: 50%;" class="display-full">
            <div style="width: 100%; margin-bottom: 40px;" v-if="actionType === 'addRide'">
                <div class="title-text" style="margin-bottom: 20px; text-align: center;">
                    Zaoferuj przejazd
                </div>
                <div class="basic-text" style="text-align: center;">
                    Uzupełnij dane aby dodać swoją trasę do Listy przejazdów i zminimalizować koszty podróży
                </div>
            </div>
            <LoginPanel v-if="actionType === 'signIn'" />
            <RegisterPanel v-else-if="actionType === 'signUp'" />
            <ForgotPanel v-else-if="actionType === 'forgotPassword'" />
            <MainImageIcon style="width: 100%; height: auto;" v-else-if="actionType === 'profileView'" />
            <LandingPageCarIcon style="width: 100%; height: auto; margin-bottom: 20px;"
                v-else-if="actionType === 'addRide'" />

        </div>
        <div style="width: 50%;" class="display-full">
            <MainImageIcon style="width: 100%; height: auto;" class="display-desktop"
                v-if="actionType !== 'profileView' && actionType !== 'addRide'" />
            <AddRidePanel v-else-if="actionType === 'addRide'" />
            <ProfileViewPanel v-else />
        </div>
    </div>
</template>

<style scoped>
@media (max-width: 1100px) {
    .display-reverse-block {
        flex-direction: column-reverse !important;
        gap: 30px !important;
        justify-content: center;
        display: flex;
    }

    .display-flex-block {
        flex-direction: column !important;
        gap: 30px !important;
    }
}
</style>
