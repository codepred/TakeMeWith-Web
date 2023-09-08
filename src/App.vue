<script setup lang="ts">
import TopHeader from './components/TopHeader.vue'
import FooterHeader from './components/FooterHeader.vue'
import MenuPanel from './components/MenuPanel.vue'
import { RouterView } from 'vue-router'

</script>

<template>
  <TopHeader />
  <div style="top: 48px; padding: 40px 48px 0px 48px; background-color: #FAFAFA; min-height: calc(100vh - 48px);" class="remove-padding">
    <MenuPanel />
    <div class="main-container">
      <RouterView />
    </div>
  </div>
  <FooterHeader />
</template>

<style scoped>
.main-container {
  padding: 0 10%;
}

@media (max-width: 1100px) {
  .main-container {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    padding-left: clamp(25px, 15%, 150px)!important;
    padding-right: clamp(25px, 15%, 150px)!important;
  }
  .remove-padding {
    padding: 0% !important;
  }
}

@media (max-width: 400px) {
  .remove-padding {
    padding: 12px;
  }
}

</style>
