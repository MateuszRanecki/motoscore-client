<template>
  <v-text-field
    label="Penalty points"
    variant="outlined"
    v-model="penaltyPoints"
    class="mt-3"
    :error-messages="putv$.penaltyPoints?.$errors[0]?.$message.toString()"
    @blur="putv$.penaltyPoints?.$validate"
  ></v-text-field>
  <v-btn
    class="status-button"
    @click="$emit('SubmitPoints', penaltyPoints, contender)"
    >Save</v-btn
  >
</template>

<script lang="ts" setup>
import { Contender } from "@/types/contender";
import { ref, defineEmits, defineProps } from "vue";
import { required, numeric, between } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { computed } from "@vue/reactivity";

const penaltyPoints = ref<number>(0);

defineEmits(["SubmitPoints"]);

const putRules = computed(() => ({
  penaltyPoints: {
    required,
    numeric,
    betweenValue: between(0, 5),
  },
}));

const putv$ = useVuelidate(putRules, {
  penaltyPoints,
});

defineProps<{
  contender: Contender;
}>();
</script>

<style lang="scss" scoped>
.status-button {
  background: transparent;
  color: $gray-text;
}
</style>
