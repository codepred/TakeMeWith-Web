<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue'
import ClockIcon from './icons/ClockIcon.vue';
import GpsIcon from './icons/GpsIcon.vue';
import FlagIcon from './icons/FlagIcon.vue';
import PhoneIcon from './icons/PhoneIcon.vue'
import UserService from '../services/UserService';
import DatePickerSingle from './modals/DatePickerSingle.vue'
import DisplayValidationError from './modals/DisplayValidationError.vue'
import hourList from '../assets/hourList.json'
import router from '../router';

interface UserData {
  name: string,
  lastName: string,
  phoneNumber: number | null,
  email: string,
  [key: string]: string | number | null
}

interface RideData {
  start: string,
  destination: string,
  startDate: Date,
  startHour: string,
  [key: string]: string | Date
}

interface ValidationObject {
  start: boolean,
  destination: boolean,
  startDate: boolean,
  startHour: boolean,
  [key: string]: boolean
}

const validationObject: Ref<ValidationObject> = ref(
  {
    start: false,
    destination: false,
    startDate: false,
    startHour: false,
  }
)

const userData: Ref<UserData> = ref(
  {
    name: "",
    lastName: "",
    phoneNumber: null,
    email: "",
  }
)

const rideData: Ref<RideData> = ref(
  {
    start: "",
    destination: "",
    startDate: new Date(),
    startHour: "",
  }
)

const displayError = ref<boolean>(false)
const buttonText = ref<string>('Zaoferuj przejazd')

const validateInput = (key: string) => {

  if (key === 'startDate') {
    validationObject.value[key] = false;
  }
  else {
    if (rideData.value[key].toString().length === 0) {
      validationObject.value[key] = true;
    }

    else {
      validationObject.value[key] = false;
    }
  }
}

const submitRide = async () => {

  for (const key of Object.keys(rideData.value)) {
    validateInput(key);
  }

  const anyTrue = Object.values(validationObject.value).some(value => value === true);

  if (anyTrue) {
    return
  }

  buttonText.value = 'Dodawanie...'

  var response = await UserService.submitRide(rideData.value)

  if (response) {
    if (response.code === 'OK' && response.message === 'RIDE_SUCCESSFULY_CREATED') {
      router.push({ path: '/ride-list', query: { redirectToList: 'true' } })
    }
  }

  buttonText.value = 'Zaoferuj przejazd'
}

const sendTextToBackend = async () => {

  // if (type === 'source') {
  //   var response = await UserService.sendTextToBackend(rideData.value.start)

  // }

  // else if (type === 'destination') {
  //   var response = await UserService.sendTextToBackend(rideData.value.destination)

  // }

}

const getUserData = async () => {
  var response = await UserService.getUserData()

  if (response) {
    userData.value = response
  }
}


onMounted(() => {
  getUserData()
})

</script>

<template>
  <div style="width: 100%; display: flex; justify-content: space-between; ">
    <div style="width: 100%; margin-bottom: 0px;">
      <div class="title-text" style="margin-bottom: 10px; width: 100%; text-align: left;">
        Użyty profil
      </div>
    </div>
  </div>
  <div class="action-field"
    style="display: block; height: fit-content; display: flex; flex-direction: column; gap: 20px; padding: 16px; justify-content: center; margin-bottom: 20px;">
    <div style="display: flex; align-items: center; gap: 20px;">
      <div class="white-field"
        style="width: 100%; height: 50%; display: flex; align-items: center; gap: 12px; max-width: 50%;">
        <div style="display: flex;">
          <img src="../assets/default-profile.png" height="25" alt="">
        </div>
        <div style="text-overflow: ellipsis; overflow: hidden;">
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
  <div style="width: 100%; display: flex; justify-content: space-between; ">
    <div style="width: 100%; margin-bottom: 0px;">
      <div class="title-text" style="margin-bottom: 10px; width: 100%; text-align: left;">
        Uzupełnij dane przejazdu
      </div>
    </div>
  </div>
  <div class="action-field"
    style="display: block; height: fit-content; display: flex; flex-direction: column; gap: 20px; padding: 24px; justify-content: center;">
    <div style="width: 100%; display: flex; align-items: center;">
      <span class="icon">
        <GpsIcon style="width: 20px; height: auto" />
      </span>
      <span class="icon placeholder" style="padding-left: 30px;" v-if="rideData.start.length === 0">
        Adres wyjazdu
      </span>
      <input class="input-main" v-model="rideData.start" style="padding-left: 43px;"
        :class="{ 'wrong-input': validationObject.start }" maxlength="60" @keyup="sendTextToBackend()" />
    </div>
    <div style="width: 100%; display: flex; align-items: center;">
      <span class="icon">
        <FlagIcon style="width: 20px; height: auto" />
      </span>
      <span class="icon placeholder" style="padding-left: 30px;" v-if="rideData.destination.length === 0">
        Adres docelowy
      </span>
      <input class="input-main" v-model="rideData.destination" style="padding-left: 43px;"
        :class="{ 'wrong-input': validationObject.destination }" maxlength="30" />
    </div>
    <div style="display: flex; align-items: center; gap: 20px;">
      <div style="display: flex; align-items: center; width: 50%;">
        <!-- <span class="icon">
          <CalendarIcon style="width: 20px; height: auto" />
        </span>
        <span class="icon placeholder" style="padding-left: 30px;" v-if="rideData.startDate.length === 0">
          Data
        </span> -->
        <DatePickerSingle @update:pickedRawDate="rideData.startDate = $event" instanceId="1" />
      </div>
      <div style="display: flex; align-items: center; width: 50%;">
        <span class="icon display-without-smartphone" style="margin-top: 2px;">
          <ClockIcon style="width: 22px; height: auto" />
        </span>
        <!-- <span class="icon placeholder" style="padding-left: 30px;" v-if="rideData.startHour.length === 0">
          Godzina
        </span> -->
        <select class="input-main remove-padding-smartphone" v-model="rideData.startHour" style="padding-left: 43px;"
          :class="{ 'wrong-input': validationObject.startHour }">
          <option value="" disabled selected hidden>Godzina</option>
          <option v-for="hour in hourList" :value="hour.name">
            {{ hour.name }}
          </option>
        </select>
      </div>
    </div>
    <DisplayValidationError msg="Uzupełnij brakujące pola" v-if="displayError" />
  </div>
  <div style="display: flex; margin-top: 20px;">
    <div style="width: 50%;">
      <!-- <CheckboxModal /> -->
    </div>
    <div style="width: 50%; display: flex; justify-content: right;">
      <button class="main-button orange-button" style="color: #FAFAFA; font-size: 18px; min-width: 200px;"
        @click="submitRide()" :disabled="buttonText === 'Dodawanie...'">
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
