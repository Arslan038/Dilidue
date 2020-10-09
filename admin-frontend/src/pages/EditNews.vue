<template>
  <div id="content" class="app-content">
    <b-breadcrumb>
      <b-breadcrumb-item @click="move('/news')">News</b-breadcrumb-item>
      <b-breadcrumb-item active>Edit News</b-breadcrumb-item>
    </b-breadcrumb>

    <h1 class="page-header">Edit News</h1>

    <b-card>
      <b-form @submit.prevent="editNews">
        <b-row v-if="news">
          <b-col cols="12">
            <label for="">Upload News Image</label>

            <div
              class="image"
              @click="pickFile"
              v-bind:style="{
                'background-image': 'url(' + getImage(news.image) + ')',
              }"
            >
              <p v-if="!news.image">
                <i class="fa fa-camera"></i> <br />
                Pick Image
              </p>
            </div>
            <input
              type="file"
              style="display: none"
              ref="fileUpload"
              accept="image/*"
              @change="onUploadImage"
            />
          </b-col>
          <b-col cols="12" md="6" lg="6" xl="3">
            <b-form-group>
              <label for="">Headline*</label>
              <b-form-input
                placeholder="Enter News Headline"
                required
                v-model="news.title"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6" lg="6" xl="3">
            <b-form-group>
              <label for="">Contributor*</label>
              <b-form-input
                placeholder="Enter News Contributor"
                required
                v-model="news.contributor"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6" lg="6" xl="3">
            <b-form-group>
              <label for="">Location*</label>
              <vue-google-autocomplete
                ref="address"
                id="map"
                v-model="news.location"
                classname="form-control"
                placeholder="Enter Location"
                v-on:placechanged="getAddressData"
              ></vue-google-autocomplete>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6" lg="6" xl="3">
            <b-form-group>
              <label for="">News URL*</label>
              <b-form-input
                type="url"
                placeholder="Enter News URL"
                required
                v-model="news.url"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="12" class="text-right">
            <b-button type="submit" :disabled="loading" variant="primary">{{
              loading ? "Please wait..." : "Edit News"
            }}</b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-card>
  </div>
</template>
<script>
import VueGoogleAutocomplete from "vue-google-autocomplete";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "EditNews",
  components: {
    VueGoogleAutocomplete,
  },
  computed: {
    ...mapGetters(["getFoundNews"]),
  },
  watch: {
    getFoundNews(val) {
      if (val) {
        this.news.id = val.id;
        this.news.title = val.title;
        this.news.image = val.image;
        this.news.contributor = val.contributor;
        this.news.status = val.status;
        this.news.url = val.url;
        this.news.location = val.location;
        this.news.lat = val.position.coordinates[0];
        this.news.lng = val.position.coordinates[1];
        this.news.createdAt = val.createdAt;
        this.news.updatedAt = val.updatedAt;
        if (this.news.image == null) {
          delete this.news.image;
        }
      }
    },
  },
  data() {
    return {
      loading: null,
      address: null,
      image: null,
      news: {
        id: null,
        image: null,
        contributor: null,
        location: null,
        url: null,
        title: null,
        status: true,
        lat: null,
        lng: null,
      },
    };
  },
  created() {
    this.findNews(this.$route.params.id);
  },
  methods: {
    ...mapActions(["updateNews", "findNews"]),
    pickFile() {
      this.$refs.fileUpload.click();
    },
    getImage(logo) {
      if (logo) {
        if (typeof logo === "string" || logo instanceof String) {
          return logo;
        } else {
          return this.image;
        }
      }
    },
    move(to) {
      this.$router.push({ path: to });
    },
    onUploadImage(e) {
      if (e) {
        let file = e.target.files[0];
        if (file) {
          this.image = URL.createObjectURL(file);
          this.news.image = file;
        }
      }
    },
    getAddressData: function (addressData, placeResultData) {
      this.news.lat = addressData.latitude;
      this.news.lng = addressData.longitude;
      this.news.location = placeResultData.formatted_address;
    },
    async editNews() {
      if (!this.news.location) {
        this.toast("Please Enter Location", "Add News", "warning");
        return;
      }
      if (this.news.image === "null" || this.news.image === "undefined") {
        delete this.news.image;
      }
      this.loading = true;
      var form_data = new FormData();
      for (var key in this.news) {
        form_data.append(key, this.news[key]);
      }
      let resp = await this.updateNews(form_data);
      if (resp == 1) {
        this.$router.push({ path: "/news" });
      }
      this.loading = false;
    },
  },
};
</script>
<style scoped>
.image {
  width: 120px;
  height: 120px;
  border-radius: 4px;
  background-size: cover;
  background-repeat: no-repeat;
  border: 1px solid black;
  margin-bottom: 10px;
  text-align: center;
  padding-top: 30px;
}
.image:hover {
  cursor: pointer;
}
</style>
