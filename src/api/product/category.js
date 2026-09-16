import request from "@/utils/gulimallRequest";
// 查询树形菜单
export function listWithTree() {
  return request({
    url: "/product/pmsCategory/list/tree",
    method: "get",
  });
}
//查询单个菜单
export function getByID(id) {
  return request({
    url: "/product/pmsCategory/getById/"+id,
    method: "get",
  });
}
// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/product/pmsCategory/remove',
    method: 'post',
    data: menuId
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/product/pmsCategory/add',
    method: 'post',
    data: data
  })
}

// 编辑菜单
export function editMenu(data) {
  return request({
    url: '/product/pmsCategory/edit',
    method: 'post',
    data: data
  })
}

// 批量编辑菜单
export function batchEditMenu(data) {
  return request({
    url: '/product/pmsCategory/batchEdit',
    method: 'post',
    data: data
  })
}