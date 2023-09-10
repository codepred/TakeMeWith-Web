<template>
  <footer class="desktop-header">
    <div class="remove-padding-smartphone" style="width: 100%; justify-content: space-between; height: fit-content; min-height: 48px; padding: 0 48px; display: flex;">
      <div style="width: fit-content; height: 100%; display: flex; align-items: center; margin: auto; color: #FAFAFA;">
        Wersja 1.1.0 © Copyright 2023
        <a href="https://codepred.pl/" style="margin-left:4px; color: #FAFAFA;" target="_blank">
          Codepred
        </a>
        <!-- <span style="color: #FAFAFA" class="footer-desktop">
          , Designed by
          <a href="https://dribbble.com/kkalinowskidesigner" style="margin-left:4px; color: #FAFAFA;">
            Kacper Kalinowski
          </a>
        </span> -->
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer.desktop-header {
  z-index: 10;
  width: 100%;
  height: 48px;
  background-color: var(--main-blue);
  color: #FAFAFA;
}

@media (max-width: 550px) {
  .footer-desktop {
    display: none;
  }
}

</style>