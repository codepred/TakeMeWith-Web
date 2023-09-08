<script setup lang="ts">
import LogoFull from './icons/LogoFull.vue';
import { useRouter, Router } from 'vue-router'
import { ref, watchEffect } from 'vue'
import LogoShort from './icons/LogoShort.vue';
import HamburgerMenuIcon from './icons/HamburgerMenuIcon.vue';

const router: Router = useRouter()

const token = ref<string>(localStorage.getItem('takemewith-token') || "")

const showButtonPanel = ref<boolean>(false)

const redirectToOtherPanel = (option: string) => {
  let url = String(window.location.href)

  showButtonPanel.value = false

  if (option === 'rideList') {
    if (url.includes('ride-list')) {
      router.push({ path: '/ride-list', query: { redirectToList: 'true' } })
    }
    else {
      router.push('/ride-list')
    }
  }
  else if (option === 'addRide') {
    router.push({ path: '/action-panel', query: { action: 'addRide' } })
  }
  else if (option === 'signIn') {
    router.push({ path: '/action-panel', query: { action: 'signIn' } })
  }
  else if (option === 'profileView') {
    router.push({ path: '/action-panel', query: { action: 'profileView' } })
  }

  refreshTokenValue()
}

const refreshTokenValue = () => {
  token.value = localStorage.getItem('takemewith-token') || ""
} 


watchEffect(() => {
  refreshTokenValue()
})

</script>

<template>
  <div
    style="width: 100%; height: fit-content; display: flex; justify-content: space-between; align-items: center; margin-bottom: 50px; padding: 24px 20px 0px 20px;"
    class="remove-padding-desktop">
    <div>
      <LogoFull class="display-desktop" />
      <LogoShort class="display-mobile" />
    </div>
    <div class="button-panel">
      <button class="main-button display-desktop" @click="redirectToOtherPanel('rideList')">
        Lista przejazdów
      </button>
      <button class="main-button display-desktop" @click="redirectToOtherPanel('addRide')">
        Zaoferuj przejazd
      </button>
      <button class="main-button gradient-button display-desktop" style="color: #FAFAFA"
        @click="redirectToOtherPanel('signIn')" v-if="!token">
        Zaloguj się
      </button>
      <button class="main-button gradient-button display-desktop" style="color: #FAFAFA"
        @click="redirectToOtherPanel('profileView')" v-if="token">
        Wyświetl profil
      </button>
      <div style="cursor: pointer;" @click="showButtonPanel = !showButtonPanel" v-if="!showButtonPanel"
        class="display-mobile">
        <HamburgerMenuIcon />
      </div>
      <div style="cursor: pointer; width: fit-content; margin-right: -10px; height: 48px;"
        @click="showButtonPanel = !showButtonPanel" class="display-mobile" v-if="showButtonPanel">
        <img src="../assets/icon-cross.png" style="width: 50px; height: auto;" />
      </div>
    </div>
  </div>
  <div style="width: 100%; display: flex; justify-content: right;" v-if="showButtonPanel" class="display-mobile">
    <div
      style="z-index: 10; background-color:#FAFAFA; position: absolute; margin-top: -35px; border-radius: 12px; width: fit-content; display: flex; flex-direction: column; gap: 15px; border: 1px solid var(--main-orange); margin-left: auto; padding: 20px; margin-bottom: 20px">
      <button class="main-button" @click="redirectToOtherPanel('rideList')" style="width: 155px; margin-left: auto; ">
        Lista przejazdów
      </button>
      <button class="main-button" @click="redirectToOtherPanel('addRide')" style="width: 155px; margin-left: auto;">
        Zaoferuj przejazd
      </button>
      <button class="main-button gradient-button" style="color: #FAFAFA; margin: auto; width: 100%;"
        @click="redirectToOtherPanel('signIn')" v-if="!token">
        Zaloguj się
      </button>
      <button class="main-button gradient-button" style="color: #FAFAFA; margin: auto; width: 100%;"
        @click="redirectToOtherPanel('profileView')" v-if="token">
        Wyświetl profil
      </button>
    </div>
  </div>
</template>

<style scoped>
.button-panel {
  display: flex;
  gap: 16px;
}

@media (min-width: 1101px) {
  .remove-padding-desktop {
    padding: 0 !important;
  }
}
</style>