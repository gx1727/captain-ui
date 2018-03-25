/**
 * Created by gx1727 on 2018/3/14.
 */
// 接口地址
export const API_ROOT = 'http://localhost-o'

export const LoginApi = API_ROOT.concat('/login') // 登录
export const RoleListApi = API_ROOT.concat('/role/list') // 角色列表
export const RoleEditApi = API_ROOT.concat('/role/edit') // 编辑角色
export const MenuGetByRoleApi = API_ROOT.concat('/menu/get_by_role') // 获到角色目录
export const MenuGetTreeApi = API_ROOT.concat('/menu/get_tree') // 获到指定id目录树