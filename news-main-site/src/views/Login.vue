<template>
  <div class="login-register">
    <LoginNavbar />
    <v-container>
      <v-row align="center" justify="center" class="mt-5">
        <v-col cols="12" md="6">
          <v-card raised shaped>
            <v-tabs v-model="tab" background-color="grey lighten-4" grow>
              <v-tab>Login</v-tab>
              <v-tab>Register</v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item>
                <LoginComponent @register="move" />
              </v-tab-item>
              <v-tab-item>
                <RegisterComponent @login="move" />
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import LoginNavbar from '@/components/LoginNavbar.vue';
import LoginComponent from '@/components/Login.vue';
import RegisterComponent from '@/components/Register.vue';
import mixin from '../mixins/global';
export default {
  name: 'Login',
  mixins: [mixin],
  metaInfo() {
    return {
      title: 'Login',
    };
  },
  components: {
    LoginNavbar,
    LoginComponent,
    RegisterComponent,
  },
  data() {
    return {
      tab: 0,
    };
  },
  created() {
    if (this.getUser()) {
      this.$router.push({ path: '/' });
    }
  },
  methods: {
    move(to) {
      this.tab = to;
    },
  },
};
</script>
