<template>
  <div class="login">
    <v-form @submit.prevent lazy-validation>
      <v-row class="mx-1 my-5" align="center" justify="center">
        <v-col cols="12">
          <v-btn depressed color="indigo darken-4" dark large block @click="linkedInLogin">
            <v-icon class="mr-2">mdi-linkedin</v-icon>Login with Linkedin
          </v-btn>
        </v-col>
        <v-col cols="12" class="text-center">OR</v-col>
        <v-col cols="12">
          <v-text-field
            prepend-inner-icon="mdi-email"
            v-model="login.email"
            :rules="emailRules"
            outlined
            placeholder="john@example.com"
            label="Email"
            type="email"
            required
          ></v-text-field>
          <v-text-field
            prepend-inner-icon="mdi-lock"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            v-model="login.password"
            :rules="passwordRules"
            outlined
            placeholder="Your Password"
            label="Password"
            @click:append="show = !show"
            required
          ></v-text-field>
          <v-btn
            depressed
            block
            color="primary"
            height="50"
            type="submit"
            :disabled="loading"
            @click="loginNow"
            >{{ loading ? 'Please wait...' : 'Login' }}</v-btn
          >
          <p class="text-center mt-1">
            Don't have account ?
            <a @click="register">Register</a>
          </p>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'Login',
  data() {
    return {
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [(v) => !!v || 'Password is required'],
      show: false,
      loading: false,
      login: {
        email: null,
        password: null,
      },
    };
  },
  methods: {
    ...mapActions(['loginUser']),
    register() {
      this.$emit('register', 1);
    },
    linkedInLogin() {
      window.open('http://localhost:5000/api/linkedin', '_blank')
    },
    async loginNow() {
      if (!this.login.email.length || !this.login.password.length) {
        this.$store.commit('setToast', {
          show: true,
          message: 'Email or Password Missing.',
          color: 'red',
        });
        return;
      }
      this.loading = true;
      let resp = await this.loginUser(this.login);
      if (resp == 1) {
        this.$router.push({ path: '/' });
      }
      this.loading = false;
    },
  },
};
</script>
