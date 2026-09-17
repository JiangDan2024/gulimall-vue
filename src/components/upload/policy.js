import request from "@/utils/gulimallRequest";

// 获取 OSS 前端直传签名
export function policy() {
  return request({
    // 注意：这里的路径要和 OssController 里的 @GetMapping 保持一致
    url: "/thirdparty/oss/get_post_signature_for_oss_upload", 
    method: "get",
  });
}