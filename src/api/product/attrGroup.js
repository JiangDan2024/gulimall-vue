import request from "@/utils/gulimallRequest";

// 查询【请填写功能名称】列表
export function listAttrGroup(query) {
  return request({
    url: '/product/attrGroup/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getAttrGroup(attrGroupId) {
  return request({
    url: '/product/attrGroup/info/' + attrGroupId,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addAttrGroup(data) {
  return request({
    url: '/product/attrGroup/add',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateAttrGroup(data) {
  return request({
    url: '/product/attrGroup/edit',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delAttrGroup(attrGroupId) {
  return request({
    url: '/product/attrGroup/remove/' + attrGroupId,
    method: 'delete'
  })
}