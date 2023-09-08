<script setup lang="ts">
import LandingPageMainIcon from '../components/icons/LandingPageMainIcon.vue'
import LandingPageMapIcon from '../components/icons/LandingPageMapIcon.vue'
import LandingPageCarIcon from '../components/icons/LandingPageCarIcon.vue'
import SearchPanel from '../components/SearchPanel.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

</script>

<template>
    <div style="display: flex; gap: 40px;  align-items: center;" class="display-reverse-block" >
        <div style="width: 50%;" class="display-full" >
            <div class="title-text" style="margin-bottom: 20px; text-align: center;">
                Witamy w TakeMeWith
            </div>
            <div class="basic-text" style="text-align: center; margin: auto; max-width: 450px; min-width: 200px; width: 100%">
                Użyj naszych rozwiązań gwarantujących najefektywniejszy transport dla pasażerów i kierowców.
            </div>
        </div>
        <div style="width: 50%" class="display-full">
            <LandingPageMainIcon style="width: 100%; height: 100%;" />
        </div>
    </div>
    <div style="margin-top: 30px; justify-content: center; display: flex;">
        <SearchPanel />
    </div>
    <div style="margin-top: 80px; display: flex; gap: 20%; padding-bottom: 150px;" class="display-flex-block">
        <div style="width: 40%; display: flex; flex-direction: column;" class="display-reverse-block display-half">
            <div style="margin-top: 10px; margin-bottom: 30px" class="display-mobile">
                <button class="main-button gradient-button display-full" @click="router.push('/ride-list')">
                    Zobacz listę
                </button>
            </div>
            <div>
                <div class="title-text" style="text-align: center; margin-bottom: 20px;">
                    Znajdź przejazd
                </div>
                <div class="basic-text" style="text-align: center;">
                    Skorzystaj z Listy przejazdów aby szybko znaleźć się u celu
                </div>
            </div>
            <div style="margin-top: 30px; width: 100%" class="display-desktop">
                <button class="main-button gradient-button display-full" @click="router.push('/ride-list')">
                    Zobacz listę
                </button>
            </div>
            <div style="margin-top: 30px;">
                <LandingPageMapIcon style="width: 100%; height: auto" />
            </div>
        </div>
        <div style="width: 40%; display: flex; flex-direction: column;" class="display-reverse-block display-half">
            <div style="margin-top: 30px;" class="display-mobile">
                <button class="main-button gradient-button display-full" @click="router.push({path: '/action-panel', query: {action: 'addRide' }})">
                    Dowiedz się więcej
                </button>
            </div>
            <div>
                <div class="title-text" style="text-align: center; margin-bottom: 20px;">
                    Zaoferuj przejazd
                </div>
                <div class="basic-text" style="text-align: center; font-size: 24px; " >
                    Zminimalizuj koszty Twojej podróży oferując przejazd innym
                </div>
            </div>
            <div style="margin-top: 30px; display: flex; justify-content: right;" class="display-desktop" >
                <button class="main-button gradient-button display-full" @click="router.push({path: '/action-panel', query: {action: 'addRide' }})" >
                    Dowiedz się więcej
                </button>
            </div>
            <div style="margin-top: 30px;">
                <LandingPageCarIcon style="width: 100%; height: auto" />
            </div>
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
