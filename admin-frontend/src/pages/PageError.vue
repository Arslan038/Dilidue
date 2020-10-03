<template>
	<!-- BEGIN error -->
	<div class="error-page">
		<!-- BEGIN error-page-content -->
		<div class="error-page-content">
			<div class="error-img">
				<div class="error-img-code">404</div>
				<img src="/assets/img/page/404.svg" alt="" />
			</div>
			
			<h1>Oops!</h1> 
			<h3>We can't seem to find the page you're looking for</h3>
			<p class="text-muted mb-2">
				Here are some helpful links instead:
			</p>
			<p class="mb-4">
				<router-link to="/dashboard">Home</router-link>
				<span class="link-divider"></span>
				<router-link to="/page/search-results">Search</router-link>
				<a href="page_search_results.html"></a>
				<span class="link-divider"></span>
				<router-link to="/email/inbox">Email</router-link>
				<span class="link-divider"></span>
				<router-link to="/calendar">Calendar</router-link>
				<span class="link-divider"></span>
				<router-link to="/settings">Settings</router-link>
				<span class="link-divider"></span>
				<router-link to="/helper">Helper</router-link>
			</p>
			<router-link to="/dashboard" class="btn btn-primary">Go to Homepage</router-link>
		</div>
		<!-- END error-page-content -->
	</div>
	<!-- END error -->
</template>

<script>
	import AppOptions from '../config/AppOptions.vue'

	export default {
		mounted() {
			AppOptions.appWithoutSidebar = true;
			AppOptions.appWithoutHeader = true;
			AppOptions.appContentFullWidth = true;
		},
		beforeRouteLeave (to, from, next) {
			AppOptions.appWithoutSidebar = false;
			AppOptions.appWithoutHeader = false;
			AppOptions.appContentFullWidth = false;
			next();
		},
	}
</script>