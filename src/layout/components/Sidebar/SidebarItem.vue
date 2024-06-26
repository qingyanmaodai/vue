<template>
  <div v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link
        v-if="onlyOneChild.meta"
        :to="resolvePath(onlyOneChild.path)"
        :dicID="onlyOneChild.meta.dicID"
        :target="onlyOneChild.meta.IsOpenWindow ? '_blank' : ''"
        :tag="onlyOneChild.meta.IsOpenWindow ? 'a' : 'span'"
      >
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
          <span
            class="dot"
            :style="{
              background:
                item.meta && item.meta.hasOwnProperty('index')
                  ? item.meta.index == -1
                    ? ''
                    : item.meta.index % 2 == 0 && item.meta.index / 2 == 1
                    ? '#ce08ff'
                    : item.meta.index % 2 == 1
                    ? '#14eae1'
                    : item.meta.index % 5 == 0
                    ? '#f37e05'
                    : ''
                  : '#0960bd',
            }"
          ></span>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
        />
        <span
          class="dot"
          :style="{
            background:
              item.meta && item.meta.hasOwnProperty('index')
                ? item.meta.index == -1
                  ? ''
                  : item.meta.index % 2 == 0 && item.meta.index / 2 == 1
                  ? '#ce08ff'
                  : item.meta.index % 2 == 1
                  ? '#14eae1'
                  : item.meta.index % 5 == 0
                  ? '#f37e05'
                  : ''
                : '#0960bd',
          }"
        ></span>
      </template>
      <sidebar-item
        v-for="(child, i) in item.children"
        :key="i"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null;
    return {};
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item;
          return true;
        }
      });

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true;
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }

      return false;
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    },
  },
};
</script>
