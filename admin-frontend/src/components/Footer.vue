<template>
	<!-- BEGIN #footer -->
	<div id="footer" class="app-footer">
		&copy; 2020 seanTheme All Right Reserved
	</div>
	<!-- END #footer -->
</template>

<script>
import AppOptions from '../config/AppOptions.vue'

export default {
  name: 'Footer',
  data() {
		return {
			appOptions: AppOptions
		}
  }
}
</script>
