<template>
    <!-- BEGIN #content -->
    <div id="content" class="app-content">
        <b-row>
            <b-col cols="8">
                <h1 class="page-header mb-3">Professional Brandings</h1>
            </b-col>
            <b-col cols="4" class="text-right">
                <b-button variant="primary" @click="move('/add-branding')"
                    ><i class="fa fa-tag"></i> Add Branding</b-button
                >
            </b-col>
        </b-row>

        <!-- Filter Area -->
        <b-card>
            <b-row>
                <b-col cols="12" md="6" lg="6" xl="3">
                    <label for="">Filter By Company</label>
                    <b-form-input
                        placeholder="Enter Company Name"
                        @input="fiterByCompanyName"
                    ></b-form-input>
                </b-col>
                <b-col cols="12" md="6" lg="6" xl="3">
                    <label for="">Filter By Expert</label>
                    <b-form-input
                        placeholder="Enter Expert Name"
                        @input="fiterByExpertName"
                    ></b-form-input>
                </b-col>
                <b-col cols="12" md="6" lg="6" xl="3">
                    <label for="">Filter By Professional Service</label>
                    <b-form-input
                        placeholder="Enter Professional Service"
                        @input="fiterByServiceName"
                    ></b-form-input>
                </b-col>
                <b-col cols="12" md="6" lg="6" xl="3">
                    <label for="">Filter By Date</label>
                    <b-form-datepicker @input="fiterByDate"></b-form-datepicker>
                </b-col>
            </b-row>
        </b-card>

        <b-row>
            <b-col cols="12" class="text-center mt-3" v-if="loading">
                <b-spinner variant="primary"></b-spinner>
                <p>Loading News...</p>
            </b-col>
            <b-col
                cols="12"
                sm="6"
                md="4"
                lg="4"
                xl="3"
                class="mt-3"
                v-for="(item, index) in brandingItems"
                :key="index"
            >
                <b-card
                    v-if="brandingItems.length"
                    :img-src="item.image ? item.image : img"
                    img-top
                    img-height="150"
                    :title="item.company_name"
                >
                    <b-card-text>
                        <p>
                            <i>Expert(s): {{ item.expert_name }}</i>
                        </p>
                    </b-card-text>
                    <p>
                        <strong
                            >{{ getDate(item.start_date) }} -
                            {{ getDate(item.end_date) }}</strong
                        >
                    </p>
                    <b-row>
                        <b-col cols="6" class="mt-2">
                            <b-button
                                variant="primary"
                                @click="move('/branding/' + item.id)"
                                size="sm"
                                block
                                ><i class="fa fa-eye"></i> Details</b-button
                            >
                        </b-col>
                        <b-col cols="6" class="mt-3 text-right">
                            <b-button
                                size="sm"
                                @click="move('/edit-branding/' + item.id)"
                                ><i class="fa fa-edit"></i
                            ></b-button>
                            <b-button
                                size="sm"
                                class="ml-1"
                                @click="remove(item)"
                                ><i class="fa fa-trash"></i
                            ></b-button>
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>
        </b-row>

        <b-pagination
            class="mt-3"
            align="right"
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
        ></b-pagination>

        <!-- Delete Modal -->

        <b-modal
            title="Delete Branding"
            :hide-footer="true"
            v-model="deleteModal"
        >
            <b-row v-if="brandToDelete">
                <b-col cols="12" class="text-center mb-3">
                    <h5>
                        Are you sure you want to delete branding of
                        {{ brandToDelete.company_name }} ?
                    </h5>
                </b-col>
                <b-col cols="6">
                    <b-button
                        block
                        variant="primary"
                        @click="deleteBrand"
                        :disabled="deleteLoading"
                        >{{
                            deleteLoading
                                ? "Please wait..."
                                : "Yes, Delete Branding"
                        }}</b-button
                    >
                </b-col>
                <b-col cols="6">
                    <b-button
                        block
                        variant="secondary"
                        @click="deleteModal = !deleteModal"
                        >No, Cancel</b-button
                    >
                </b-col>
            </b-row>
        </b-modal>
    </div>
    <!-- END #content -->
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import mixins from "../mixins/global";
import moment from "moment";
export default {
    name: "Brandings",
    mixins: [mixins],
    computed: {
        ...mapGetters(["getBrandings"]),
        rows() {
            return this.items.length;
        },
        brandingItems() {
            const items = this.items;
            if (items) {
                return items.slice(
                    (this.currentPage - 1) * this.perPage,
                    this.currentPage * this.perPage
                );
            }
            return null;
        }
    },
    data() {
        return {
            loading: false,
            img: require("../assets/logo.png"),
            deleteModal: false,
            currentPage: 1,
            perPage: 8,
            items: [],
            brandToDelete: null,
            deleteLoading: false
        };
    },
    methods: {
        ...mapActions(["fetchBrandings", "deleteBranding"]),
        move(to) {
            this.$router.push({ path: to });
        },
        fiterByCompanyName(value) {
            if (value) {
                let brands = this.getBrandings;
                this.items = brands.filter(
                    item =>
                        item.company_name
                            .toLowerCase()
                            .indexOf(value.toLowerCase()) > -1
                );
            } else {
                this.items = this.getBrandings;
            }
        },
        fiterByExpertName(value) {
            if (value) {
                let brands = this.getBrandings;
                this.items = brands.filter(
                    item =>
                        item.expert_name
                            .toLowerCase()
                            .indexOf(value.toLowerCase()) > -1
                );
            } else {
                this.items = this.getBrandings;
            }
        },
        fiterByServiceName(value) {
            if (value) {
                let brands = this.getBrandings;
                this.items = brands.filter(
                    item =>
                        item.service_title
                            .toLowerCase()
                            .indexOf(value.toLowerCase()) > -1
                );
            } else {
                this.items = this.getBrandings;
            }
        },
        fiterByDate(value) {
            if (value) {
                let selected = moment(value);
                if (value) {
                    let brands = this.getBrandings;
                    let filtered = [];
                    brands.filter(item => {
                        let check = moment(item.end_date).isAfter(selected);
                        if (check) {
                            filtered.push(item);
                        }
                    });
                    this.items = filtered;
                } else {
                    this.items = this.getBrandings;
                }
            }
        },
        remove(brand) {
            this.brandToDelete = brand;
            this.deleteModal = true;
        },
        async deleteBrand() {
            this.deleteLoading = true;
            let resp = await this.deleteBranding(this.brandToDelete.id);
            if (resp == 1) {
                this.deleteModal = false;
            }
            this.deleteLoading = false;
        }
    },
    created() {
        if (this.getBrandings.length > 0) {
            this.items = this.getBrandings;
        } else {
            this.loading = true;
            this.fetchBrandings();
        }
    },
    watch: {
        getBrandings(val) {
            if (val) {
                this.loading = false;
                this.items = val;
            }
        }
    }
};
</script>

<style scoped>
p {
    margin: 0;
}
</style>
