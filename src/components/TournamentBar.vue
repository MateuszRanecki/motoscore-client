<template>
  <div class="tournament-container">
    <router-link
      :to="{
        name: 'Tournament',
        params: {
          id: data.id,
        },
      }"
      class="link"
    >
      <p class="tournament-name hover">{{ data.name }}</p>
    </router-link>
    <div class="display-space-between">
      <div class="mt-1">
        <p>Status: {{ TournamentStatus[data.status] }}</p>
        <p>
          {{ data.levelsCount > 1 ? `${data.levelsCount} levels` : "1 level" }}
        </p>
        <v-btn
          class="tournament-button"
          v-if="data.status === TournamentStatus.Created"
          @click="dialog = true"
        >
          <v-icon icon="mdi-play" color="grey-text" /> Start
        </v-btn>
        <v-btn
          class="tournament-button"
          v-if="data.status === TournamentStatus.Active"
          @click="dialog = true"
        >
          <v-icon icon="mdi-close" color="grey-text" /> Close
        </v-btn>
        <router-link
          :to="{
            name: 'Contenders',
            params: {
              id: data.id,
            },
          }"
          class="link"
        >
          <div class="hover mt-1"><v-icon icon="mdi-table" /> See results</div>
        </router-link>
      </div>
      <div>
        <p>Contenders:</p>
        <p>Group A: {{ countContenderGroupCount(TournamentGroup.A) }}</p>
        <p>Group B: {{ countContenderGroupCount(TournamentGroup.B) }}</p>
        <p>Group C: {{ countContenderGroupCount(TournamentGroup.C) }}</p>
      </div>
    </div>
  </div>

  <v-dialog v-model="dialog" width="unset">
    <v-card class="dialog">
      <v-card-text class="primary-background white-font d-flex">
        <p class="width-100 d-flex justify-center text-align-center">
          Change tournament status
        </p>
        <v-icon icon="mdi-close" @click="dialog = false" />
      </v-card-text>
      <v-card-actions
        class="primary-background white-font d-flex flex-column pb-3"
      >
        <p class="text-align-center">
          Are you sure you want to do this operation ?
        </p>
        <div class="mt-3">
          <v-btn
            class="status-button"
            @click="
              changeStatus(
                data,
                data.status === TournamentStatus.Created
                  ? TournamentStatus.Active
                  : TournamentStatus.Closed
              )
            "
          >
            Change
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {
  Tournament,
  TournamentGroup,
  TournamentStatus,
} from "@/types/types-index";
import axios from "axios";
import { defineProps, ref } from "vue";
import { RouterLink } from "vue-router";
import { con } from "@/helpers/serverConnect";

const dialog = ref<boolean>(false);
const props = defineProps<{
  data: Tournament;
}>();

function countContenderGroupCount(group: TournamentGroup) {
  return props.data.contenders.filter(
    (contender) => contender.tournamentGroup === group
  ).length;
}

async function changeStatus(tournament: Tournament, status: TournamentStatus) {
  await axios
    .put(`${process.env.VUE_APP_TOURNAMENTS}/${tournament.id}`, {
      ...tournament,
      status: status,
    })
    .then((response) => {
      if (response.status >= 200 && response.status <= 300) {
        con.invoke("RefreshTournaments");
        dialog.value = false;
      }
    });
}
</script>
<style lang="scss" scoped>
.tournament-container {
  color: $gray-text;
  background: $firefly;
  width: 100%;
  margin: 12px 0;
  padding: 10px;
  border-radius: 10px;
  font-family: Arial, Helvetica, sans-serif;
  @include breakpoint(sm) {
    width: 45%;
    padding: 15px;
  }
}

.tournament-name {
  font-size: 18px;
}

.tournament-button {
  background: transparent;
  color: $gray-text;
  border: none;
  box-shadow: none;
  font-weight: 500;
}
.tournament-button:hover {
  opacity: 0.5;
}
</style>
