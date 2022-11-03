<template>
  <div>
    <div class="gray-text header pb-3">
      <p>Tournaments:</p>
      <div class="add-tournament-button hover" @click="addTourDialog = true">
        <v-icon icon="mdi-plus" /> Add
        <v-dialog v-model="addTourDialog" width="unset">
          <v-card class="dialog">
            <v-card-text class="primary-background white-font d-flex">
              Add tournament
              <v-icon
                icon="mdi-close"
                class="d-flex align-center"
                @click="addTourDialog = false"
              />
            </v-card-text>
            <v-card-actions class="primary-background white-font">
              <div class="text-fields">
                <v-text-field
                  label="Name"
                  variant="outlined"
                  v-model="tourForm.name"
                  :error-messages="
                    v$.tourForm?.name.$errors[0]?.$message.toString()
                  "
                  @blur="v$.tourForm?.name.$validate"
                ></v-text-field>
                <v-text-field
                  label="Parts Count"
                  variant="outlined"
                  v-model="tourForm.levelsCount"
                  :error-messages="
                    v$.tourForm?.levelsCount.$errors[0]?.$message.toString()
                  "
                  @blur="v$.tourForm?.levelsCount.$validate"
                ></v-text-field>
                <v-btn class="status-button" @click="assignTournament">
                  SAVE
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
    <div>
      <v-text-field
        label="Search by name"
        variant="outlined"
        v-model="filterString"
        class="white-font filter-text"
        hide-details
      ></v-text-field>
      <v-btn-toggle class="buttons-wrapper" multiple v-model="filtersArray">
        <v-btn
          :class="filtersArray.includes(item as number)? 'active-button' : 'status-button'"
          v-for="item in Object.values(TournamentStatus).filter(
            (status) => !isNaN(Number(status))
          )"
          :key="item"
          :value="item"
          >{{ TournamentStatus[item as number] }}</v-btn
        >
      </v-btn-toggle>
    </div>
    <div class="bars">
      <TournamentBar
        v-for="item in filteredTournaments"
        :key="item.id"
        :data="item"
      ></TournamentBar>
    </div>
  </div>
</template>
<script setup lang="ts">
import axios from "axios";
import { Tournament, TournamentStatus } from "@/types/types-index";
import { ref, computed } from "vue";
import TournamentBar from "./TournamentBar.vue";
import { con } from "@/helpers/serverConnect";
import { required, numeric, between } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const tournaments = ref<Tournament[]>([] as Tournament[]);
const filtersArray = ref<number[]>([] as number[]);
const addTourDialog = ref<boolean>(false);
const tourForm = ref<Tournament>({} as Tournament);
const filterString = ref<string>("");

const rules = computed(() => ({
  tourForm: {
    name: {
      required,
    },
    levelsCount: {
      required,
      numeric,
      betweenValue: between(0, 10),
    },
  },
}));

const v$ = useVuelidate(rules, {
  tourForm,
});

const fetchData = async () => {
  await axios.get(`${process.env.VUE_APP_TOURNAMENTS}`).then((response) => {
    tournaments.value = response.data as Tournament[];
  });
};

fetchData();

const filteredTournaments = computed(() => {
  return tournaments.value.filter(
    (tournament) =>
      filterByArray(tournament.status) &&
      tournament.name.toLowerCase().match(filterString.value.toLowerCase())
  );
});

const assignTournament = async () => {
  const isValidated = await v$.value.$validate();
  if (!isValidated) return "";

  await axios
    .post(`${process.env.VUE_APP_TOURNAMENTS}`, tourForm.value)
    .then((response) => {
      if (response.status >= 200 && response.status <= 300) {
        con.invoke("RefreshTournaments");
        addTourDialog.value = false;
      }
    });
};

function filterByArray(status: TournamentStatus) {
  if (filtersArray.value.length === 0) return true;

  return filtersArray.value.includes(status);
}

con.on("SendRefreshRequest", () => {
  fetchData();
});
</script>
<style lang="scss" scoped>
.bars {
  display: flex;
  flex-direction: column;

  @include breakpoint(sm) {
    flex-direction: row;
    justify-content: space-between;
    gap: 40px;
    flex-wrap: wrap;
  }
}

.header {
  font-size: 20px;
  display: flex;
  justify-content: space-between;
}

.status-button {
  background: transparent;
  color: $gray-text;
}
.buttons-wrapper {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 0 10px;
  margin: 20px 0;
}
.buttons-wrapper:-webkit-scrollbar {
  display: none;
}

.active-button {
  background: $bondiBlue;
}

.add-tournament-button {
  display: flex;
  gap: 2px;
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

.filter-text {
  max-width: 360px;
}
</style>
