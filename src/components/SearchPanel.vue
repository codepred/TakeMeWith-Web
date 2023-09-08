<script setup lang="ts">
import DatePickerSingle from './modals/DatePickerSingle.vue'
import FlagIcon from './icons/FlagIcon.vue';
import GpsIcon from './icons/GpsIcon.vue';
import CrossIcon from './icons/CrossIcon.vue';
import { ref } from 'vue'
import { useRouter, Router } from 'vue-router'

// import GoogleAddressAutocomplete from 'vue3-google-address-autocomplete'

const router: Router = useRouter()

const start = ref<string>(router.currentRoute.value.query.start as string || "")
const destination = ref<string>(router.currentRoute.value.query.destination as string || "")
const rideDate = ref<string>(router.currentRoute.value.query.date as string || "")
const forceValueReset = ref<boolean>(false)

const buttonText = ref<string>('Szukaj')

const redirectToRideList = () => {
  
  const queryParams = {
    ...(start.value && { start: start.value }),
    ...(destination.value && { destination: destination.value }),
    ...(rideDate.value && { date: rideDate.value }),
    redirectToList: true
  };
  buttonText.value = 'Ładowanie...'

  setTimeout(() => {
    buttonText.value = 'Szukaj'

    router.push({ path: '/ride-list', query: queryParams as any});
  }, 500);
}

</script>

<template>
  <!-- desktop version -->
  <div class="action-field display-desktop" style="justify-content: space-between; gap: 20px; padding: 32px; min-width: 320px;">
    <div style="display: flex; width: 40%; align-items: center;">
      <span class="icon">
        <GpsIcon style="width: 21px; height: 26px;" />
      </span>
      <span class="icon placeholder" style="margin-left: 45px" v-if="start.length === 0">
        Adres wyjazdu
      </span>
      <input class="input-main" style="padding-left: 43px; padding-right: 40px;" v-model="start" maxlength="60">
      <!-- <GoogleAddressAutocomplete apiKey="AIzaSyBuAnkK8OiFeUqIHNDMXglOLN6OWJhxy74" :options="{
        bounds: { north: 14, west: 49, south: 24, east: 55 },
        LatLngBoundsLiteral : { north: 14, west: 49, south: 24, east: 55 },
        locationRestriction: { north: 14, west: 49, south: 24, east: 55 },
        LatLngAltitude: { north: 14, west: 49, south: 24, east: 55 },
        language: 'pl'
      }" v-model="start" class="input-main" placeholder="Adres docelowy" style="padding-left: 44px;" /> -->
      <div style="position: absolute; width: 100%; display: flex; justify-content: end; align-items: center;">
        <span class="icon" style="pointer-events: all; cursor: pointer; " @click="start = ''" v-if="start.length !== 0">
          <CrossIcon style="width: 53px; height: 53px;" />
        </span>
      </div>
    </div>
    <div style="display: flex; width: 40%; align-items: center;">
      <span class="icon">
        <FlagIcon style="width: 24px; height: 22px;" />
      </span>
      <!-- <GoogleAddressAutocomplete apiKey="AIzaSyBuAnkK8OiFeUqIHNDMXglOLN6OWJhxy74" v-model="destination"
        @callback="callbackFunction" class="input-main" placeholder="Adres docelowy" style="padding-left: 44px;" /> -->
      <span class="icon placeholder" style="margin-left: 45px" v-if="destination.length === 0">
        Adres docelowy
      </span>
      <input class="input-main" style="padding-left: 43px; padding-right: 40px;" v-model="destination" maxlength="60">
      <div style="position: absolute; width: 100%; display: flex; justify-content: end; align-items: center;">
        <span class="icon" style="pointer-events: all; cursor: pointer; " @click="destination = ''"
          v-if="destination.length !== 0">
          <CrossIcon style="width: 53px; height: 53px;" />
        </span>
      </div>
    </div>
    <div style="display: flex; width: 10%; min-width: 120px; align-items: center;">
      <DatePickerSingle @update:pickedRawDate="rideDate = $event" :date="rideDate" instanceId="data_picker_1"
        @update:resetValue="forceValueReset = $event" />
      <!-- <span class="icon" style="margin: 0px 0px 0px 0px; pointer-events: all; left: 75%; cursor: pointer;" @click="resetDataValue()" v-if="rideDate.length !== 0">
        <CrossIcon style="width: 53px; height: 53px;" />
      </span> -->
    </div>
    <div style="width: 10%;">
      <button class="main-button orange-button" style="height: 53px; width: 100%;" @click="redirectToRideList()">
        {{ buttonText }}
      </button>
    </div>
  </div>

  <!-- mobile version -->
  <div class="action-field display-mobile"
    style="justify-content: space-between; gap: 20px; padding: 26px; display: flex; flex-direction: column; min-width: 320px;">
    <div style="display: flex; width: 100%; align-items: center;">
      <span class="icon">
        <GpsIcon style="width: 21px; height: 26px;" />
      </span>
      <span class="icon placeholder" style="margin-left: 45px;" v-if="start.length === 0">
        Adres wyjazdu
      </span>
      <input class="input-main" style="padding-left: 43px; padding-right: 40px;" v-model="start" maxlength="60">
      <span class="icon"
        style="margin: 0px 0px 0px 0px; pointer-events: all; cursor: pointer; display: flex; width: 100%; justify-content: right;"
        @click="start = ''" v-if="start.length !== 0">
        <CrossIcon style="width: 53px; height: 53px;" />
      </span>
    </div>
    <div style="display: flex; width: 100%; align-items: center;">
      <span class="icon">
        <FlagIcon style="width: 24px; height: 22px;" />
      </span>
      <span class="icon placeholder" style="margin-left: 45px" v-if="destination.length === 0">
        Adres docelowy
      </span>
      <input class="input-main" style="padding-left: 43px; padding-right: 40px;" v-model="destination" maxlength="60">
      <span class="icon"
        style="margin: 0px 0px 0px 0px; pointer-events: all; cursor: pointer; display: flex; width: 100%; justify-content: right;"
        @click="destination = ''" v-if="destination.length !== 0">
        <CrossIcon style="width: 53px; height: 53px;" />
      </span>
    </div>
    <div style="display: flex; gap: 30px;">
      <div style="display: flex; width: 50%; align-items: center;">
        <DatePickerSingle @update:pickedRawDate="rideDate = $event" :resetValue="forceValueReset" instanceId="data_picker_2"
          style="min-width: 90px; max-width: 130px;" @update:resetValue="forceValueReset = $event" />
        <!-- <span class="icon" style="margin: 0px 0px 0px 0px; pointer-events: all; left: 75%; cursor: pointer;" @click="resetDataValue()" v-if="rideDate.length !== 0">
        <CrossIcon style="width: 53px; height: 53px;" />
      </span> -->
      </div>
      <div style="width: 50%; display: flex; justify-content: right;">
        <button class="main-button orange-button" style="height: 53px; min-width: 80px; max-width: 150px; width: 100%;"
          @click="redirectToRideList()">
          Szukaj
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.button-panel {
  display: flex;
  gap: 16px;
}

@media (max-width: 1100px) {
  .action-field {
    /* width: 70% !important; */
    min-width: 300px;
    margin: auto;
  }
}
</style>