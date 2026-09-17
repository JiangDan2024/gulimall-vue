<template>
  <div>
    <el-upload
      :action="dataObj.host"
      :data="() => dataObj"
      list-type="picture"
      :multiple="false"
      v-model:file-list="fileList"  
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <template #tip>
        <div class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
      </template>
    </el-upload>

    <el-dialog v-model="dialogVisible" title="预览" width="500px">
      <img v-if="dialogImageUrl" width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from "vue";
import { policy } from "./policy";
import { getUUID } from "@/utils";

const props = defineProps({
  value: { type: String, default: "" },
});
const emit = defineEmits(["update:value"]);

const dialogVisible = ref(false);
const fileList = ref([]); // el-upload 会通过 v-model:file-list 自动更新这个数组

// 适配 V4 签名的字段
const dataObj = reactive({
  host: "",
  policy: "",
  "x-oss-signature": "",
  "x-oss-signature-version": "OSS4-HMAC-SHA256",
  "x-oss-credential": "",
  "x-oss-date": "",
  "x-oss-security-token": "",
  success_action_status: "200",
  key: "",
  dir: "",
});

const imageUrl = computed(() => props.value);

// 监听父组件传进来的值，同步到 el-upload 的内部列表
watch(
  () => props.value,
  (newVal) => {
    if (newVal) {
      fileList.value = [{ name: newVal.substring(newVal.lastIndexOf("/") + 1), url: newVal }];
    } else {
      fileList.value = [];
    }
  },
  { immediate: true }
);

const emitInput = (val) => emit("update:value", val);
const dialogImageUrl = ref(""); 
const handleRemove = () => {
  emitInput(""); // 移除时清空父组件的值
};

const handlePreview = (file) => {
  dialogImageUrl.value = file.url; // 直接拿当前点击文件的 url
  dialogVisible.value = true;
};

const beforeUpload = (file) => {
  return new Promise((resolve, reject) => {
    policy()
      .then((response) => {
        console.log("后端返回的签名数据:", response);
        const data = response.data;
        dataObj.host = data.host;
        dataObj.policy = data.policy;
        dataObj["x-oss-signature"] = data.signature;
        dataObj["x-oss-credential"] = data.x_oss_credential;
        dataObj["x-oss-date"] = data.x_oss_date;
        dataObj["x-oss-security-token"] = data.security_token;
        dataObj.dir = data.dir;
        dataObj.key = data.dir + getUUID() + "_" + file.name;
        resolve(true);
      })
      .catch((err) => {
        console.error("获取签名失败:", err);
        reject(false);
      });
  });
};

// 上传成功的回调
const handleUploadSuccess = (res, file, uploadFiles) => {
  console.log("上传成功...");
  // 注意：这里不再直接修改 fileList.value，el-upload 通过 v-model 自动更新了它
  // 只需要把最终拼好的 URL 通知给父组件即可
  const fileUrl = dataObj.host + "/" + dataObj.key;
  console.log("最终文件 URL:", fileUrl);
  emitInput(fileUrl);
};
</script>

<style scoped></style>