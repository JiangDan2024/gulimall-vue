<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="6"
        ><div class="grid-content ep-bg-purple" />
        <category @nodeChange="getNodeAttr"></category>
      </el-col>
      <el-col :span="18"
        ><div class="grid-content ep-bg-purple" />
        <div class="app-container">
          <el-form
            :model="queryParams"
            ref="queryRef"
            :inline="true"
            v-show="showSearch"
            label-width="100px"
          >
            <el-form-item label="组名" prop="attrGroupName">
              <el-input
                v-model="queryParams.attrGroupName"
                placeholder="请输入组名"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input
                v-model="queryParams.sort"
                placeholder="请输入排序"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="描述" prop="descript">
              <el-input
                v-model="queryParams.descript"
                placeholder="请输入描述"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="组图标" prop="icon">
              <el-input
                v-model="queryParams.icon"
                placeholder="请输入组图标"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="所属分类id" prop="catelogId">
              <el-input
                v-model="queryParams.catelogId"
                placeholder="请输入所属分类id"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery"
                >搜索</el-button
              >
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                plain
                icon="Plus"
                @click="handleAdd"
                v-hasPermi="['product:attrGroup:add']"
                >新增</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="success"
                plain
                icon="Edit"
                :disabled="single"
                @click="handleUpdate"
                v-hasPermi="['product:attrGroup:edit']"
                >修改</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="danger"
                plain
                icon="Delete"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['product:attrGroup:remove']"
                >删除</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="warning"
                plain
                icon="Download"
                @click="handleExport"
                v-hasPermi="['product:attrGroup:export']"
                >导出</el-button
              >
            </el-col>
            <right-toolbar
              v-model:showSearch="showSearch"
              @queryTable="getList"
            ></right-toolbar>
          </el-row>

          <el-table
            v-loading="loading"
            :data="attrGroupList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="分组id" align="center" prop="attrGroupId" />
            <el-table-column label="组名" align="center" prop="attrGroupName" />
            <el-table-column label="排序" align="center" prop="sort" />
            <el-table-column label="描述" align="center" prop="descript" />
            <el-table-column label="组图标" align="center" prop="icon" />
            <el-table-column
              label="所属分类id"
              align="center"
              prop="catelogId"
            />
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  icon="Edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['product:attrGroup:edit']"
                  >修改</el-button
                >
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['product:attrGroup:remove']"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
          />

          <!-- 添加或修改【请填写功能名称】对话框 -->
          <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form
              ref="attrGroupRef"
              :model="form"
              :rules="rules"
              label-width="100px"
            >
              <el-row>
                <el-col :span="24">
                  <el-form-item label="组名" prop="attrGroupName">
                    <el-input
                      v-model="form.attrGroupName"
                      placeholder="请输入组名"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="排序" prop="sort">
                    <el-input v-model="form.sort" placeholder="请输入排序" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="描述" prop="descript">
                    <el-input
                      v-model="form.descript"
                      placeholder="请输入描述"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="组图标" prop="icon">
                    <el-input v-model="form.icon" placeholder="请输入组图标" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="所属分类id" prop="catelogId">
                    <!-- <el-input
                      v-model="form.catelogId"
                      placeholder="请输入所属分类id"
                    /> -->
                    <el-cascader
                      v-model="catelogArray"
                      :options="options"
                      :props="optionsProps"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <template #footer>
              <div class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
              </div>
            </template>
          </el-dialog>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
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
import category from "@/components/Category";
import {
  listAttrGroup,
  getAttrGroup,
  delAttrGroup,
  addAttrGroup,
  updateAttrGroup,
} from "@/api/product/attrGroup";
import { listWithTree } from "@/api/product/category";

// 定义 Props
const props = defineProps({});

// 导入组件 (script setup 中引入即可直接使用，无需注册)
// import MyComponent from '@/components/MyComponent.vue'

// 响应式变量
// const data = ref(null);

// ================== 生命周期钩子 ==================
onBeforeMount(() => {}); // 组件挂载前
onMounted(() => {
  getCategoryList();
}); // 组件挂载完成
onBeforeUpdate(() => {}); // 组件更新前
onUpdated(() => {}); // 组件更新完成
onBeforeUnmount(() => {}); // 组件卸载前
onUnmounted(() => {}); // 组件卸载完成
onActivated(() => {}); // 被 keep-alive 缓存的组件激活时
onDeactivated(() => {}); // 被 keep-alive 缓存的组件停用时
const { proxy } = getCurrentInstance();

const attrGroupList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const options = ref([]);
const title = ref("");
const catelogArray = ref([])
const optionsProps = {
  label: "name",
  value: "catId",
  children: "children",
};
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    attrGroupName: undefined,
    sort: undefined,
    descript: undefined,
    icon: undefined,
    catelogId: undefined,
  },
  rules: {},
});

const { queryParams, form, rules } = toRefs(data);

/** 查询【请填写功能名称】列表 */
function getList() {
  loading.value = true;
  listAttrGroup(queryParams.value).then((response) => {
    attrGroupList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/** 表单重置 */
function reset() {
  form.value = {
    attrGroupId: null,
    attrGroupName: null,
    sort: null,
    descript: null,
    icon: null,
    catelogId: null,
  };
  catelogArray.value = []
  proxy.resetForm("attrGroupRef");
}

function getCategoryList() {
  listWithTree().then((res) => {
    options.value = res.data;
    console.log(res.data);
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.attrGroupId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _attrGroupId = row.attrGroupId || ids.value;
  getAttrGroup(_attrGroupId).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["attrGroupRef"].validate((valid) => {
    if (valid) {
      if (form.value.attrGroupId != null) {
        updateAttrGroup(orm.value).then(() => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        console.dir(catelogArray)
        const submitData = {
          ...form.value,
          // 提交时再提取最后一个 ID，不影响表单原本的数组结构
          catelogId: catelogArray?.value[catelogArray.value.length-1] ?? 0,
        };
        addAttrGroup(submitData).then(() => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _attrGroupIds = row.attrGroupId || ids.value;
  proxy.$modal
    .confirm('是否确认删除编号为"' + _attrGroupIds + '"的数据项？')
    .then(function () {
      return delAttrGroup(_attrGroupIds);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "product/attrGroup/export",
    {
      ...queryParams.value,
    },
    `attrGroup_${new Date().getTime()}.xlsx`
  );
}

// 获取点击节点对应的数据
function getNodeAttr(data) {
  console.log("获取数据", data.catId);
  queryParams.value.catelogId = data.catId;
  getList();
}
getList();
</script>

<style scoped></style>
