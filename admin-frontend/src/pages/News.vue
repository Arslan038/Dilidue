<template>
  <!-- BEGIN #content -->
  <div id="content" class="app-content">
    <b-row>
      <b-col cols="6">
        <h1 class="page-header">News</h1>
      </b-col>
      <b-col cols="6" class="text-right">
        <b-button variant="primary" @click="move('/add-news')"
          ><i class="fa fa-newspaper"></i> Add News</b-button
        >
      </b-col>
    </b-row>

    <!-- Search Area -->

    <b-card>
      <b-row>
        <b-col cols="12" md="3" lg="3">
          <label for="">Filter By Title</label>
          <b-form-input
            placeholder="Enter Title"
            @input="filterByTitle"
          ></b-form-input>
        </b-col>
        <b-col cols="12" md="3" lg="3">
          <label for="">Filter By Location</label>
          <b-form-input
            placeholder="Enter Location"
            @input="filterByLocation"
          ></b-form-input>
        </b-col>
        <b-col cols="12" md="3" lg="3">
          <label for="">Filter By Contributor</label>
          <b-form-input
            placeholder="Enter Contributor"
            @input="filterByContributor"
          ></b-form-input>
        </b-col>
        <b-col cols="12" md="3" lg="3">
          <label for="">Filter By Status</label>
          <b-form-select @change="filterByStatus">
            <b-form-select-option value="all">All</b-form-select-option>
            <b-form-select-option value="active">Active</b-form-select-option>
            <b-form-select-option value="inactive"
              >Inactive</b-form-select-option
            >
          </b-form-select>
        </b-col>
      </b-row>
    </b-card>

    <!-- All News -->

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
        v-for="(news, index) in newsItems"
        :key="index"
      >
        <b-card
          :img-src="news.image ? news.image : img"
          img-top
          img-height="200"
          :img-alt="news.title"
          :title="news.title"
        >
          <b-card-text class="mb-2">
            <a :href="news.url" target="_blank">{{ news.url }}</a>
            <h6 class="pt-2">Contributor: {{ news.contributor }}</h6>
          </b-card-text>
          <p>
            <i class="fa fa-map-marker"></i>
            <strong class="pl-2">{{ news.location.substr(0, 20) }}...</strong>
          </p>
          <p class="pt-1">
            <i class="fa fa-clock"></i>
            {{ getDate(news.createdAt) }}
          </p>

          <b-row>
            <b-col cols="4" class="mt-2"> </b-col>
            <b-col cols="7" class="text-right mt-2">
              <b-form-checkbox
                switch
                v-model="news.status"
                :disabled="updateLoading"
                @change="updateStatus($event, news)"
              ></b-form-checkbox>
            </b-col>
            <b-col cols="1" class="mt-2">
              <p class="popover" :id="'popover' + news.id">
                <i class="fa fa-ellipsis-v"></i>
              </p>
              <b-popover
                :target="'popover' + news.id"
                placement="bottom"
                triggers="hover focus"
              >
                <p @click="move('/edit-news/' + news.id)" class="my-2">
                  <i class="fa fa-edit"></i> Edit
                </p>
                <p @click="remove(news)"><i class="fa fa-trash"></i> Delete</p>
              </b-popover>
            </b-col>
            <b-col cols="12" class="mt-3">
              <b-button variant="primary" block @click="view(news)"
                ><i class="fa fa-eye"></i> View Details</b-button
              >
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

    <!-- View Modal -->

    <b-modal
      title="News Details"
      v-model="viewModal"
      :hide-footer="true"
      scrollable
    >
      <div v-if="news">
        <b-row>
          <b-col cols="10">
            <b-card
              :img-src="news.image != null ? news.image : img"
              img-top
              img-height="200"
              :title="news.title"
            >
              <b-card-text>
                <a :href="news.url" target="_blank">{{ news.url }}</a>
                <h6 class="pt-2">Contributor: {{ news.contributor }}</h6>
                <p>
                  <i class="fa fa-map-marker"></i>
                  <strong class="pl-2">{{ news.location }}</strong>
                </p>
                <p>
                  <i class="fa fa-clock"></i>
                  {{ getDate(news.createdAt) }}
                </p>
              </b-card-text>
            </b-card>
          </b-col>
        </b-row>
      </div>
    </b-modal>

    <!-- Delete Modal -->

    <b-modal title="Delete News" :hide-footer="true" v-model="deleteModal">
      <b-row v-if="newsToDelete">
        <b-col cols="12" class="text-center mb-3">
          <h5>
            Are you sure you want to delete
            {{ newsToDelete.title }} ?
          </h5>
        </b-col>
        <b-col cols="6">
          <b-button
            block
            variant="primary"
            :disabled="deleteLoading"
            @click="removeNews"
            >{{
              deleteLoading ? "Please wait..." : "Yes, Delete News"
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
export default {
  name: "News",
  mixins: [mixins],
  data() {
    return {
      img: require("../assets/logo.png"),
      news: null,
      viewModal: false,
      deleteModal: false,
      currentPage: 1,
      perPage: 8,
      newsList: [],
      loading: null,
      newsToDelete: null,
      deleteLoading: false,
      updateLoading: false,
    };
  },
  computed: {
    ...mapGetters(["getNews"]),
    rows() {
      return this.newsList.length;
    },
    newsItems() {
      const items = this.newsList;
      if (items) {
        return items.slice(
          (this.currentPage - 1) * this.perPage,
          this.currentPage * this.perPage
        );
      }
      return null;
    },
  },
  watch: {
    getNews(val) {
      if (val) {
        this.loading = false;
        this.newsList = val;
      }
    },
  },
  created() {
    if (this.getNews.length) {
      this.newsList = this.getNews;
    } else {
      this.loading = true;
      this.fetchNews();
    }
  },
  methods: {
    ...mapActions(["fetchNews", "deleteNews", "updateNews"]),
    filterByTitle(value) {
      if (value) {
        let news = this.getNews;
        this.newsList = news.filter(
          (item) => item.title.toLowerCase().indexOf(value.toLowerCase()) > -1
        );
      } else {
        this.newsList = this.getNews;
      }
    },
    filterByLocation(value) {
      if (value) {
        let news = this.getNews;
        this.newsList = news.filter(
          (item) =>
            item.location.toLowerCase().indexOf(value.toLowerCase()) > -1
        );
      } else {
        this.newsList = this.getNews;
      }
    },
    filterByContributor(value) {
      if (value) {
        let news = this.getNews;
        this.newsList = news.filter(
          (item) =>
            item.contributor.toLowerCase().indexOf(value.toLowerCase()) > -1
        );
      } else {
        this.newsList = this.getNews;
      }
    },
    filterByStatus(value) {
      if (value) {
        let news = this.getNews;
        if (value == "all") {
          this.newsList = this.getNews;
        }
        if (value == "active") {
          let items = [];
          news.filter((item) => {
            if (item.status) {
              items.push(item);
            }
          });
          this.newsList = items;
        }
        if (value == "inactive") {
          let items = [];
          news.filter((item) => {
            if (!item.status) {
              items.push(item);
            }
          });
          this.newsList = items;
        }
      } else {
        this.newsList = this.getNews;
      }
    },
    remove(news) {
      this.newsToDelete = news;
      this.deleteModal = true;
    },
    async updateStatus(e, news) {
      delete news.position;
      news.status = e;
      var form_data = new FormData();
      for (var key in news) {
        form_data.append(key, news[key]);
      }
      this.updateLoading = true;
      await this.updateNews(form_data);
      this.updateLoading = false;
    },
    view(record) {
      this.news = record;
      this.viewModal = true;
    },
    move(to) {
      this.$router.push({ path: to });
    },
    async removeNews() {
      this.deleteLoading = true;
      let resp = await this.deleteNews(this.newsToDelete.id);
      if (resp == 1) {
        this.deleteModal = false;
      }
      this.deleteLoading = false;
    },
  },
};
</script>

<style scoped>
p {
  margin: 0;
}
.popover {
  border: none !important;
}
.popover:hover {
  cursor: pointer;
}
</style>
