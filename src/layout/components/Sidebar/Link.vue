<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from "@/utils/validate";

export default {
  props: {
    to: {
      type: String,
      required: true,
    },
    dicID: {
      type: [String, Number],
      required: false,
    },
  },
  mounted() {},
  computed: {
    isExternal() {
      return isExternal(this.to);
    },
    type() {
      if (this.isExternal) {
        return "a";
      }
      return "router-link";
    },
  },
  methods: {
    linkProps(to) {
      if (this.isExternal) {
        return {
          href: to,
          target: "_blank",
          rel: "noopener",
        };
      } else if (this.dicID) {
        return {
          to: to + "?dicID=" + this.dicID,
        };
      } else {
        return {
          to: to,
        };
      }
    },
  },
};
</script>
