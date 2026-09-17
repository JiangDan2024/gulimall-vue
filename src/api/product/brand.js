import request from "@/utils/gulimallRequest";

// 查询【请填写功能名称】列表
export function listBrand(query) {
  return request({
    url: '/product/brand/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getBrand(brandId) {
  return request({
    url: '/product/brand/info/' + brandId,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addBrand(data) {
  return request({
    url: '/product/brand/add',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateBrand(data) {
  return request({
    url: '/product/brand/edit',
    method: 'put',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateBrandShowStatus(data) {
  return request({
    url: '/product/brand/editShowStatus',
    method: 'put',
    data: data
  })
}
// 删除【请填写功能名称】
export function delBrand(brandId) {
  return request({
    url: '/product/brand/remove/' + brandId,
    method: 'delete'
  })
}