<template>
  <div id="header" class="app-header">
    <!-- BEGIN mobile-toggler -->
    <div class="mobile-toggler">
      <button
        type="button"
        class="menu-toggler"
        v-on:click="toggleAppSidebarMobile"
      >
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    </div>
    <!-- END mobile-toggler -->

    <!-- BEGIN brand -->
    <div class="brand">
      <div class="desktop-toggler">
        <button
          type="button"
          class="menu-toggler"
          v-on:click="toggleAppSidebarMinify"
        >
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </div>

      <a href="#">
        <!-- <h3>Dilidue Admin</h3> -->
        <img src="../assets/logo.png" alt="" height="50" />
      </a>
    </div>
    <!-- END brand -->

    <!-- BEGIN menu -->
    <div class="menu">
      <form
        class="menu-search"
        name="header_search_form"
        v-on:submit="checkForm"
      >
        <img src="../assets/logo.png" alt="" height="50" class="mobile-logo" />
        <!-- <div class="menu-search-icon"><i class="fa fa-search"></i></div>
				<div class="menu-search-input">
					<input type="text" class="form-control" placeholder="Search menu..." />
				</div> -->
      </form>
      <!-- <b-dropdown class="menu-item" right  toggle-tag="a" variant="link" :no-caret="true" toggle-class="menu-link" menu-class="dropdown-notification">
				<template v-slot:button-content>
					<div class="menu-icon"><i class="fa fa-bell"></i></div>
					<div class="menu-label">{{ notificationData.length }}</div>
				</template>
				<h6 class="dropdown-header text-gray-900 mb-1">Notifications</h6>
				<template v-if="notificationData && notificationData.length > 0">
					<a href="#" class="dropdown-notification-item" v-for="(notification, index) in notificationData" v-bind:key="index">
						<div class="dropdown-notification-icon">
							<i v-if="notification.icon" v-bind:class="notification.icon"></i>
							<img v-if="notification.image" v-bind:src="notification.image" width="26" />
						</div>
						<div class="dropdown-notification-info">
							<div class="title">{{ notification.title }}</div>
							<div class="time">{{ notification.time }}</div>
						</div>
						<div class="dropdown-notification-arrow">
							<i class="fa fa-chevron-right"></i>
						</div>
					</a>
				</template>
				<template v-else>
					<div class="dropdown-notification-item bg-white">
						No record found
					</div>
				</template>
				<div class="p-2 text-center mb-n1">
					<a href="#" class="text-gray-800 text-decoration-none">See all</a>
				</div>
			</b-dropdown> -->
      <b-dropdown
        class="menu-item"
        right
        toggle-tag="a"
        variant="link"
        :no-caret="true"
        toggle-class="menu-link border-0"
      >
        <template v-slot:button-content>
          <div class="menu-img online">
            <div
              class="d-flex align-items-center justify-content-center w-100 h-100 bg-gray-800 text-gray-300 rounded-circle overflow-hidden"
            >
              <i class="fa fa-user fa-2x mb-n3"></i>
            </div>
          </div>
          <div class="menu-text" v-if="getUser()">{{ getUser().email }}</div>
        </template>
        <!-- <b-dropdown-item link-class="d-flex align-items-center" href="#">
					Edit Profile <i class="fa fa-user-circle fa-fw ml-auto text-gray-400 f-s-16"></i>
				</b-dropdown-item>
				<b-dropdown-item link-class="d-flex align-items-center" href="#">
					Inbox <i class="fa fa-envelope fa-fw ml-auto text-gray-400 f-s-16"></i>
				</b-dropdown-item>
				<b-dropdown-item link-class="d-flex align-items-center" href="#">
					Calendar <i class="fa fa-calendar-alt fa-fw ml-auto text-gray-400 f-s-16"></i>
				</b-dropdown-item>
				<b-dropdown-item link-class="d-flex align-items-center" href="#">
					Setting <i class="fa fa-wrench fa-fw ml-auto text-gray-400 f-s-16"></i>
				</b-dropdown-item> 
				<b-dropdown-divider /> -->
        <b-dropdown-item
          link-class="d-flex align-items-center"
          @click="move('/login')"
        >
          Log Out
          <i class="fa fa-toggle-off fa-fw ml-auto text-gray-400 f-s-16"></i>
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <!-- END menu -->
  </div>
</template>

<script>
import AppOptions from "../config/AppOptions.vue";
import mixins from "../mixins/global";
export default {
  name: "Header",
  mixins: [mixins],
  data() {
    return {
      appOptions: AppOptions,
      notificationData: [],
    };
  },
  methods: {
    toggleAppSidebarMobile() {
      this.appOptions.appSidebarMobileToggled = !this.appOptions
        .appSidebarMobileToggled;
    },
    toggleAppSidebarMinify() {
      this.appOptions.appSidebarMinified = !this.appOptions.appSidebarMinified;
    },
    checkForm: function (e) {
      e.preventDefault();
      this.$router.push({ path: "/extra/search" });
    },
    move(to) {
      this.removeUser();
      this.$router.push({ path: to });
    },
  },
};
</script>

<style scoped>
.mobile-logo {
  display: none;
}

@media screen and (max-width: 767px) {
  .mobile-logo {
    display: block;
  }
}
</style>
