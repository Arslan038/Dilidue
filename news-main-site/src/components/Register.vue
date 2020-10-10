<template>
  <div class="register">
    <v-form @submit.prevent lazy-validation ref="form">
      <v-row class="mx-1 my-5" align="center" justify="center">
        <v-col cols="12">
          <v-btn
            depressed
            color="indigo darken-4"
            @click="linkedInSignup"
            dark
            large
            block
          >
            <v-icon class="mr-2">mdi-linkedin</v-icon>Signup with Linkedin
          </v-btn>
        </v-col>
        <v-col cols="12" class="text-center">OR</v-col>
        <v-col cols="12">
          <v-text-field
            prepend-inner-icon="mdi-account"
            v-model="register.name"
            :rules="nameRules"
            outlined
            placeholder="Name"
            label="Name"
            type="text"
            required
          ></v-text-field>
          <v-text-field
            prepend-inner-icon="mdi-email"
            v-model="register.email"
            :rules="emailRules"
            outlined
            placeholder="john@example.com"
            label="Email"
            type="email"
            required
          ></v-text-field>
          <v-text-field
            prepend-inner-icon="mdi-phone"
            v-model="register.phone"
            :rules="phoneRules"
            outlined
            placeholder="Phone"
            label="Phone"
            type="tel"
            required
          ></v-text-field>
          <v-text-field
            prepend-inner-icon="mdi-lock"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            v-model="register.password"
            :rules="passwordRules"
            outlined
            placeholder="Your Password"
            label="Password"
            @click:append="show = !show"
            required
          ></v-text-field>
          <v-text-field
            prepend-inner-icon="mdi-lock"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            v-model="password"
            :rules="confirmRules"
            outlined
            placeholder="Confirm Password"
            label="Confirm Password"
            @click:append="show1 = !show1"
            required
          ></v-text-field>
          <v-btn
            depressed
            block
            color="primary"
            height="50"
            @click="registerUser"
            type="submit"
            :disabled="loading"
            >{{ loading ? 'Please wait...' : 'Register' }}</v-btn
          >
          <p class="text-center mt-1">
            Already have account ?
            <a @click="login">Login</a>
          </p>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'Register',
  data() {
    return {
      loading: false,
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [(v) => !!v || 'Password is required'],
      confirmRules: [(v) => !!v || 'Confirm Password is required'],
      nameRules: [(v) => !!v || 'Name is required'],
      phoneRules: [(v) => !!v || 'Phone is required'],
      show: false,
      show1: false,
      password: null,
      register: {
        name: null,
        email: null,
        phone: null,
        password: null,
        role: 'user',
      },
    };
  },
  methods: {
    ...mapActions(['createUser', 'socialSignup']),
    linkedInSignup() {
      this.socialSignup();
    },
    login() {
      this.$emit('login', 0);
    },
    setToast() {},
    async registerUser() {
      if (
        !this.register.name.length ||
        !this.register.email.length ||
        !this.register.password.length
      ) {
        this.$store.commit('setToast', {
          show: true,
          message: 'All fields are required.',
          color: 'red',
        });
        return;
      }
      if (this.password !== this.register.password) {
        this.$store.commit('setToast', {
          show: true,
          message: 'Password Mismatch',
          color: 'red',
        });
        return;
      }
      this.loading = true;
      let resp = await this.createUser(this.register);
      if (resp == 1) {
        this.$refs.form.reset();
        this.login();
      }
      this.loading = false;
    },
  },
};
</script>
