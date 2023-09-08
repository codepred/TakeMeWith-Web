<script setup lang="ts">
import { onMounted, ref, Ref, watch, watchEffect } from 'vue'
import CalendarIcon from './icons/CalendarIcon.vue';
import ClockIcon from './icons/ClockIcon.vue';
import GpsIcon from './icons/GpsIcon.vue';
import FlagIcon from './icons/FlagIcon.vue';
import PhoneIcon from './icons/PhoneIcon.vue'
import MapIcon from './icons/MapIcon.vue'
import SuccessTickIcon from './icons/SuccessTickIcon.vue'
import UserService from '../services/UserService';
import Main from '../components/functions/ScrollToFunction'
import QueryFunction from './functions/RemoveValueFromQuery'
import SpinnerModal from './modals/SpinnerModal.vue'

import { useRouter, Router } from 'vue-router'


const router: Router = useRouter()

const numberOfRides = ref<number>(0)

const isPhoneNumberVisible = ref<Array<boolean>>(new Array(500).fill(false))
const displaySuccess = ref<Array<boolean>>(new Array(500).fill(false))

const start = ref<string>(router.currentRoute.value.query.start as string || "")
const destination = ref<string>(router.currentRoute.value.query.destination as string || "")
const rideDate = ref<string>(router.currentRoute.value.query.date as string || "")
const selectedPageNumber = ref<number>(1)
const redirectToList = ref<boolean>(router.currentRoute.value.query.redirectToList === 'true' ? true : false)

const isLoadingInProgress = ref<boolean>(false)

interface RideList {
  start: string;
  distanceFromStart: number | null;
  destination: string;
  startDate: Date;
  startHour: string;
  driver: string;
  phoneNumber: number | null;
}

// const rideList: Ref<RideList> = ref({
//   start: "",
//   distanceFromStart:  null,
//   destination: "",
//   startDate: new Date(),
//   startHour: "",
//   driver: "",
//   phoneNumber: null,
// })

const rideList: Ref<RideList[]> = ref([])



const setVisibility = (index: string | number) => {
  index = Number(index)
  if (isPhoneNumberVisible.value[index]) {
    isPhoneNumberVisible.value[index] = false
  }
  else if (isPhoneNumberVisible.value[index] === false) {
    isPhoneNumberVisible.value.fill(false)
    isPhoneNumberVisible.value[index] = true
  }
}

const copyTextToClipboard = (phoneNumber: number | null, index: string | number) => {
  index = Number(index)

  if (typeof phoneNumber === 'number') {
    navigator.clipboard.writeText(phoneNumber.toString());
  }

  displaySuccess.value[Number(index)] = true

  setTimeout(() => {
    displaySuccess.value[Number(index)] = false
  }, 1500);
}

const loadRides = async () => {
  isLoadingInProgress.value = true
  var response = await UserService.getRideList([start.value, destination.value, rideDate.value], selectedPageNumber.value)

  if (response) {
    rideList.value = response
    numberOfRides.value = Object.keys(rideList.value).length
  }
  isLoadingInProgress.value = false
}

watchEffect(() => {
  start.value = router.currentRoute.value.query.start as string || ""
  destination.value = router.currentRoute.value.query.destination as string || ""
  rideDate.value = router.currentRoute.value.query.date as string || ""
  redirectToList.value = router.currentRoute.value.query.redirectToList === 'true' ? true : false

  if (redirectToList.value) {
    Main.scrollToElementById('ride-header')
    let newQuery = QueryFunction.cancelAction('', ['redirectToList'])
    router.replace({ query: newQuery as any })
  }

  loadRides()
})

watch(start, () => {
  Main.scrollToElementByIdSmooth('ride-header')
})

watch(destination, () => {
    Main.scrollToElementByIdSmooth('ride-header')
})

watch(rideDate, () => {
  Main.scrollToElementByIdSmooth('ride-header')
})


onMounted(() => {
  loadRides()

  if (redirectToList.value) {
    setTimeout(() => {
      // pass
  }, 500);
    Main.scrollToElementById('ride-header')
  }

})

</script>

<template>
  <div style="width: 100%; display: flex; margin-bottom: 40px; justify-content: space-between; text-align: center;"
    class="display-block">
    <div style="font-size: 36px; font-weight: 700;" class="display-block">
      Znaleziono
      <span style="color: var(--main-orange); font-size: 36px; font-weight: 700;">
        {{ numberOfRides }}
      </span>
      <span v-if="numberOfRides === 0 || numberOfRides >= 5" style="font-size: 36px; font-weight: 700;">
        przejazdów
      </span>
      <span v-else-if="numberOfRides >= 2 && numberOfRides <= 4" style="font-size: 36px; font-weight: 700;">
        przejazdy
      </span>
      <span v-else-if="numberOfRides === 1" style="font-size: 36px; font-weight: 700;">
        przejazd
      </span>
    </div>
    <div style="display: flex; width: 30%; gap: 25px;" class="display-desktop">
      <div style="width: 50%; align-items: center; display: flex; cursor: not-allowed;">
        <span class="icon placeholder" style=" ">
          Filtruj
        </span>
        <select class="input-main" style="cursor: not-allowed;" disabled>

        </select>
      </div>
      <div style="width: 50%; align-items: center; display: flex; cursor: not-allowed;">
        <span class="icon placeholder" style=" ">
          Sortuj
        </span>
        <select class="input-main" style="cursor: not-allowed;" disabled>
        </select>
      </div>
    </div>
  </div>

  <div style="margin-top: 70px; margin-bottom: 20px;" class="display-eighty" id="ride-header">
    <div v-if="Object.keys(rideList).length !== 0"
      style="padding-bottom: 40px; display: flex; border-bottom: 1px solid var(--main-orange); width: 100%; height: 34px; text-align: left; font-weight: 600; font-size: 24px; gap: 8%;">
      <div style="width: 50%;">
        Trasa i odległość:
      </div>
      <div style="width: 25%; flex-wrap: nowrap">
        Data i godzina:
      </div>
      <div style="width: 25%;">
        Kierowca:
      </div>
    </div>
  </div>
  <div v-if="isLoadingInProgress" style="display: flex; justify-content: center;">
    <SpinnerModal />
  </div>
  <div style="" v-if="!isLoadingInProgress" >
    <div v-for="(ride, index) in rideList" :key="index" class="action-field" v-if="Object.keys(rideList).length !== 0"
      style="min-height: 133px; height: fit-content; margin-bottom: 30px; display: block;">
      <div style="width: 100%; height: fit-content; padding: 16px; display: flex; align-items: center; gap: 10%">
        <div style="width: 50%;" class="display-full">
          <div class="white-field" style="width: 100%; height: fit-content; min-height: 100px;">
            <div
              style="height: 50%; display: flex; gap: 15px;  align-items: center; padding: 4px 0px; justify-content: space-between;">
              <div style="display: flex; gap: 12px; align-items: center;">
                <div style="width: 21px; height: 28px;">
                  <GpsIcon style="width: 21px; height: 28px;" />
                </div>
                <div style="text-overflow: ellipsis; overflow: hidden;">
                  {{ ride?.start }}
                </div>
              </div>
              <div style="width: fit-content; display: flex; justify-content: end;"
                v-if="ride?.distanceFromStart && start">
                <div
                  style="background-color: var(--main-blue); width: fit-content; padding: 8px; gap: 8px; height: 40px; justify-content: space-evenly; align-items: center; border-radius: 8px; display: flex; align-items: center;">
                  <div style="">
                    <MapIcon />
                  </div>
                  <div style="color: #FAFAFA; font-weight: 500; white-space: nowrap;">
                    {{ ride?.distanceFromStart }} km
                  </div>
                </div>
              </div>
            </div>
            <div style="height: 50%; display: flex; gap: 12px; align-items: center; padding: 4px 0px; ">
              <div>
                <FlagIcon style="width: 22px; height: 24px;" />
              </div>
              <div class="wrap-text">
                {{ ride?.destination }}
              </div>
            </div>
            <!-- <div style="height: 50%; display: flex; gap: 12px; align-items: center; padding: 4px 0px; ">
            <div style="">
              <div v-if="!ride.photo" style="display: flex; justify-content: center;">
                <img src="../assets/default-profile.png" alt="">
              </div>
              <div v-if="ride.photo">
                {{ ride.photo }}
              </div>
            </div>
            <div>
              {{ ride.driver }}
            </div>
          </div> -->
          </div>
        </div>
        <div style="width: 25%;" class="display-desktop">
          <div class="white-field" style="width: 100%; height: 100px;">
            <div style="height: 50%; display: flex; gap: 10px;  align-items: center; min-width: 120px;">
              <div>
                <CalendarIcon style="width: 25px; height: 28px;" />
              </div>
              <div>
                {{ ride?.startDate }}
              </div>
            </div>
            <div style="height: 50%; display: flex; gap: 10px;  align-items: center;">
              <div style="display: flex;">
                <ClockIcon />
              </div>
              <div>
                {{ ride?.startHour }}
              </div>
            </div>
          </div>
        </div>
        <div style="width: 25%;  height: 100px; display: flex; flex-direction: column; gap: 10px;"
          class="display-desktop">
          <div class="white-field"
            style="height: 46px; width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 12px 12px 6px;">
            <div style="padding-right: 6px;">
              <div>
                <img style="margin-left: 4px;" src="../assets/default-profile.png" alt="">
              </div>
              <!-- <div v-if="!ride.photo">
                <img src="../assets/default-profile.png" alt="">
              </div>
              <div v-if="ride.photo">
                {{ ride.photo }}
              </div> -->
            </div>
            <div class="wrap-text">
              {{ ride?.driver }}
            </div>
          </div>
          <div class="white-field" style="height: 46px; display: flex; padding: 0px;">
            <div style="display: flex; gap: 5px; align-items: center; padding: 12px 6px 12px 6px;">
              <div style="">
                <PhoneIcon />
              </div>
            </div>
            <div style="width: 85%; height: 100%; display: flex; cursor: pointer;" @click="setVisibility(index)">
              <div v-if="!isPhoneNumberVisible[Number(index)]"
                style="background-color: var(--main-orange); height: 100%; width: 100%; color: #FAFAFA; padding: 0px; border-radius: 12px; display: flex; align-items: center; padding-left: 8px; font-weight: 600;">
                Odsłoń
              </div>
              <div v-if="isPhoneNumberVisible[Number(index)]"
                style="border-radius: 12px; display: flex; align-items: center; font-weight: 600; padding-left: 8px; ">
                <a :href="'tel:' + ride?.phoneNumber" v-if="!displaySuccess[Number(index)]"
                  style="text-decoration: none; height: 100%; display: flex; align-items: center; padding: 0px 6px 0px 0px;"
                  @click.stop="copyTextToClipboard(ride?.phoneNumber, index)">
                  {{ ride?.phoneNumber }}
                </a>
                <span v-if="displaySuccess[Number(index)]" style="display: flex; align-items: center; gap: 5px; max-width: 100%; text-overflow: ellipsis;"
                  class="wrap-text">
                  <SuccessTickIcon />
                  Skopiowano
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- for mobile version -->
      <div style="width: 100%; display: flex; padding: 16px; justify-content: space-between; gap: clamp(0px, 5%, 15px);"
        class="display-mobile">
        <div style="width: 70%;  height: 100px; display: flex; flex-direction: column; gap: 10px;">
          <div class="white-field"
            style="height: 46px; width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 12px 12px 6px;">
            <div style="padding-right: 6px;">
              <div>
                <img style="margin-left: 4px;" src="../assets/default-profile.png" alt="">
              </div>
              <!-- <div v-if="!ride.photo">
                <img src="../assets/default-profile.png" alt="">
              </div>
              <div v-if="ride.photo">
                {{ ride.photo }}
              </div> -->
            </div>
            <div class="wrap-text">
              {{ ride?.driver }}
            </div>
          </div>
          <div class="white-field" style="height: 46px; display: flex; padding: 0px;">
            <div style="display: flex; gap: 5px; align-items: center; padding: 12px 6px 12px 6px;">
              <div style="">
                <PhoneIcon style="display: flex; margin: auto" />
              </div>
            </div>
            <div style="width: calc(100% - 55px); height: 100%; display: flex; cursor: pointer;" @click="setVisibility(index)">
              <div v-if="!isPhoneNumberVisible[index]"
                style="background-color: var(--main-orange); height: 100%; width: 100%; color: #FAFAFA; padding: 0px; border-radius: 12px; display: flex; align-items: center; padding-left: 8px; font-weight: 600;">
                Odsłoń
              </div>
              <div v-if="isPhoneNumberVisible[index]" class="wrap-text"
                style="border-radius: 12px; display: flex; align-items: center; font-weight: 600; padding-left: 8px; ">
                <a :href="'tel:' + ride?.phoneNumber" v-if="!displaySuccess[index]"
                  style="text-decoration: none; height: 100%; display: flex; align-items: center; padding: 0px 6px 0px 0px;"
                  @click.stop="copyTextToClipboard(ride?.phoneNumber, index)">
                  {{ ride?.phoneNumber }}
                </a>
                <span v-if="displaySuccess[index]" style="display: flex; align-items: center; gap: 5px; max-width: 100%; text-overflow: ellipsis;">
                  <div style="display: flex; justify-content: center;">
                    <SuccessTickIcon />
                  </div>
                  <div>
                    Skopiowano
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div style="width: 30%;">
          <div class="white-field" style="width: 100%; height: 100px;">
            <div style="height: 50%; display: flex; gap: 10px;  align-items: center; min-width: 120px;">
              <div class="display-without-smartphone">
                <CalendarIcon style="width: 25px; height: 28px;" />
              </div>
              <div>
                {{ ride?.startDate }}
              </div>
            </div>
            <div style="height: 50%; display: flex; gap: 10px;  align-items: center;">
              <div style="display: flex;" class="display-without-smartphone">
                <ClockIcon />
              </div>
              <div>
                {{ ride?.startHour }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else style="width: 100%; text-align: center;">
      <div
        style="font-size: 28px; font-weight: 600; display: flex; justify-content: center; height: 150px; align-items: center;">
        Brak przejazdów
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 1100px) {
  .display-eighty {
    display: none !important;
  }

  .display-block {
    display: block !important;
  }
}</style>
