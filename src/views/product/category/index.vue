<template>
  <div>
    三级菜单维护
    <el-switch
      v-model="draggable"
      size="large"
      active-text="开启拖拽"
      inactive-text="关闭拖拽"
    />
    <el-button v-if="draggable" type="primary" @click="batchSave"
      >批量保存</el-button
    >
    <el-button type="danger" @click="batchDel">批量删除</el-button>
    <el-tree
      :data="menus"
      :props="props"
      :expand-on-click-node="false"
      node-key="catId"
      show-checkbox
      :draggable="draggable"
      :allow-drop="allowDrop"
      @node-drop="handleDrop"
      :default-expanded-keys="menuKeys"
      ref="menuTree"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <span>{{ node.label }}</span>
          <div>
            <el-button
              v-if="data.catLevel <= 2"
              type="primary"
              link
              @click="append(data)"
            >
              Append
            </el-button>
            <el-button type="primary" link @click="edit(data)">
              Edit
            </el-button>
            <el-button
              style="margin-left: 4px"
              type="danger"
              link
              v-if="node.childNodes.length == 0"
              @click="remove(node, data)"
            >
              Delete
            </el-button>
          </div>
        </div>
      </template>
    </el-tree>
    <el-dialog v-model="addDialogVisible" :title="dialogTitle" width="500">
      <el-form :model="category">
        <el-form-item label="分类名称">
          <el-input v-model="category.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="category.icon" autocomplete="off" />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="category.productUnit" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitNewMenu"> 提交 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
} from "vue";
import {
  listWithTree,
  delMenu,
  addMenu,
  editMenu,
  getByID,
  batchEditMenu,
} from "@/api/product/category";
import { ElMessage, ElMessageBox, FormInstance, ElTree } from "element-plus";
import type {
  AllowDropType,
  NodeDropType,
  RenderContentContext,
} from "element-plus";
const props = {
  value: "catId",
  label: "name",
  children: "children",
};
const menus = ref<any[]>([]);
const menuKeys = ref<number[]>([]);
const addDialogVisible = ref(false);
//判断新增、编辑操作
const operaType = ref<string>("");
//对话框的标题
const dialogTitle = ref<string>("");
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
const category = ref<CategoryData>({
  catId: null,
  name: "",
  parentCid: 0,
  catLevel: 0,
  showStatus: 1,
  sort: 0,
});
type Node = RenderContentContext["node"];
let maxLevel = ref<number>(0);
let updateNodes = ref<CategoryData[]>([]);
let draggable = ref<boolean>(false);
let pCids = ref<number[]>([]);
// ================== 生命周期钩子 ==================
onBeforeMount(() => {}); // 组件挂载前
onMounted(() => {
  getList();
}); // 组件挂载完成
onBeforeUpdate(() => {}); // 组件更新前
onUpdated(() => {}); // 组件更新完成
onBeforeUnmount(() => {}); // 组件卸载前
onUnmounted(() => {}); // 组件卸载完成
onActivated(() => {}); // 被 keep-alive 缓存的组件激活时
onDeactivated(() => {}); // 被 keep-alive 缓存的组件停用时

function getList() {
  listWithTree().then((res) => {
    menus.value = res.data;
    console.log(res.data);
  });
}
function submitNewMenu() {
  if (operaType.value == "add") {
    saveMenu();
  } else if (operaType.value == "edit") {
    updateMenu();
  }
}
function saveMenu() {
  console.log("要提交的数据", category);
  addMenu(category.value).then(() => {
    ElMessage({
      message: "新增成功！",
      type: "success",
    });
    addDialogVisible.value = false;
    getList();
    if (category.value.parentCid != null) {
      menuKeys.value = [category.value.parentCid];
    }
    reset();
  });
}
function updateMenu() {
  var { name, catId, icon, productUnit } = category.value;
  editMenu({ name, catId, icon, productUnit }).then(() => {
    ElMessage({
      message: "编辑成功！",
      type: "success",
    });
    addDialogVisible.value = false;
    getList();
    if (category.value.parentCid != null) {
      menuKeys.value = [category.value.parentCid];
    }
    reset();
  });
}
function reset() {
  category.value.catId = null;
  category.value.name = "";
  category.value.parentCid = 0;
  category.value.catLevel = 0;
  category.value.showStatus = 1;
  category.value.sort = 0;
  category.value.icon = "";
  category.value.productUnit = "";
}
const append = (data: CategoryData) => {
  console.log("append", data);
  addDialogVisible.value = true;
  category.value.parentCid = data.catId;
  category.value.catLevel = (data.catLevel ?? 0) * 1 + 1;
  operaType.value = "add";
  dialogTitle.value = "新增";
};
const edit = (data: CategoryData) => {
  console.log("edit", data);
  addDialogVisible.value = true;
  //发送请求获取最新数据
  getByID(data.catId).then((res) => {
    category.value.name = res.data.name;
    category.value.catId = res.data.catId;
    category.value.icon = res.data.icon;
    category.value.productUnit = res.data.productUnit;
    operaType.value = "edit";
    dialogTitle.value = "编辑";
  });
};
const remove = (node: Node, data: CategoryData) => {
  console.log("remove", node, data);
  const ids = [data.catId];
  ElMessageBox.confirm(`确认要删除${data.name}吗？`, "提示", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  }).then(() => {
    delMenu(ids)
      .then(() => {
        ElMessage({
          message: "删除成功！",
          type: "success",
        });
        getList();
        if (data.parentCid != null) {
          menuKeys.value = [data.parentCid];
        }
      })
      .catch(() => {});
  });
};
const allowDrop = (draggingNode: Node, dropNode: Node, type: AllowDropType) => {
  // if (dropNode.data.label === "Level two 3-1") {
  //   return type !== "inner";
  // } else {
  //   return true;
  // }
  console.log(
    "draggingNode：",
    draggingNode,
    "dropNode:",
    dropNode,
    "type",
    type
  );
  //计算当前拖拽节点的最大层级
  countNodeLevel(draggingNode);
  let deep;
  if (maxLevel.value > 0) {
    deep = Math.abs(maxLevel.value - draggingNode.data.catLevel) + 1;
  } else {
    deep = 1;
  }
  console.log("deep", deep, "maxlevel", maxLevel.value);
  if (type == "inner") {
    return deep + dropNode.level <= 3;
  } else {
    return deep + (dropNode.parent?.level ?? 0) <= 3;
  }
};
function countNodeLevel(node: Node) {
  if (node.childNodes != null && node.childNodes.length > 0) {
    for (var i = 0; i < node.childNodes.length; i++) {
      if (node.childNodes[i].level > maxLevel.value) {
        maxLevel.value = node.childNodes[i].level;
      }
      countNodeLevel(node.childNodes[i]);
    }
  }
}
const handleDrop = (
  draggingNode: Node,
  dropNode: Node,
  dropType: Exclude<NodeDropType, "none">,
  ev: DragEvent
) => {
  console.log("tree drop:", draggingNode, dropNode, dropType);
  let pCid;
  let siblings = null;
  if (dropType == "inner") {
    //得到最新的父id
    pCid = dropNode.data.catId;
    //得到最新的顺序
    siblings = dropNode.childNodes;
    //获得最新的层级
  } else {
    pCid =
      dropNode.parent?.data.catId == undefined ? 0 : dropNode.parent.data.catId;
    siblings = dropNode.parent?.childNodes || [];
  }
  pCids.value.push(pCid);
  //遍历siblings把变更收集起来
  for (var i = 0; i < siblings.length; i++) {
    //当遍历到当前拖拽节点
    if (siblings[i].data.catId == draggingNode.data.catId) {
      //当前节点层级发生变化时
      let catLevel = draggingNode.level;
      if (draggingNode.data.level != siblings[i].level) {
        catLevel = siblings[i].level;
        //递归改变子节点
        changeNodeLevel(siblings[i]);
      }
      updateNodes.value.push({
        catId: siblings[i].data.catId,
        sort: i,
        parentCid: pCid,
      });
    } else {
      updateNodes.value.push({ catId: siblings[i].data.catId, sort: i });
    }
  }
  // console.log("updateNodes:",updateNodes.value)
  //更新层级
};
function changeNodeLevel(node: any) {
  if (node.childNodes.length > 0) {
    for (var i = 0; i < node.childNodes.length; i++) {
      updateNodes.value.push({
        catId: node.childNodes[i].data.catId,
        catLevel: node.childNodes[i].level,
      });
      changeNodeLevel(node.childNodes[i]);
    }
  }
}
function batchSave() {
  batchEditMenu(updateNodes.value)
    .then(() => {
      ElMessage({
        message: "编辑成功！",
        type: "success",
      });
      getList();
      menuKeys.value = pCids.value;
      maxLevel.value = 0;
      updateNodes.value = [];
    })
    .catch(() => {});
}
function batchDel() {
  const checkNodes = menuTree.value?.getCheckedNodes();
  console.log("checkNodes", checkNodes);
  let ids = [];
  let names = [];
  let pCids = [];
  if (checkNodes != null) {
    for (let i = 0; i < checkNodes.length; i++) {
      ids.push(checkNodes[i].catId);
      names.push(checkNodes[i].name);
      pCids.push(checkNodes[i].parentCid);
    }
  }
  console.log("checkNodes", ids, names);
  ElMessageBox.confirm(`确认要删除【${names}】吗？`, "提示", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  }).then(() => {
    delMenu(ids)
      .then(() => {
        ElMessage({
          message: "删除成功！",
          type: "success",
        });
        getList();
        menuKeys.value = pCids;
      })
      .catch(() => {});
  });
}
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
