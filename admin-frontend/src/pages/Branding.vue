<template>
    <!-- BEGIN #content -->
    <div id="content" class="app-content">
        <b-breadcrumb>
            <b-breadcrumb-item @click="move('/brandings')"
                >Brandings</b-breadcrumb-item
            >
            <b-breadcrumb-item active>Branding Details</b-breadcrumb-item>
        </b-breadcrumb>

        <h1 class="page-header">Branding Details</h1>

        <b-row>
            <b-col cols="12" class="mt-3 text-center" v-if="loading">
                <b-spinner variant="primary"></b-spinner>
                <p>Finding Branding for you...</p>
            </b-col>
            <b-col cols="12" class="text-center" v-if="notFound">
                <h4>Sorry! No Branding Found...</h4>
            </b-col>
            <b-col
                cols="12"
                md="12"
                sm="12"
                lg="8"
                class="mt-1"
                v-if="branding"
            >
                <b-card
                    :img-src="branding.image ? branding.image : img"
                    img-top
                    img-height="250"
                    :title="branding.company_name"
                >
                    <b-card-text>
                        <p>
                            <i>Expert(s): {{ branding.expert_name }}</i>
                        </p>
                        <p>
                            <strong
                                >{{ getDate(branding.start_date) }} -
                                {{ getDate(branding.end_date) }}</strong
                            >
                        </p>

                        <h4 class="mt-3 text-primary">Lending</h4>
                        <p>
                            {{ branding.service_description }}
                        </p>
                    </b-card-text>
                </b-card>
            </b-col>
        </b-row>
    </div>
    <!-- END #content -->
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import mixins from "../mixins/global";
export default {
    name: "Branding",
    mixins: [mixins],
    computed: {
        ...mapGetters(["getBrandings", "getBranding"])
    },
    data() {
        return {
            notFound: false,
            loading: false,
            branding: null,
            img: require("../assets/logo.png")
        };
    },
    methods: {
        ...mapActions(["findBranding"]),
        move(to) {
            this.$router.push({ path: to });
        }
    },
    created() {
        const id = this.$route.params.id;
        if (this.getBrandings.length) {
            let item = this.getBrandings.find(b => b.id == id);
            if (item) {
                this.branding = item;
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
                this.branding = val;
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
