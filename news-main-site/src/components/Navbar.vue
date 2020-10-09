<template>
  <div class="navbar">
    <v-app-bar app color="white" light>
      <div class="d-flex align-center">
        <v-img
          @click="move('/')"
          class="shrink mr-2"
          contain
          src="../assets/logo.png"
          transition="scale-transition"
          width="100"
        />
        <div
          class="d-md-none d-sm-none d-none d-xs-none d-lg-flex align-center"
          v-if="isUserLoggedIn()"
        >
          <v-btn text @click="move('/ask-an-expert')">
            <v-img src="../assets/expert.png" width="30" class="mr-1"></v-img
            >Ask an Expert
          </v-btn>
          <v-btn text @click="move('/calculator')">
            <v-img src="../assets/analysis.png" width="40" class="mr-1"></v-img
            >Analysis
          </v-btn>
        </div>
      </div>

      <v-spacer></v-spacer>
      <div
        class="d-md-none d-sm-none d-none d-xs-none d-lg-flex align-center"
        v-if="isUserLoggedIn()"
      >
        <v-text-field
          filled
          prepend-inner-icon="mdi-magnify"
          class="mt-7"
          width="10px"
          height="65px"
          rounded
          placeholder="Search address, submarket, city, state"
        ></v-text-field>
      </div>
      <v-menu offset-y v-if="getUser()">
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <v-avatar class="ml-3 mr-2" color="primary">
              <img v-if="getUserInfo().image" :src="getUserInfo().image" />
              <span v-else class="name">{{ getUserName() }}</span></v-avatar
            >{{ getUserInfo().name }}
          </div>
        </template>
        <v-list nav dense>
          <v-list-item-group>
            <v-list-item @click="profileModal = !profileModal">
              <v-icon class="pr-1">mdi-account</v-icon>Profile
            </v-list-item>
            <v-list-item @click="passwordModal = !passwordModal">
              <v-icon class="pr-1">mdi-lock</v-icon>Update Password
            </v-list-item>
            <v-list-item @click="logout">
              <v-icon class="pr-1">mdi-power</v-icon>Logout
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
      <v-app-bar-nav-icon
        class="toggle"
        @click="drawer = !drawer"
        v-if="isUserLoggedIn()"
      ></v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      class="white"
      id="main-nav"
      light
      v-if="isUserLoggedIn()"
    >
      <v-list-item>
        <v-list-item-content>
          <v-img
            @click="move('/')"
            class="shrink mr-2"
            contain
            src="../assets/logo.png"
            transition="scale-transition"
            width="100"
          />
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn text @click="move('/ask-an-expert')">
                <v-img
                  src="../assets/expert.png"
                  width="30"
                  class="mr-1"
                ></v-img
                >Ask an Expert
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn text @click="move('/calculator')">
                <v-img
                  src="../assets/analysis.png"
                  width="40"
                  class="mr-1"
                ></v-img
                >Analysis
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-text-field
        filled
        prepend-inner-icon="mdi-magnify"
        width="10px"
        height="65px"
        rounded
        placeholder="Search"
      ></v-text-field>
    </v-navigation-drawer>

    <v-dialog v-model="profileModal" scrollable max-width="500px">
      <v-card>
        <v-row class="mx-3">
          <v-col cols="12">
            <h2 class="pb-3">Update Profile</h2>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" class="text-center">
            <v-avatar color="primary" size="80" @click="pickFile">
              <v-img v-if="user.image || image" :src="getImage"></v-img>
              <span v-if="!user.image && !image"
                ><v-icon class="white--text headline">mdi-camera</v-icon></span
              >
            </v-avatar>
            <input
              type="file"
              style="display: none"
              ref="fileUpload"
              accept="image/*"
              @change="onUploadImage"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              dense
              label="Name"
              v-model="user.name"
              :rules="nameRules"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              dense
              label="Email"
              v-model="user.email"
              :rules="emailRules"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              dense
              label="Phone"
              v-model="user.phone"
              :rules="phoneRules"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-btn
              depressed
              color="primary"
              block
              @click="editUserProfile"
              :disabled="editProfileLoading"
              >{{
                editProfileLoading ? 'Please wait...' : 'Update Profile'
              }}</v-btn
            >
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <v-dialog v-model="passwordModal" scrollable max-width="500px">
      <v-card>
        <v-row class="mx-3">
          <v-col cols="12">
            <h2 class="pb-3">Update Password</h2>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="New Password"
              v-model="password"
              :rules="passwordRules"
            >
            </v-text-field>
            <v-text-field
              label="Confirm Password"
              v-model="confirm"
              :rules="passwordRules"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn
              depressed
              color="primary"
              block
              @click="editUserPassword"
              :disabled="editPasswordLoading"
              >{{
                editPasswordLoading ? 'Please wait...' : 'Update Password'
              }}</v-btn
            >
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import mixin from '../mixins/global';
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'Navbar',
  mixins: [mixin],
  computed: {
    ...mapGetters(['']),
    getImage() {
      let logo = this.getUser().image;
      if (logo) {
        return logo;
      } else if (this.image) {
        return this.image;
      }
      return null;
    },
  },
  data() {
    return {
      drawer: false,
      profileModal: false,
      passwordModal: false,
      editProfileLoading: false,
      editPasswordLoading: false,
      image: null,
      password: null,
      confirm: null,
      passwordRules: [(v) => !!v || 'Password is required'],
      nameRules: [(v) => !!v || 'Name is required'],
      phoneRules: [(v) => !!v || 'Phone is required'],
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      user: {
        id: null,
        image: null,
        name: null,
        email: null,
        phone: null,
      },
    };
  },
  created() {
    if (!this.getUser() && this.$route.path !== '/login') {
      this.$router.push({ path: '/login' });
    } else {
      this.user.id = this.getUser().id;
      this.user.name = this.getUser().name;
      this.user.email = this.getUser().email;
      this.user.image = this.getUser().image;
      this.user.phone = this.getUser().phone;
    }
  },
  methods: {
    ...mapActions(['updateUser', 'updatePassword']),
    move(to) {
      this.$router.push({ path: to });
    },
    pickFile() {
      this.$refs.fileUpload.click();
    },
    onUploadImage(e) {
      if (e) {
        let file = e.target.files[0];
        if (file) {
          this.image = URL.createObjectURL(file);
          this.user.image = file;
        }
      }
    },
    async editUserProfile() {
      this.editProfileLoading = true;
      var form_data = new FormData();
      for (var key in this.user) {
        form_data.append(key, this.user[key]);
      }
      const payload = {
        id: this.user.id,
        data: form_data,
      };
      let resp = await this.updateUser(payload);
      this.editProfileLoading = false;
      if (resp == 1) {
        this.$store.commit('setToast', {
          message: 'Profile Updated. Please Login again',
          color: 'warning',
          show: true,
        });
        this.removeUser();
        this.$router.push({ path: '/login' });
      }
    },
    async editUserPassword() {
      if (this.password.length < 6) {
        this.$store.commit('setToast', {
          message: 'Password should contain atleast 6 characters.',
          color: 'warning',
          show: true,
        });
        return;
      }
      if (this.password != this.confirm) {
        this.$store.commit('setToast', {
          message: 'Password Mismatch.',
          color: 'warning',
          show: true,
        });
        return;
      }

      const payload = {
        id: this.getUser().id,
        data: {
          password: this.password,
        },
      };
      this.editPasswordLoading = true;
      let resp = await this.updatePassword(payload);
      this.editPasswordLoading = false;

      if (resp == 1) {
        this.$store.commit('setToast', {
          message: 'Password Updated. Please Login again',
          color: 'warning',
          show: true,
        });
        this.removeUser();
        this.$router.push({ path: '/login' });
      }
    },
    isUserLoggedIn() {
      if (this.getUser()) {
        return true;
      }
      return false;
    },
    getUserInfo() {
      if (this.getUser()) {
        return this.getUser();
      }
      return null;
    },
    getUserName() {
      if (this.getUser()) {
        let name = this.getUser().name;
        if (name.includes(' ')) {
          let first_name = name.split(' ')[0];
          let last_name = name.split(' ')[1];
          return first_name.charAt(0) + '' + last_name.charAt(0);
        } else {
          return name.charAt(0);
        }
      }
      return;
    },
    logout() {
      this.removeUser();
      this.$router.push({ path: '/login' });
    },
  },
};
</script>

<style scoped>
.name {
  text-transform: uppercase;
  color: white;
}
</style>
