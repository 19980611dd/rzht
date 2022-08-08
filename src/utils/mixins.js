import store from "@/store";
export const mixins = {
  // created() {
  //   console.log("混入对象的created");
  // },
  // mounted() {
  //   console.log("我是混入对象的mounted");
  // },
  // methods: {
  //   hellow() {
  //     console.log("hello");
  //   },
  // },
  methods: {
    checkPermission(key) {
      // console.log(store.state.user.userInfo.roles.points);
      return !store.state.user.userInfo.roles.points.includes(key);
    },
  },
};
