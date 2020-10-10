<template>
  <div class="home">
    <Navbar />
    <div class="map-area">
      <GmapMap
        :center="
          locs.locations.length
            ? locs.locations[0].position
            : { lat: 35.2271, lng: -80.8431 }
        "
        :zoom="10"
        style="width: 100%; height: 92vh"
        :map-type-id="mapType"
        @click="getMapLocation"
        :options="{
          mapTypeControl: false,
          styles: [],
        }"
      >
        <GmapMarker
          :key="index"
          v-for="(m, index) in locs.locations"
          :position="m.position"
          :clickable="true"
          :draggable="false"
          :icon="locs.pin == 0 ? markerOptions : markerOptions1"
          @click="getDetails(m)"
          :title="m.count.toString()"
          :label="{
            text: m.count.toString(),
            color: 'red',
            fontSize: '18px',
            fontWeight: 'bold',
            strokeColor: 'red',
          }"
        >
        </GmapMarker>

        <GmapMarker
          :key="m.position ? m.position.lat : null"
          v-for="m in notes"
          :position="m.position"
          :clickable="true"
          :draggable="false"
          @click="getNoteDetails(m)"
          :icon="markerOptions2"
        />
      </GmapMap>
    </div>

    <div class="search-area">
      <v-card>
        <v-tabs
          optional
          v-model="tab"
          class="range-tabs"
          background-color="grey lighten-5"
          color="black"
          hide-slider
          grow
        >
          <v-tab>Timeline</v-tab>
          <v-tab>Custom Range</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-row class="mx-3">
              <v-col cols="12">
                <v-slider
                  v-model="value"
                  @change="checkRange"
                  :tick-labels="ticksLabels"
                  :max="6"
                  class="my-3"
                  step="1"
                  ticks="always"
                  tick-size="6"
                ></v-slider>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item>
            <v-row class="mx-3">
              <v-col cols="12">
                <v-text-field
                  label="Start Date"
                  dense
                  type="date"
                  v-model="filter_start_date"
                ></v-text-field>
                <v-text-field
                  label="End Date"
                  v-model="filter_end_date"
                  dense
                  type="date"
                ></v-text-field>
                <v-btn
                  block
                  depressed
                  color="primary"
                  @click="searchByCustomRange"
                  >Search</v-btn
                >
              </v-col>
              <v-col cols="12"></v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </div>

    <div class="list-area">
      <v-card>
        <v-list nav>
          <v-list-item-group @change="setEdit">
            <v-list-item>
              <v-img src="../assets/news.png" width="35"></v-img>
            </v-list-item>
            <v-list-item>
              <v-img src="../assets/brandings.png" width="30"></v-img>
            </v-list-item>
            <v-list-item>
              <v-img src="../assets/note.png" width="30"></v-img>
            </v-list-item>
            <v-list-item @click="setMapType">
              <v-img src="../assets/layers.png" width="30"></v-img>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </div>

    <v-dialog
      v-model="newsModal"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card v-if="newsDetails">
        <v-container>
          <v-row>
            <v-col cols="10">
              <h3>News Found at {{ newsDetails.data[0].location }}</h3>
            </v-col>
            <v-col cols="2" class="text-right">
              <v-btn @click="newsModal = !newsModal" fab dark small
                ><v-icon>mdi-close</v-icon></v-btn
              >
            </v-col>
            <v-col cols="12">
              <v-expansion-panels focusable v-model="newsPanel">
                <v-expansion-panel
                  v-for="(item, i) in newsDetails.data"
                  :key="i"
                >
                  <v-expansion-panel-header v-on:click="fetchHTML(item)">
                    <v-row>
                      <v-col cols="8">
                        <h4 class="pb-2">Headline</h4>
                        <span>{{ item.title }}</span>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row>
                      <v-col cols="12"></v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="6">
                        <h4 class="pb-2">Contributor</h4>
                        <span>{{ item.contributor }}</span>
                      </v-col>
                      <v-col cols="12" md="6" class="text-md-right">
                        <!-- <div class="d-flex"> -->
                        <v-btn
                          color="primary"
                          class="mr-2"
                          small
                          depressed
                          @click="likeNews(item, true)"
                          ><v-icon class="pr-2">mdi-thumb-up-outline</v-icon>
                          Likes {{ countLikes(item) }}</v-btn
                        >
                        <v-btn
                          color="red"
                          small
                          dark
                          depressed
                          @click="likeNews(item, false)"
                          ><v-icon class="pr-2">mdi-thumb-down-outline</v-icon>
                          DisLikes {{ countDisLikes(item) }}</v-btn
                        >
                        <!-- </div> -->
                      </v-col>
                      <v-col cols="12" class="text-center" v-if="urlLoading">
                        <v-progress-circular
                          indeterminate
                          color="primary"
                        ></v-progress-circular>
                      </v-col>
                      <v-col cols="12" v-if="!urlLoading">
                        <div v-html="html_content"></div>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" max-width="500px" :scrollable="false">
      <v-card class="py-3">
        <v-card-text>
          <h2 class="mb-3">Add Note</h2>
          <p>
            <strong>Note Location:</strong>
            {{ note.location }}
          </p>
          <v-textarea
            label="Note"
            outlined
            v-model="note.note"
            placeholder="Enter Note..."
          ></v-textarea>

          <v-btn
            depressed
            block
            color="primary"
            :disabled="createNoteLoading"
            @click="addNote"
            >{{ createNoteLoading ? 'Please wait...' : 'Submit' }}</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="detailsModal" max-width="500px" scrollable>
      <v-card v-if="brandingDetails">
        <v-card-title>
          Brandings Found at {{ brandingDetails.data[0].location }}
        </v-card-title>
        <v-expansion-panels focusable v-model="panel">
          <v-expansion-panel v-for="(item, i) in brandingDetails.data" :key="i">
            <v-expansion-panel-header>
              {{ item.company_name }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-img
                height="250px"
                :src="item.image ? item.image : img"
                :lazy-src="item.image ? item.image : img"
              ></v-img>
              <h3>{{ item.company_name }}</h3>
              <p>
                <i>Expert(s): {{ item.expert_name }}</i>
              </p>
              <h4>
                {{ getDate(item.start_date) }} -
                {{ getDate(item.end_date) }}
              </h4>
              <h3 class="primary--text pt-2">
                {{ item.service_title }}
              </h3>
              <p>{{ item.service_description }}</p>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editNoteModal" max-width="500px" scrollable>
      <v-card class="py-3" v-if="noteDetails">
        <v-card-text>
          <h2 class="mb-3">Edit Note</h2>
          <p>
            <strong>Note Location:</strong>
            {{ noteDetails.location }}
          </p>
          <v-textarea
            label="Edit Note"
            outlined
            v-model="noteDetails.note"
            placeholder="Enter Note..."
          ></v-textarea>

          <v-btn
            depressed
            block
            color="primary"
            :disabled="editNoteLoading"
            @click="editNote"
            >{{ editNoteLoading ? 'Please wait...' : 'Edit' }}</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { gmapApi } from 'vue2-google-maps';
import Navbar from '@/components/Navbar.vue';
import { mapActions, mapGetters } from 'vuex';
import mixin from '../mixins/global';
import { RepositoryFactory } from '../Repository/RepositoryFactory';
const NewsRepository = RepositoryFactory.get('news_repository');
import moment from 'moment';
// @ is an alias to /src

export default {
  name: 'Home',
  mixins: [mixin],
  metaInfo() {
    return {
      title: 'Home',
    };
  },
  components: {
    Navbar,
  },
  computed: {
    ...mapGetters(['getNews', 'getBrandings', 'getNotes']),
    google: gmapApi,
  },
  methods: {
    ...mapActions([
      'fetchNews',
      'fetchBrandings',
      'fetchNotes',
      'createNote',
      'updateNote',
      'createLike',
      'updateLike',
    ]),
    likeNews(news, action) {
      const payload = {
        action: action,
        userId: this.getUser().id,
        newsId: news.id,
      };
      let userLike = news.news_likes.find(
        (l) => l.userId == this.getUser().id && l.newsId == news.id
      );
      if (userLike) {
        if (userLike.action !== action) {
          // Update Like
          this.updateLike(payload);
        }
      } else {
        // Create News Like
        this.createLike(payload);
      }
    },
    countLikes(item) {
      let likes = item.news_likes.filter((l) => l.action);
      if (likes) {
        return likes.length;
      }
    },
    countDisLikes(item) {
      let likes = item.news_likes.filter((l) => !l.action);
      if (likes) {
        return likes.length;
      }
    },
    checkRange(e) {
      if (e == 0) {
        this.filterNow(3);
      }
      if (e == 1) {
        this.filterNow(6);
      }
      if (e == 2) {
        this.filterNow(12);
      }
      if (e == 3) {
        this.filterNow(36);
      }
      if (e == 4) {
        this.filterNow(60);
      }
      if (e == 5) {
        this.filterNow(120);
      }
      if (e == 6) {
        if (this.locs.pin == 0) {
          this.setAllNews(this.getNews, true);
        }
        if (this.locs.pin == 1) {
          this.setAllBrandings(this.getBrandings, true);
        }
      }
    },
    filterNow(value) {
      if (this.locs.pin == 0) {
        this.filterNews(value);
      }
      if (this.locs.pin == 1) {
        this.filterBrandings(value);
      }
    },
    filterBrandings(range) {
      if (this.getBrandings && this.getBrandings.length) {
        this.brandings = [];
        let val = this.getBrandings;
        val.forEach((item) => {
          let createdDate = moment(item.createdAt);
          let currentDate = new Date().toISOString();
          let today = moment(currentDate);

          const duration = moment.duration(today.diff(createdDate));
          const months = duration.asMonths();

          if (months <= range) {
            let itemData = item;
            let position = {
              lat: item.position.lat,
              lng: item.position.lng,
            };
            itemData.position = position;

            let brandingToSave = {
              count: 1,
              position: position,
              data: [],
              type: 'brandings',
            };

            let findBranding = this.brandings.find(
              (n) =>
                n.position.lat == position.lat && n.position.lng == position.lng
            );
            if (findBranding) {
              findBranding.count++;
              findBranding.data.push(itemData);
            } else {
              brandingToSave.data.push(itemData);
              this.brandings.push(brandingToSave);
            }
          }
        });
        this.locs.locations = this.brandings;
      } else {
        this.$store.commit('setToast', {
          message: 'No Branding Found',
          show: true,
        });
      }
    },
    filterNews(range) {
      if (this.getNews && this.getNews.length) {
        this.news = [];
        let val = this.getNews;
        val.forEach((item) => {
          let createdDate = moment(item.createdAt);
          let currentDate = new Date().toISOString();
          let today = moment(currentDate);

          const duration = moment.duration(today.diff(createdDate));
          const months = duration.asMonths();
          if (months <= range) {
            let itemData = item;
            let position = {
              lat: item.position.lat,
              lng: item.position.lng,
            };
            itemData.position = position;

            let newsoSave = {
              count: 1,
              position: position,
              data: [],
              type: 'news',
            };

            let findNews = this.brandings.find(
              (n) =>
                n.position.lat == position.lat && n.position.lng == position.lng
            );
            if (findNews) {
              findNews.count++;
              findNews.data.push(itemData);
            } else {
              newsoSave.data.push(itemData);
              this.news.push(newsoSave);
            }
          }
        });
        this.locs.locations = this.news;
      } else {
        this.$store.commit('setToast', {
          message: 'No Branding Found',
          show: true,
        });
      }
    },
    setMapType() {
      let map = this.mapType;
      this.mapType = null;

      if (map == 'roadmap') {
        this.mapType = 'hybrid';
      }
      if (map == 'hybrid') {
        this.mapType = 'roadmap';
      }
    },
    setEdit(e) {
      if (e == 0) {
        this.locs.pin = 0;
        this.locs.locations = this.news;
        this.edit = false;
      }
      if (e == 1) {
        this.locs.pin = 1;
        this.locs.locations = this.brandings;

        this.edit = false;
      }
      if (e == 2) {
        this.edit = true;
      } else {
        this.edit = false;
      }
    },
    getMapLocation(event) {
      if (this.edit) {
        let latlng = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        this.dialog = true;
        var geocoder = new this.google.maps.Geocoder();
        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status == 'OK') {
            this.note.lat = results[0].geometry.location.lat();
            this.note.lng = results[0].geometry.location.lng();
            this.note.location = results[0].formatted_address;
          }
        });
      }
    },

    getDetails(m) {
      if (m.type == 'brandings') {
        this.brandingDetails = m;
        this.detailsModal = true;
      }
      if (m.type == 'news') {
        this.newsDetails = m;
        console.log(m);
        this.newsModal = true;
      }
    },

    getNoteDetails(m) {
      this.noteDetails = m;
      this.editNoteModal = true;
    },
    async fetchHTML(item) {
      try {
        this.urlLoading = true;
        const payload = {
          url: item.url,
        };
        this.html_content = null;
        let resp = await NewsRepository.fetchURL(payload);
        if (resp) {
          this.urlLoading = false;
          this.html_content = resp.data;
        }
      } catch (err) {
        this.urlLoading = false;
        this.$store.commit('setToast', {
          message: err.message,
          color: 'red',
          show: true,
        });
      }
    },

    async addNote() {
      this.note.user_id = this.getUser().id;
      if (this.note.note.length < 6) {
        this.$store.commit('setToast', {
          message: 'Please Enter Valid Note',
          color: 'warning',
          show: true,
        });
        return;
      }
      this.createNoteLoading = true;
      let resp = await this.createNote(this.note);
      if (resp == 1) {
        this.dialog = false;
        this.note.note = null;
      }
      this.createNoteLoading = false;
    },

    async editNote() {
      if (this.noteDetails.note.length < 6) {
        this.$store.commit('setToast', {
          message: 'Please Enter Valid Note',
          color: 'warning',
          show: true,
        });
        return;
      }
      this.editNoteLoading = true;
      const payload = {
        id: this.noteDetails.id,
        data: {
          note: this.noteDetails.note,
        },
      };
      let resp = await this.updateNote(payload);
      if (resp == 1) {
        this.editNoteModal = false;
      }
      this.editNoteLoading = false;
    },
    setAllBrandings(val, filter) {
      val.forEach((item) => {
        let itemData = item;
        let position = {
          lat: null,
          lng: null,
        };
        if (filter) {
          position.lat = item.position.lat;
          position.lng = item.position.lng;
        } else {
          position.lat = item.position.coordinates[0];
          position.lng = item.position.coordinates[1];
        }
        itemData.position = position;

        let brandingToSave = {
          count: 1,
          position: position,
          data: [],
          type: 'brandings',
        };

        let findBranding = this.brandings.find(
          (n) =>
            n.position.lat == position.lat && n.position.lng == position.lng
        );
        if (findBranding) {
          findBranding.count++;
          findBranding.data.push(itemData);
        } else {
          brandingToSave.data.push(itemData);
          this.brandings.push(brandingToSave);
        }
      });
      if (filter) {
        this.locs.locations = this.brandings;
      }
    },

    searchByCustomRange() {
      if (this.locs.pin == 0) {
        this.searchNewInRange();
      }
      if (this.locs.pin == 1) {
        this.searchBrandingsInRange();
      }
    },

    searchNewInRange() {
      if (!this.filter_start_date || !this.filter_end_date) {
        this.$store.commit('setToast', {
          message: 'Please Pick Start and End Date',
          color: 'warning',
          show: true,
        });
      } else {
        if (this.getNews && this.getNews.length) {
          let val = this.getNews;
          this.news = [];
          val.forEach((item) => {
            let filter_start = moment(this.filter_start_date);
            let filter_end = moment(this.filter_end_date);

            let createdDate = moment(item.createdAt);

            // Start Date // End Date // CreatedDate

            // Filter All News where CreatedAt >= StartDate and <= EndDate

            if (createdDate >= filter_start && createdDate <= filter_end) {
              let itemData = item;
              let position = {
                lat: null,
                lng: null,
              };
              position.lat = item.position.lat;
              position.lng = item.position.lng;

              itemData.position = position;

              let newsToSave = {
                count: 1,
                position: position,
                data: [],
                type: 'news',
              };

              let findNews = this.news.find(
                (n) =>
                  n.position.lat == position.lat &&
                  n.position.lng == position.lng
              );
              if (findNews) {
                findNews.count++;
                findNews.data.push(itemData);
              } else {
                newsToSave.data.push(itemData);
                this.news.push(newsToSave);
              }
            }
          });
          this.locs.locations = this.news;
        }
      }
    },

    searchBrandingsInRange() {
      if (!this.filter_start_date || !this.filter_end_date) {
        this.$store.commit('setToast', {
          message: 'Please Pick Start and End Date',
          color: 'warning',
          show: true,
        });
      } else {
        if (this.getBrandings && this.getBrandings.length) {
          let val = this.getBrandings;
          this.brandings = [];
          val.forEach((item) => {
            let filter_start = moment(this.filter_start_date);
            let filter_end = moment(this.filter_end_date);

            let createdDate = moment(item.createdAt);

            // Start Date // End Date // CreatedDate

            // Filter All Brandings where CreatedAt >= StartDate and <= EndDate

            if (createdDate >= filter_start && createdDate <= filter_end) {
              let itemData = item;
              let position = {
                lat: null,
                lng: null,
              };
              position.lat = item.position.lat;
              position.lng = item.position.lng;

              itemData.position = position;

              let brandingToSave = {
                count: 1,
                position: position,
                data: [],
                type: 'brandings',
              };

              let findBranding = this.brandings.find(
                (n) =>
                  n.position.lat == position.lat &&
                  n.position.lng == position.lng
              );
              if (findBranding) {
                findBranding.count++;
                findBranding.data.push(itemData);
              } else {
                brandingToSave.data.push(itemData);
                this.brandings.push(brandingToSave);
              }
            }
          });
          this.locs.locations = this.brandings;
        }
      }
    },

    setAllNews(val, filter) {
      val.forEach((item) => {
        let itemData = item;
        let position = {
          lat: null,
          lng: null,
        };
        if (filter) {
          position.lat = item.position.lat;
          position.lng = item.position.lng;
        } else {
          position.lat = item.position.coordinates[0];
          position.lng = item.position.coordinates[1];
        }
        itemData.position = position;

        let newsToSave = {
          count: 1,
          position: position,
          data: [],
          type: 'news',
        };

        let findNews = this.news.find(
          (n) =>
            n.position.lat == position.lat && n.position.lng == position.lng
        );
        if (findNews) {
          findNews.count++;
          findNews.data.push(itemData);
        } else {
          newsToSave.data.push(itemData);
          this.news.push(newsToSave);
        }
      });
      this.locs.locations = this.news;
    },
  },
  async created() {
    if (this.getUser()) {
      this.locs.locations = this.news;
      await this.fetchNews();
      await this.fetchNotes(this.getUser().id);
      await this.fetchBrandings();
    }
  },
  watch: {
    getNews(val) {
      if (val && val.length) {
        this.setAllNews(val, false);
      }
    },

    getBrandings(val) {
      if (val && val.length) {
        this.setAllBrandings(val, false);
      }
    },
    getNotes(val) {
      if (val) {
        this.notes = val;
      }
    },
  },
  data() {
    return {
      panel: [0],
      newsPanel: true,
      html_content: null,
      mapType: 'roadmap',
      detailsModal: false,
      brandingDetails: null,
      newsDetails: null,
      newsModal: false,
      editNoteModal: false,
      details: null,
      createNoteLoading: false,
      editNoteLoading: false,
      urlLoading: false,
      filter_start_date: null,
      filter_end_date: null,
      note: {
        location: null,
        lat: null,
        lng: null,
        note: null,
        user_id: null,
      },
      noteDetails: null,
      img: require('../assets/logo.png'),
      dialog: false,
      edit: false,
      markerOptions: {
        url: require('../assets/news-pin.svg'),
        size: { width: 50, height: 50, f: 'px', b: 'px' },
        scaledSize: { width: 50, height: 50, f: 'px', b: 'px' },
        labelOrigin: { x: 35, y: 5 },
        strokeColor: 'red',
        strokeWeight: 4,
      },
      markerOptions1: {
        url: require('../assets/branding-pin.svg'),
        size: { width: 50, height: 50, f: 'px', b: 'px' },
        scaledSize: { width: 50, height: 50, f: 'px', b: 'px' },
        labelOrigin: { x: 35, y: 5 },
      },
      markerOptions2: {
        url: require('../assets/notes-pin.svg'),
        size: { width: 50, height: 50, f: 'px', b: 'px' },
        scaledSize: { width: 50, height: 50, f: 'px', b: 'px' },
      },
      brandings: [],
      news: [],
      notes: [],
      value: null,
      tab: null,
      ticksLabels: ['3 mos', '6 mos', '1 yr', '3 yr', '5 yr', '10 yr', 'All'],
      locs: {
        pin: 0,
        locations: [],
      },
    };
  },
};
</script>

<style scoped>
.map-area {
  position: relative;
}
.list-area {
  position: absolute;
  top: 40%;
  left: 10px;
}
.search-area {
  position: absolute;
  top: 1%;
  left: 10px;
  width: 400px;
}
.counter {
  width: 100px;
  height: 100px;
  background: #000;
  color: #fff;
}
</style>
