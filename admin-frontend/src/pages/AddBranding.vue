<template>
    <div id="content" class="app-content">
        <!-- <b-container class="form-container"> -->
        <b-breadcrumb>
            <b-breadcrumb-item @click="move('/brandings')"
                >Brandings</b-breadcrumb-item
            >
            <b-breadcrumb-item active>Add Branding</b-breadcrumb-item>
        </b-breadcrumb>

        <h1 class="page-header">Add Branding</h1>
        <b-form @submit.prevent="addBranding">
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
                                'background-image': 'url(' + image + ')'
                            }"
                        >
                            <p v-if="!image">
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
                                v-model="address"
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
                        :disabled="loading"
                        >{{
                            loading ? "Please wait..." : "Add Branding"
                        }}</b-button
                    >
                </b-col>
            </b-row>
        </b-form>
        <!-- </b-container> -->
    </div>
</template>
<script>
import { mapActions } from "vuex";
import mixins from "../mixins/global";
import VueGoogleAutocomplete from "vue-google-autocomplete";
export default {
    name: "AddBraning",
    mixins: [mixins],
    components: {
        VueGoogleAutocomplete
    },
    data() {
        let startDate = new Date();
        let endDate = new Date();
        endDate.setDate(endDate.getDate() + 6);
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
            dateRange: { startDate, endDate },
            address: null,

            image: null,
            selected_service: null,
            loading: false,
            branding: {
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
        ...mapActions(["createBranding"]),
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

        async addBranding() {
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
            this.loading = true;
            var form_data = new FormData();
            for (var key in this.branding) {
                form_data.append(key, this.branding[key]);
            }
            let resp = await this.createBranding(form_data);
            if (resp == 1) {
                this.$router.push({ path: "/brandings" });
            }
            this.loading = false;
        }
    },
    watch: {
        dateRange(val) {
            console.log(val);
        },
        address(val) {
            if (val) {
                console.log(val);
                this.location = null;
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
