<template>
    <div>
      <el-upload
        :action="dataObj.host"
        :data="dataObj"
        list-type="picture-card"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :on-remove="handleRemove"
        :on-success="handleUploadSuccess"
        :on-preview="handlePreview"
        :limit="maxCount"
        :on-exceed="handleExceed"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible" title="预览" width="500px">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, reactive } from 'vue';
  import { ElMessage } from 'element-plus';
  import { Plus } from '@element-plus/icons-vue';
  import { policy } from './policy';
  import { getUUID } from '@/utils';
  
  const props = defineProps({
    value: {
      type: Array,
      default: () => []
    },
    maxCount: {
      type: Number,
      default: 30
    }
  });
  
  const emit = defineEmits(['update:value']);
  
  const dialogVisible = ref(false);
  const dialogImageUrl = ref(null);
  const fileList = ref([]);
  
  // 适配 V4 签名的字段
  const dataObj = reactive({
    host: '',
    policy: '',
    'x-oss-signature': '',
    'x-oss-signature-version': 'OSS4-HMAC-SHA256',
    'x-oss-credential': '',
    'x-oss-date': '',
    'x-oss-security-token': '',
    'success_action_status': '200',
    key: '',
    dir: ''
  });
  
  // 监听外部传入的 value 变化，同步本地 fileList
  watch(() => props.value, (newVal) => {
    if (newVal && newVal.length > 0) {
      fileList.value = newVal.map(url => ({ url }));
    } else {
      fileList.value = [];
    }
  }, { immediate: true, deep: true });
  
  // 触发 v-model 更新
  const emitInput = (list) => {
    const urls = list.map(item => item.url);
    emit('update:value', urls);
  };
  
  const handleRemove = (file, uploadFiles) => {
    emitInput(uploadFiles);
  };
  
  const handlePreview = (file) => {
    dialogImageUrl.value = file.url;
    dialogVisible.value = true;
  };
  
  const handleExceed = () => {
    ElMessage.warning(`最多只能上传 ${props.maxCount} 张图片`);
  };
  
  // 上传前获取签名
  const beforeUpload = (file) => {
    return new Promise((resolve, reject) => {
      policy().then(response => {
        const data = response.data;
        dataObj.host = data.host;
        dataObj.policy = data.policy;
        dataObj['x-oss-signature'] = data.signature;
        dataObj['x-oss-credential'] = data.x_oss_credential;
        dataObj['x-oss-date'] = data.x_oss_date;
        dataObj['x-oss-security-token'] = data.security_token;
        dataObj.dir = data.dir;
        // 这里直接使用真实文件名，避免上传成功后还要替换 ${filename}
        dataObj.key = data.dir + '/' + getUUID() + '_' + file.name; 
        resolve(true);
      }).catch(err => {
        console.error("获取签名失败:", err);
        reject(false);
      });
    });
  };
  
  // 上传成功回调
  const handleUploadSuccess = (res, file) => {
    console.log("上传成功");
    // 拼接最终可访问的 URL
    const fileUrl = dataObj.host + '/' + dataObj.key;
    const newFileList = [...fileList.value, { name: file.name, url: fileUrl }];
    fileList.value = newFileList;
    emitInput(newFileList);
  };
  </script>
  
  <style scoped>
  </style>