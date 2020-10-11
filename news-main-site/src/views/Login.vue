<template>
  <div class="login-register">
    <LoginNavbar />
    <v-container>
      <v-row align="center" justify="center" class="mt-5">
        <v-col cols="12" md="6" v-if="loading">
          <v-alert type="warning">Please wait for a while we are authenticating you...</v-alert>
        </v-col>
      </v-row>
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
import { mapActions } from 'vuex';
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
      loading: false
    };
  },
  created() {
    if (this.getUser()) {
      this.$router.push({ path: '/' });
      }
    if(this.$route.params.status) {
      const status = this.$route.params.status
      const id = this.$route.params.user
      this.$router.push('/login')
      if(status == "exists") {
        this.linkedinLoginRequest(id)
      }
      if(status == "registered") {
        this.linkedinLoginRequest(id)
      }
      if(status == "error") {
        this.$store.commit('setToast', {
          message: 'Something went wrong.',
          color: 'danger',
          show: true,
        })
      }
    }
    
  },
  methods: {
    ...mapActions(["linkedinLogin"]),
    async linkedinLoginRequest(id) {
      this.loading = true;
      let resp = await this.linkedinLogin(id);
      if (resp == 1) {
        this.$router.push({ path: '/' });
      }
      this.loading = false;
    },
    move(to) {
      this.tab = to;
    },
  },
};
</script>
