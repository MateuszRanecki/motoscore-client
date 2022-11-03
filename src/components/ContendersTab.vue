<template>
  <div class="tournament-container">
    <div class="d-flex">
      <h2 class="mb-2 mr-4">Tournament {{ data.name }}</h2>
    </div>
    <h3 class="mb-1">
      {{ data.levelsCount > 1 ? `${data.levelsCount} levels` : "1 level" }}
    </h3>
    <h3>Group</h3>
    <v-btn-toggle class="buttons-wrapper" mandatory v-model="currentGroup">
      <v-btn
        :class="currentGroup === item ? 'active-button' : 'status-button'"
        v-for="item in Object.values(TournamentGroup).filter(
          (status) => !isNaN(Number(status))
        )"
        :key="item"
        :value="item"
        >{{ TournamentGroup[item as number] }}</v-btn
      >
    </v-btn-toggle>
    <div class="contenders">
      <div class="d-flex mb-2 justify-space-between">
        <p class="table-atom">Place</p>
        <p class="table-atom">Name</p>
        <p class="table-atom">Number</p>
        <p class="table-atom">Penalty points</p>
        <p class="table-atom">Status</p>
        <p v-if="data.status === TournamentStatus.Active" class="table-atom">
          Part
        </p>
      </div>
      <div
        class="d-flex justify-space-between"
        v-for="(item, index) in filteredContenders"
        :key="item.id"
      >
        <p class="table-atom">{{ index + 1 }}</p>
        <p class="table-atom">{{ `${item.firstName} ${item.lastName}` }}</p>
        <p class="table-atom">{{ `${item.startNumber}` }}</p>
        <p class="table-atom">
          {{ `${item.penaltyPointsCount}` }}
        </p>
        <p class="table-atom">
          {{ ContenderStatus[item.status] }}
        </p>
        <p v-if="data.status === TournamentStatus.Active" class="table-atom">
          {{
            item.status === ContenderStatus.Participating
              ? item.currentPart
              : ""
          }}
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { con } from "@/helpers/serverConnect";
import {
  ContenderStatus,
  Tournament,
  TournamentGroup,
  TournamentStatus,
} from "@/types/types-index";
import { computed } from "@vue/reactivity";
import axios from "axios";
import { ref } from "vue";
import { useRoute } from "vue-router";

const data = ref<Tournament>({} as Tournament);
const route = useRoute();
const currentGroup = ref<TournamentGroup>(TournamentGroup.A);

async function fetchData() {
  await axios
    .get(`${process.env.VUE_APP_TOURNAMENTS}/${route.params.id}`)
    .then((response) => {
      data.value = response.data as Tournament;
    });
}

fetchData();

const filteredContenders = computed(() => {
  if (data.value.contenders) {
    return data.value.contenders
      .filter((contender) => {
        return contender.tournamentGroup === currentGroup.value;
      })
      .sort(
        (a, b) =>
          b.currentPart - a.currentPart ||
          a.penaltyPointsCount - b.penaltyPointsCount
      );
  }
  return [];
});

con.on("SendRefreshRequest", fetchData);
</script>
<style lang="scss" scoped>
.buttons-wrapper {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 0 10px;
  margin: 20px 0;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.buttons-wrapper:-webkit-scrollbar {
  display: none;
}

.tournament-container {
  color: $gray-text;
  width: 100%;
  font-family: Arial, Helvetica, sans-serif;
  border-radius: 10px;
}

.status-button {
  background: transparent;
  color: $gray-text;
}

.active-button {
  background: $bondiBlue;
}

.table-atom {
  width: fit-content;
  display: flex;
  justify-content: center;
  min-width: 90px;
}
.contenders {
  overflow-x: scroll;
  max-width: 600px;
  @include breakpoint(xs) {
    overflow-x: hidden;
  }
}
</style>
