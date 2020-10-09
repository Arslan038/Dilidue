<template>
  <v-app>
    <v-snackbar
      v-if="toast"
      v-model="toast.show"
      :color="toast.color"
      :right="true"
      :top="true"
    >
      {{ toast.message }}

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="toast.show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import mixins from './mixins/global';
export default {
  name: 'App',
  mixins: [mixins],
  computed: {
    ...mapGetters(['getToast', 'getLogoutUser']),
  },

  watch: {
    getToast(val) {
      if (val) {
        this.toast = val;
      }
    },
    getLogoutUser(val) {
      if (val) {
        this.removeUser();
        this.$router.push({ path: '/login' });
      }
    },
  },
  data: () => ({
    toast: null,
    //
  }),
};
</script>

<style>
#app {
  background: #f9f9f9;
  margin: 0 !important;
  padding: 0 !important;
}
.v-expansion-panel-content__wrap {
  overflow-x: scroll !important;
}
.iframe {
  width: 100% !important;
}
.toggle {
  display: none;
}
.range-tabs.v-tab {
  font-size: 0.7rem !important;
}
.v-slider__tick-label {
  font-size: 12px !important;
  top: 20px !important;
}
.v-slider__tick {
  height: 30px !important;
  top: -15px !important;
  background-color: #ddd !important;
}
.v-slider--horizontal .v-slider__tick .v-slider__tick-label {
  top: 30px !important;
}
.v-text-field--rounded {
  border-radius: 0 !important;
  min-width: 350px !important;
}
.v-card__subtitle {
  padding-bottom: 10px !important;
}
.labels {
  background: #000 !important;
  color: #fff !important;
}
@media screen and (min-width: 1261px) {
  #main-nav.v-navigation-drawer {
    display: none !important;
  }
  .v-main {
    padding-left: 0 !important;
  }
  header {
    left: 0 !important;
  }
}
@media screen and (max-width: 1260px) {
  .toggle {
    display: flex !important;
  }
}
</style>
