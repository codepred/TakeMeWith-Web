<script setup>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import CalendarIcon from '../icons/CalendarIcon.vue';

import { ref, onMounted, watch, getCurrentInstance } from 'vue'

const paymentPeriod = ref(new Date())
const paymentPeriodRawString = ref(new Date())

const spanText = ref('')

const todaysDate = ref('');

const props = defineProps({
    date: {
        type: String
    },
    instanceId: {
        type: String,
        required: true
    }
})

const temp = ref("")

const instance = getCurrentInstance()

const clickDataPicker = () => {
    const inputSelector = `[data-instance-id="${props.instanceId}"] [aria-label="Datepicker input"]`;
    document.querySelector(inputSelector)?.click();
}

const getRawDataValue = ($event) => {
    const targetString = event.target.outerHTML.toString();

    if (targetString !== '<button type="button" class="dp__action_button dp__action_select">Wybierz</button>') {
        paymentPeriod.value = ""
        return
    }
    paymentPeriodRawString.value = paymentPeriod.value
    paymentPeriod.value = formatDateRange(paymentPeriodRawString.value)
}

const changeDateFormatToPolish = (dateString) => {

    if (!dateString) {
        dateString = todaysDate.value
    }

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}`;
};

watch(paymentPeriod, (newValue, oldValue) => {
    paymentPeriod.value = formatDateRange(paymentPeriodRawString.value)

    temp.value = changeDateFormatToPolish(paymentPeriod.value)

    const dateString = paymentPeriodRawString.value;
    const date = new Date(dateString);
    date.setHours(3);
    date.setMinutes(0);
    const formattedDate = date.toISOString().substring(0, 10);

    instance.emit('update:pickedDate', temp)
    instance.emit('update:pickedRawDate', formattedDate)
});

watch(props, () => {
    assignPassedDate()
})


const formatDateRange = (startDateString) => {
    const startDate = formatDate(startDateString);

    return startDate;
};

const wasChecked = ref(false)
const maxDate = ref(new Date())

const assignPassedDate = () => {

    if (props.date && !wasChecked.value) {
        paymentPeriodRawString.value = props.date
        paymentPeriod.value = formatDateRange(paymentPeriodRawString.value)
    }
    else if (!wasChecked.value) {
        paymentPeriodRawString.value = todaysDate.value
        paymentPeriod.value = formatDateRange(todaysDate.value)
    }

    wasChecked.value = true
}

onMounted(() => {
    getTodaysDate()
    assignPassedDate()

    maxDate.value = maxDate.value.setMonth(maxDate.value.getMonth() + 3)
    maxDate.value = new Date(maxDate.value)
    temp.value = changeDateFormatToPolish(paymentPeriod.value)

})

const formatDate = (dateString) => {
    if (!dateString) {
        dateString = todaysDate.value
    }

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}.${day}.${year}`;
};

const getTodaysDate = () => {
    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
    };

    const date = new Date();
    todaysDate.value = date.toLocaleString('en-US', options);

};


</script>

<template>
    <div style="width: 100%; height: 100%; display: flex; align-items: center;">
        <span class="icon" style="">
            <CalendarIcon style="width: 22px; height: auto;" />
        </span>
        <input class="input-main" v-model="temp" @keydown.prevent style="width: 100%; padding-left: 44px;"
            v-bind:class="{ 'span-bottom': paymentPeriod.length !== 0 }" @click="clickDataPicker()">
        <Datepicker locale="pl" v-model="paymentPeriod" :min-date="todaysDate" :max-date="maxDate" :text-input="true"
            :enable-time-picker="false" :month-change-on-scroll="false" select-text="Wybierz" cancel-text="Anuluj"
            style="width: 100%; height: 100%;" @closed="getRawDataValue()" position="center" :data-instance-id="props.instanceId" />
    </div>
</template>

<style>
.dp__input_wrap {
    display: none;
}

div.dp__main.dp__theme_light {
    width: 0px !important;
}

.dp__theme_light {
    --dp-primary-color: #407BFF;
}
</style>