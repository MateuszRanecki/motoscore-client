<template>
  <div class="tournament-container">
    <div class="main-info mb-2 pa-3">
      <div class="d-flex justify-space-between mb-4">
        <p class="d-flex align-center">{{ data.name }}</p>
        <router-link
          :to="{
            name: 'Contenders',
            params: {
              id: data.id,
            },
          }"
          class="link"
          target="_blank"
        >
          <div class="hover mt-1"><v-icon icon="mdi-table" /> Results</div>
        </router-link>
      </div>

      <div class="d-flex">
        <p class="d-flex align-center mr-2">
          {{ TournamentStatus[data.status] }}
        </p>
        <v-btn
          class="tournament-button"
          v-if="data.status === TournamentStatus.Created"
          @click="statusDialog = true"
        >
          <v-icon icon="mdi-play" color="grey-text" /> Start
        </v-btn>
        <v-btn
          class="tournament-button"
          v-if="data.status === TournamentStatus.Active"
          @click="statusDialog = true"
        >
          <v-icon icon="mdi-close" color="grey-text" /> Close
        </v-btn>
      </div>
    </div>

    <div class="contender-plus mb-3">
      <h3 class="d-flex align-center">Contenders</h3>
      <v-icon
        icon="mdi-plus"
        @click="addContDialog = true"
        class="hover"
        v-if="data.status === TournamentStatus.Created"
        size="40"
      />
    </div>
    <div v-if="data.contenders.length > 0">
      <v-text-field
        label="Search by name or start number"
        variant="outlined"
        v-model="filterString"
        class="white-font text-filter mb-3"
        hide-details
      ></v-text-field>

      Group
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

      <div v-if="data.status === TournamentStatus.Active">
        Level
        <v-btn-toggle class="buttons-wrapper" mandatory v-model="currentLevel">
          <v-btn
            :class="currentLevel === item ? 'active-button' : 'status-button'"
            v-for="item in data.levelsCount"
            :key="item"
            :value="item"
            >Level {{ item }}</v-btn
          >
        </v-btn-toggle>

        <div class="contenders" v-if="filteredContenders.length > 0">
          <div
            v-for="contender in filteredContenders"
            :key="contender.id"
            class="contender-wrapper"
          >
            <p>{{ `${contender.firstName} ${contender.lastName} ` }}</p>
            <p>Start Number: {{ contender.startNumber }}</p>
            <PenaltyInput
              @submit-points="submitPoints"
              :contender="contender"
            />
          </div>
        </div>
      </div>
      <div
        v-if="
          data.status === TournamentStatus.Created &&
          filteredContenders.length > 0
        "
      >
        <div class="start-queue mb-2">
          <p class="table-atom">Name</p>
          <p class="table-atom">Number</p>
          <p class="table-atom">Group</p>
        </div>
        <div
          class="start-queue"
          v-for="item in filteredContenders"
          :key="item.id"
        >
          <p class="table-atom">{{ `${item.firstName} ${item.lastName}` }}</p>
          <p class="table-atom">{{ `${item.startNumber}` }}</p>
          <p class="table-atom">
            {{ `${TournamentGroup[item.tournamentGroup]}` }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <v-dialog v-model="addContDialog" width="unset">
    <v-card class="dialog">
      <v-card-text
        class="primary-background white-font d-flex justify-space-between"
      >
        <p class="width-100 d-flex justify-center">Add Contender</p>
        <v-icon icon="mdi-close" @click="addContDialog = false" />
      </v-card-text>
      <v-card-actions class="primary-background white-font">
        <div class="text-fields">
          <v-text-field
            label="First name"
            variant="outlined"
            v-model="contenderData.firstName"
            :error-messages="
              postv$.contenderData?.firstName.$errors[0]?.$message.toString()
            "
            @blur="postv$.contenderData?.firstName.$validate"
          ></v-text-field>
          <v-text-field
            label="Last name"
            variant="outlined"
            v-model="contenderData.lastName"
            :error-messages="
              postv$.contenderData?.lastName.$errors[0]?.$message.toString()
            "
            @blur="postv$.contenderData?.lastName.$validate"
          ></v-text-field>
          Tournament group:
          <v-btn-toggle
            class="buttons-wrapper"
            mandatory
            v-model="contenderData.tournamentGroup"
          >
            <v-btn
              :class="
                contenderData.tournamentGroup === item
                  ? 'active-button'
                  : 'status-button'
              "
              v-for="item in Object.values(TournamentGroup).filter(
                (status) => !isNaN(Number(status))
              )"
              :key="item"
              :value="item"
              >{{ TournamentGroup[item as number] }}</v-btn
            >
          </v-btn-toggle>
          <v-btn class="status-button" @click="postContender()"> SAVE </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="statusDialog" width="unset">
    <v-card class="dialog">
      <v-card-text class="primary-background white-font d-flex">
        <p class="width-100 d-flex justify-center text-align-center">
          Change tournament status
        </p>
        <v-icon icon="mdi-close" @click="statusDialog = false" />
      </v-card-text>
      <v-card-actions
        class="primary-background white-font d-flex flex-column pb-3"
      >
        <p class="text-align-center">
          Are you sure you want to do this operation ?
        </p>
        <div class="mt-3">
          <v-btn
            class="status-button width-100"
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
import { Contender, ContenderStatus } from "@/types/contender";
import {
  Tournament,
  TournamentGroup,
  TournamentStatus,
} from "@/types/tournament";
import { computed, ref } from "@vue/reactivity";
import axios from "axios";
import { useRoute } from "vue-router";
import PenaltyInput from "./PenaltyInput.vue";
import { con } from "@/helpers/serverConnect";
import { required, numeric, between } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const route = useRoute();
const data = ref<Tournament>({
  id: "example",
  contenders: [] as Contender[],
} as Tournament);
const currentGroup = ref<number>(TournamentGroup.A);
const currentLevel = ref<number>(1);
const addContDialog = ref<boolean>(false);
const contenderData = ref<Contender>({
  tournamentGroup: TournamentGroup.A,
  tournamentId: route.params.id,
  penaltyPointsCount: 0,
  currentPart: 1,
  status: ContenderStatus.Participating,
} as Contender);
const statusDialog = ref<boolean>(false);
const filterString = ref<string>("");

const fetchData = async () => {
  await axios
    .get(`${process.env.VUE_APP_TOURNAMENTS}/${route.params.id}`)
    .then((response) => {
      data.value = response.data as Tournament;
    });
};

const filteredContenders = computed(() => {
  if (data.value.contenders) {
    return data.value.contenders.filter((contender) => {
      return (
        contender.currentPart === currentLevel.value &&
        contender.tournamentGroup === currentGroup.value &&
        (`${contender.firstName.toLowerCase()} ${contender.lastName.toLowerCase()}`.match(
          filterString.value.toLowerCase()
        ) ||
          contender.startNumber.toString().match(filterString.value.toString()))
      );
    });
  }
  return [];
});

fetchData();

const postRules = computed(() => ({
  contenderData: {
    firstName: {
      required,
    },
    lastName: {
      required,
    },
  },
}));

const putRules = computed(() => ({
  contenderData: {
    penaltyPointsCount: {
      required,
      numeric,
      betweenValue: between(0, 5),
    },
  },
}));

const postv$ = useVuelidate(postRules, {
  contenderData,
});

const putv$ = useVuelidate(putRules, {
  contenderData,
});

async function submitPoints(points: number, contender: Contender) {
  const isValidated = await putv$.value.$validate();
  if (!isValidated) return "";

  await axios
    .put(`${process.env.VUE_APP_CONTENDERS}/${contender.id}`, {
      ...contender,
      penaltyPointsCount: points,
    })
    .then((response) => {
      if (response.status >= 200 && response.status <= 300)
        con.invoke("RefreshTournaments");
    });
}

async function postContender() {
  const isValidated = await postv$.value.$validate();
  if (!isValidated) return "";

  await axios
    .post(`${process.env.VUE_APP_CONTENDERS}`, {
      tourmanentId: route.params.id,
      firstName: contenderData.value.firstName,
      lastName: contenderData.value.lastName,
      tournamentGroup: contenderData.value.tournamentGroup,
      penaltyPointsCount: contenderData.value.penaltyPointsCount,
      status: contenderData.value.status,
      currentPart: contenderData.value.currentPart,
    })
    .then((response) => {
      if (response.status >= 200 && response.status <= 300)
        con.invoke("RefreshTournaments");
      addContDialog.value = false;
    });
}

async function changeStatus(tournament: Tournament, status: TournamentStatus) {
  await axios
    .put(`${process.env.VUE_APP_TOURNAMENTS}/${tournament.id}`, {
      ...tournament,
      status: status,
    })
    .then((response) => {
      if (response.status >= 200 && response.status <= 300) {
        statusDialog.value = false;
        con.invoke("RefreshTournaments");
      }
    });
}

con.on("SendRefreshRequest", fetchData);
</script>
<style lang="scss" scoped>
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

.contender-wrapper {
  width: 100%;
  background: $secondary;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @include breakpoint(xs) {
    width: 80%;
  }

  @include breakpoint(sm) {
    width: 45%;
  }

  @include breakpoint(md) {
    width: 30%;
  }
}

.contenders {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;

  @include breakpoint(xs) {
    justify-content: space-around;
  }

  @include breakpoint(md) {
    justify-content: start;
  }
}

.contender-plus {
  display: flex;
  gap: 5px;
}

.text-fields {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}
.dialog {
  padding: 10px 20px;
  background: $primary;
}

.main-info {
  background: $firefly;
  font-size: 20px;
  border-radius: 10px;
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

.text-filter {
  max-width: 360px;
}

.start-queue {
  display: flex;
  overflow-x: hidden;
}

.table-atom {
  width: 90px;
  overflow-x: scroll;
  display: flex;
  justify-content: center;

  @include breakpoint(xs) {
    overflow-x: hidden;
    width: 120px;
  }
}
</style>
