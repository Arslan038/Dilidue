<template>
  <!-- BEGIN login -->
  <div class="login">
    <!-- BEGIN login-content -->
    <div class="login-content">
      <form @submit.prevent="checkForm" name="login_form">
        <h1 class="text-center">Admin Sign In</h1>
        <div class="text-muted text-center mb-4">
          For your protection, please verify your identity.
        </div>

        <b-form-group label="Email Address">
          <b-input
            size="lg"
            class="fs-15px"
            placeholder="username@address.com"
            v-model="user.email"
            required
          ></b-input>
        </b-form-group>

        <b-form-group>
          <div class="d-flex">
            <label>Password</label>
            <b-link a href="#" class="ml-auto text-muted"
              >Forgot password?</b-link
            >
          </div>
          <b-input
            type="password"
            size="lg"
            v-model="user.password"
            class="fs-15px"
            placeholder="Enter your password"
            required
          ></b-input>
        </b-form-group>

        <!-- <b-form-group>
                    <b-form-checkbox id="rememberMe" name="remember_me"
                        >Remember me</b-form-checkbox
                    >
                </b-form-group> -->

        <button
          type="submit"
          class="btn btn-primary btn-lg btn-block fw-500 mb-3"
          :disabled="loading"
        >
          {{ loading ? "Please wait..." : "Sign In" }}
        </button>
      </form>
    </div>
    <!-- END login-content -->
  </div>
  <!-- END login -->
</template>

<script>
import AppOptions from "../config/AppOptions.vue";
import Repository from "../Repository/Repository";
import { RepositoryFactory } from "../Repository/RepositoryFactory";
const UserRepository = RepositoryFactory.get("user_repository");
import mixins from "../mixins/global";
export default {
  name: "Login",
  mixins: [mixins],
  data() {
    return {
      user: {
        email: null,
        password: null,
      },
      loading: false,
    };
  },
  mounted() {
    AppOptions.appWithoutSidebar = true;
    AppOptions.appWithoutHeader = true;
    AppOptions.appContentFullWidth = true;
  },
  beforeRouteLeave(to, from, next) {
    AppOptions.appWithoutSidebar = false;
    AppOptions.appWithoutHeader = false;
    AppOptions.appContentFullWidth = false;
    next();
  },
  methods: {
    async checkForm() {
      try {
        this.loading = true;
        let resp = await UserRepository.authenticateUser(this.user);
        if (resp.status == 404) {
          this.toast(resp.data.message, "Login", "danger");
        }
        if (resp.status == 201) {
          let user = resp.data.user;
          user.token = resp.data.token;
          if (user.role == "admin") {
            this.setUser(user);
            Repository.defaults.headers.Authorization = `Bearer ${user.token}`;
            this.toast(resp.data.message, "Login", "success");
            let self = this;
            setTimeout(() => {
              self.$router.push({ path: "/dashboard" });
            }, 500);
          } else {
            this.toast("Only Admin can Login", "Login", "warning");
          }
        } else {
          this.toast(resp.data.message, "Login", "danger");
        }
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.toast("Invalid Email or Password", "Login", "danger");
      }
    },
  },
};
</script>
