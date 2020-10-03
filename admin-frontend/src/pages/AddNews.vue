<template>
    <div id="content" class="app-content">
        <b-breadcrumb>
            <b-breadcrumb-item @click="move('/news')">News</b-breadcrumb-item>
            <b-breadcrumb-item active>Add News</b-breadcrumb-item>
        </b-breadcrumb>

        <h1 class="page-header">Add News</h1>

        <b-card>
            <b-form @submit.prevent="addNews">
                <b-row>
                    <b-col cols="12">
                        <label for="">Upload News Image</label>
                        <div
                            class="image"
                            @click="pickFile"
                            v-bind:style="{
                                'background-image': 'url(' + image + ')'
                            }"
                        >
                            <p v-if="!image">
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
                                v-model="address"
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
                        <b-button
                            type="submit"
                            :disabled="loading"
                            variant="primary"
                            >{{
                                loading ? "Please wait..." : "Add News"
                            }}</b-button
                        >
                    </b-col>
                </b-row>
            </b-form>
        </b-card>
    </div>
</template>
<script>
import VueGoogleAutocomplete from "vue-google-autocomplete";
import { mapActions } from "vuex";
import mixins from "../mixins/global";
export default {
    name: "AddNews",
    mixins: [mixins],
    components: {
        VueGoogleAutocomplete
    },
    data() {
        return {
            loading: null,
            address: null,
            image: null,
            news: {
                image: null,
                contributor: null,
                location: null,
                url: null,
                title: null,
                status: true,
                lat: null,
                lng: null,
                user_id: null
            }
        };
    },
    methods: {
        ...mapActions(["createNews"]),
        pickFile() {
            this.$refs.fileUpload.click();
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
        getAddressData: function(addressData, placeResultData) {
            this.news.lat = addressData.latitude;
            this.news.lng = addressData.longitude;
            this.news.location = placeResultData.formatted_address;
        },
        async addNews() {
            if (!this.news.location) {
                this.toast("Please Enter Location", "Add News", "warning");
                return;
            }
            this.loading = true;
            this.news.user_id = this.getUser().id;
            var form_data = new FormData();
            for (var key in this.news) {
                form_data.append(key, this.news[key]);
            }
            let resp = await this.createNews(form_data);
            if (resp == 1) {
                this.$router.push({ path: "/news" });
            }
            this.loading = false;
        }
    }
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
