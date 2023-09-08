<script setup>

defineProps({
    msg: {
        type: String,
    }
})
</script>

<template>
    <div class="display-validation-error">
        <p class="validation-p"> {{ msg }} </p>
    </div>
</template>

<style>

div.display-validation-error {
    /* margin: -2% 0px 3% 0px; */
    display: flex;
    /* padding: 2% 3%; */
    gap: 8px;
    width: 100%;
    height: fit-content;
    border-radius: 8px;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
    order: 0;
    flex-grow: 1;
    text-align: left;
    font-size: 16px;
}
p.validation-p {
    color: #DA3B38;
    margin: auto 0;
}

</style>