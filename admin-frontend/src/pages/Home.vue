<template>
  <!-- BEGIN #content -->
  <div id="content" class="app-content">
    <h1 class="page-header">Dashboard</h1>

    <b-row>
      <b-col cols="12" md="6" lg="4" xl="3" class="mt-2">
        <b-card @click="move('/news')">
          <b-row>
            <b-col cols="8">
              <h5 class="text-primary"><i class="fa fa-newspaper"></i> News</h5>
            </b-col>
            <b-col cols="4" class="text-right">
              <h3>{{ getNews.length }}</h3>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col cols="12" md="6" lg="4" xl="3" class="mt-2">
        <b-card @click="move('/brandings')">
          <b-row>
            <b-col cols="8">
              <h5 class="text-primary"><i class="fa fa-tag"></i> Brandings</h5>
            </b-col>
            <b-col cols="4" class="text-right">
              <h3>{{ getBrandings.length }}</h3>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col cols="12" md="6" lg="4" xl="3" class="mt-2">
        <b-card @click="move('/users')">
          <b-row>
            <b-col cols="8">
              <h5 class="text-primary"><i class="fa fa-tag"></i> Users</h5>
            </b-col>
            <b-col cols="4" class="text-right">
              <h3>{{ getUsers.length }}</h3>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </div>
  <!-- END #content -->
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters(["getUsers", "getBrandings", "getNews"]),
  },
  methods: {
    ...mapActions(["fetchUsers", "fetchBrandings", "fetchNews"]),
    move(to) {
      this.$router.push({ path: to });
    },
  },

  created() {
    if (!this.getUsers.length) {
      this.fetchUsers();
    }
    if (!this.getNews.length) {
      this.fetchNews();
    }
    if (!this.getBrandings.length) {
      this.fetchBrandings();
    }
  },
};
</script>

<style scoped>
.card:hover {
  cursor: pointer;
}
</style>