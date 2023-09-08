<script setup lang="ts">
import CityViewIcon from '../components/icons/CityViewIcon.vue'
import SearchPanel from '../components/SearchPanel.vue'
import RideList from '../components/RideList.vue'
import PaginationModal from '../components/modals/PaginationModal.vue'
import { onMounted, ref } from 'vue'
import { useRouter, Router } from 'vue-router'

import Main from '../components/functions/ScrollToFunction'

const router: Router = useRouter()
const redirectToList = ref<boolean>(router.currentRoute.value.query.redirectToList === 'true' ? true : false)

onMounted(() => {
    redirectToList.value = router.currentRoute.value.query.redirectToList === 'true' ? true : false

    if (!redirectToList.value) {
        Main.scrollToTop()
    }
})

</script>

<template>
    <div style="display: flex; gap: 40px;" class="main-text">
        <div class="display-full" style="width: 20%; display: flex; flex-direction: column; justify-content: center; z-index: 5;">
            <div class="title-text display-full" style="margin-bottom: 20px; text-align: center;" >
                Znajdź przejazd
            </div>
            <div class="basic-text display-half" style="text-align: center; font-size: 24; margin-bottom: 20px;">
                Skorzystaj z Listy przejazdów aby szybko znaleźć się u celu 
            </div>
        </div>
        <div class="display-full negative-margin" style="width: 80%;">
            <CityViewIcon class="display-full" style="width: 100%; height: 100%" />
        </div>
    </div>
    <div style="display: flex; justify-content: center">
        <SearchPanel />
    </div>
    <div style="width: 100%; margin-top: 80px; padding-bottom: 120px;" > 
        <RideList />
    </div>
    <div>
        <PaginationModal />
    </div>
</template>

<style scoped>


@media (max-width: 1100px) {
    .main-text {
        display: block !important;
    }

    .negative-margin {
        margin-top: -15px !important;
        margin-bottom: -15px
    }

    .display-half {
        width: 50% !important;
        min-width: 200px;
        margin: auto
    }
}

</style>
