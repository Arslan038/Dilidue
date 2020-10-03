<template>
    <div id="content" class="app-content">
        <!-- <b-container class="form-container"> -->
        <b-breadcrumb>
            <b-breadcrumb-item @click="move('/brandings')"
                >Brandings</b-breadcrumb-item
            >
            <b-breadcrumb-item active>Edit Branding</b-breadcrumb-item>
        </b-breadcrumb>

        <h1 class="page-header">Edit Branding</h1>
        <b-row>
            <b-col cols="12" class="mt-3 text-center" v-if="loading">
                <b-spinner variant="primary"></b-spinner>
                <p>Finding Branding for you...</p>
            </b-col>
            <b-col cols="12" class="text-center" v-if="notFound">
                <h4>Sorry! No Branding Found...</h4>
            </b-col>
        </b-row>
        <b-form @submit.prevent="editBranding" v-if="!loading && !notFound">
            <b-card>
                <b-row>
                    <b-col cols="12">
                        <label for
                            >Upload Company Logo/Professional Headshot</label
                        >
                        <div
                            class="image"
                            @click="pickFile"
                            v-bind:style="{
                                'background-image':
                                    'url(' + getImage(branding.image) + ')'
                            }"
                        >
                            <p v-if="!branding.image">
                                <i class="fa fa-camera"></i>
                                <br />Pick Image
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
                            <label for>Company Name*</label>
                            <b-form-input
                                placeholder="Enter Company Name"
                                required
                                v-model="branding.company_name"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" md="6" lg="6" xl="3">
                        <b-form-group>
                            <label for>Professional/Expert(s) Name*</label>
                            <b-form-input
                                placeholder="Enter Professional/Expert(s) Name"
                                required
                                v-model="branding.expert_name"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" md="6" lg="6" xl="3">
                        <b-form-group>
                            <label for="">Location*</label>
                            <vue-google-autocomplete
                                ref="address"
                                id="map"
                                v-model="branding.location"
                                classname="form-control"
                                placeholder="Enter Location"
                                v-on:placechanged="getAddressData"
                            ></vue-google-autocomplete>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" md="6" lg="6" xl="3">
                        <b-form-group>
                            <label for>Date Range*</label>
                            <br />
                            <a-range-picker
                                @change="onChange"
                                format="MM-DD-YYYY"
                                v-model="dateRange"
                            />
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-card>

            <b-card class="mt-2">
                <b-row>
                    <b-col cols="12" md="6" lg="4" class="mt-2">
                        <b-button block v-b-toggle.collapse-1>
                            {{
                                branding.service_title
                                    ? branding.service_title
                                    : "Enter Service Details"
                            }}
                            <i class="fa fa-chevron-down"></i>
                        </b-button>
                        <b-collapse
                            id="collapse-1"
                            :visible="true"
                            class="pt-2"
                        >
                            <b-form-group>
                                <label>Service</label>
                                <b-form-select
                                    v-model="selected_service"
                                    @change="selectService"
                                    required
                                >
                                    <b-form-select-option :value="null"
                                        >Select Service</b-form-select-option
                                    >
                                    <b-form-select-option
                                        v-for="(service, index) in serviceList"
                                        :key="index"
                                        :value="service"
                                        >{{ service }}</b-form-select-option
                                    >
                                </b-form-select>
                            </b-form-group>
                            <b-form-group v-if="selected_service == 'Other'">
                                <label>Title</label>
                                <b-form-input
                                    placeholder="Enter Title"
                                    v-model="branding.service_title"
                                    required
                                ></b-form-input>
                            </b-form-group>
                            <b-form-group>
                                <label>Description</label>
                                <b-form-textarea
                                    placeholder="Description"
                                    v-model="branding.service_description"
                                    required
                                ></b-form-textarea>
                            </b-form-group>
                        </b-collapse>
                    </b-col>
                </b-row>
            </b-card>
            <b-row>
                <b-col cols="12" class="text-right mt-3">
                    <b-button
                        type="submit"
                        variant="primary"
                        :disabled="editLoading"
                        >{{
                            editLoading ? "Please wait..." : "Edit Branding"
                        }}</b-button
                    >
                </b-col>
            </b-row>
        </b-form>
        <!-- </b-container> -->
    </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import mixins from "../mixins/global";
import VueGoogleAutocomplete from "vue-google-autocomplete";
export default {
    name: "EditBraning",
    mixins: [mixins],
    components: {
        VueGoogleAutocomplete
    },
    computed: {
        ...mapGetters(["getBrandings", "getBranding"])
    },
    data() {
        return {
            serviceList: [
                "Accounting/Accountant",
                "Appraiser/Valuation",
                "Architects and Planners",
                "Asset Management (Financial Analysis)",
                "Brokerage - Investment/Sales",
                "Brokerage - Leasing",
                "Corporate Real Estate (Operations)",
                "Development/Construction",
                "Financing",
                "Investment (Principal)",
                "Legal Services",
                "Other",
                "Portfolio Management (Loan Servicing)",
                "Property Management (Tenant Relations, Due Diligence, etc.)"
            ],
            address: null,
            notFound: false,
            loading: false,
            image: null,
            selected_service: null,
            editLoading: false,
            dateRange: null,
            branding: {
                id: null,
                image: null,
                company_name: null,
                expert_name: null,
                start_date: null,
                end_date: null,
                service_title: null,
                service_description: null,
                location: null,
                lat: null,
                lng: null,
                user_id: null,
                status: true
            }
        };
    },
    methods: {
        ...mapActions(["findBranding", "updateBranding"]),
        getAddressData: function(addressData, placeResultData) {
            this.branding.lat = addressData.latitude;
            this.branding.lng = addressData.longitude;
            this.branding.location = placeResultData.formatted_address;
        },
        onChange(date, dateString) {
            this.branding.start_date = dateString[0];
            this.branding.end_date = dateString[1];
        },
        move(to) {
            this.$router.push({ path: to });
        },
        pickFile() {
            this.$refs.fileUpload.click();
        },
        selectService(e) {
            if (e) {
                this.selected_service = e;
                this.branding.service_title = e;
            }
        },
        onUploadImage(e) {
            if (e) {
                let file = e.target.files[0];
                if (file) {
                    this.image = URL.createObjectURL(file);
                    this.branding.image = file;
                }
            }
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

        async editBranding() {
            this.branding.user_id = this.getUser().id;
            if (!this.branding.location) {
                this.toast("Please Enter Location", "Add Branding", "warning");
                return;
            }
            if (!this.branding.start_date) {
                this.toast(
                    "Please Select Date Range",
                    "Add Branding",
                    "warning"
                );
                return;
            }
            this.editLoading = true;
            var form_data = new FormData();
            for (var key in this.branding) {
                form_data.append(key, this.branding[key]);
            }
            let resp = await this.updateBranding(form_data);
            if (resp == 1) {
                this.$router.push({ path: "/brandings" });
            }
            this.editLoading = false;
        },
        setBranding(val) {
            this.branding.id = val.id;
            this.branding.company_name = val.company_name;
            this.branding.image = val.image;
            this.branding.expert_name = val.expert_name;
            this.branding.status = val.status;
            this.branding.location = val.location;
            this.branding.service_title = val.service_title;
            this.selected_service = val.service_title;
            this.branding.service_description = val.service_description;
            this.branding.lat = val.position.coordinates[0];
            this.branding.lng = val.position.coordinates[1];
            this.branding.createdAt = val.createdAt;
            this.branding.updatedAt = val.updatedAt;
            this.dateRange = [];
            this.dateRange.push(val.start_date);
            this.dateRange.push(val.end_date);
            this.branding.start_date = val.start_date;
            this.branding.end_date = val.end_date;
        }
    },
    created() {
        const id = this.$route.params.id;
        if (this.getBrandings.length) {
            let item = this.getBrandings.find(b => b.id == id);
            if (item) {
                this.setBranding(item);
            } else {
                this.notFound = true;
            }
        } else {
            this.loading = true;
            this.findBranding(id);
        }
    },
    watch: {
        getBranding(val) {
            if (val == 0) {
                this.loading = false;
                this.notFound = true;
            }
            if (val && val != 0) {
                this.loading = false;
                this.setBranding(val);
            }
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
