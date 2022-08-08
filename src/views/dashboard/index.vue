<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <ImageUpload></ImageUpload>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { mixins } from "@/utils/mixins";
export default {
  name: "Dashboard",
  mixins: [mixins],
  computed: {
    ...mapGetters(["name"]),
  },
  mounted() {
    // this.hellow();
    // console.log("我是自身对象的created");
  },
  created() {
    // console.log("我是自身对象的mounted");
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
