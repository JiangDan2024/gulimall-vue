<template>
  <div>
    三级菜单维护
    <el-tree
      :data="menus"
      :props="props"
      :expand-on-click-node="false"
      node-key="catId"
      ref="menuTree"
      @node-click="handleNodeClick"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <span>{{ node.label }}</span>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onBeforeMount,
  onMounted
} from "vue";
import { listWithTree } from "@/api/product/category";
import { ElTree } from "element-plus";
const props = {
  value: "catId",
  label: "name",
  children: "children",
};
const menus = ref<any[]>([]);
//   const menuKeys = ref<number[]>([]);
const menuTree = ref<InstanceType<typeof ElTree>>();
interface CategoryData {
  catId: number | null;
  catLevel?: number;
  name?: string;
  parentCid?: number | null;
  children?: CategoryData[];
  sort?: number;
  showStatus?: number;
  productUnit?: string;
  productCount?: number;
  icon?: string;
}
interface Tree {
  label: string;
  children?: Tree[];
}
const category = ref<CategoryData>({
  catId: null,
  name: "",
  parentCid: 0,
  catLevel: 0,
  showStatus: 1,
  sort: 0,
});
// ================== 生命周期钩子 ==================
onBeforeMount(() => {}); // 组件挂载前
onMounted(() => {
  getList();
}); // 组件挂载完成

function getList() {
  listWithTree().then((res) => {
    menus.value = res.data;
    console.log(res.data);
  });
}
// 1. 使用 defineEmits 定义事件，并接收返回值 emit
const emit = defineEmits<{
  (e: 'nodeChange', data: any): void
}>()
const handleNodeClick = (data: Tree) => {
  // console.log("点击节点：",data);
  if(data.catLevel==3){
    emit("nodeChange",data)
  }
};
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
