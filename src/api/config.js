/**
 * Created by gx1727 on 2018/3/14.
 */
// 接口地址
export const API_ROOT = 'http://localhost-o'

export const LoginApi = API_ROOT.concat('/login') // 登录
export const RoleListApi = API_ROOT.concat('/role/list') // 角色列表
export const RoleEditApi = API_ROOT.concat('/role/edit') // 编辑角色
export const MenuGetTreeApi = API_ROOT.concat('/menu/tree') // 获到角色目录
export const MenuGetItemApi = API_ROOT.concat('/menu/get') // 获到指定id目录树
export const MenuFormItemApi = API_ROOT.concat('/menu/form') // 编辑目录
export const MenuDelItemApi = API_ROOT.concat('/menu/del') // 删除目录

export const CmsSortGetTreeApi = API_ROOT.concat('/cms/sort/tree') // 获到分类树
export const CmsSortFormItemApi = API_ROOT.concat('/cms/sort/form') // 编辑分类
export const CmsSortGetItemApi = API_ROOT.concat('/cms/sort/get') // 获到指定id分类
export const CmsSortDelItemApi = API_ROOT.concat('/cms/sort/del') // 删除分类

export const CmsTagGroupListApi = API_ROOT.concat('/cms/tag_group/list') // TAG分组列表
export const CmsTagGroupAddApi = API_ROOT.concat('/cms/tag_group/add') // 增加TAG分组
export const CmsTagGroupEditApi = API_ROOT.concat('/cms/tag_group/edit') // 编辑TAG分组
export const CmsTagGroupDelApi = API_ROOT.concat('/cms/tag_group/del') // 删除TAG分组

export const CmsTagListApi = API_ROOT.concat('/cms/tag/list') // TAG列表
export const CmsTagAddApi = API_ROOT.concat('/cms/tag/add') // 增加TAG
export const CmsTagEditApi = API_ROOT.concat('/cms/tag/edit') // 编辑TAG
export const CmsTagDelApi = API_ROOT.concat('/cms/tag/del') // 删除TAG
