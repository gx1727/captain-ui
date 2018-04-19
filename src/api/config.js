/**
 * Created by gx1727 on 2018/3/14.
 */
// 接口地址 http://localhost-v
// export const API_ROOT = '/api';
export const API_ROOT = 'http://localhost-v/api';

export const LoginApi = API_ROOT.concat('/login'); // 登录
export const RoleListApi = API_ROOT.concat('/role/list'); // 角色列表
export const RoleEditApi = API_ROOT.concat('/role/edit'); // 编辑角色
export const MenuGetTreeApi = API_ROOT.concat('/menu/tree'); // 获到角色目录
export const MenuGetApi = API_ROOT.concat('/menu/get'); // 获到指定id目录树
export const MenuFormApi = API_ROOT.concat('/menu/form'); // 编辑目录
export const MenuDelApi = API_ROOT.concat('/menu/del'); // 删除目录

export const CmsSortGetTreeApi = API_ROOT.concat('/cms/sort/tree'); // 获到分类树
export const CmsSortFormItemApi = API_ROOT.concat('/cms/sort/form'); // 编辑分类
export const CmsSortGetItemApi = API_ROOT.concat('/cms/sort/get'); // 获到指定id分类
export const CmsSortDelItemApi = API_ROOT.concat('/cms/sort/del'); // 删除分类

export const CmsTagGroupListApi = API_ROOT.concat('/cms/tag_group/list'); // TAG分组列表
export const CmsTagGroupAddApi = API_ROOT.concat('/cms/tag_group/add'); // 增加TAG分组
export const CmsTagGroupEditApi = API_ROOT.concat('/cms/tag_group/edit'); // 编辑TAG分组
export const CmsTagGroupDelApi = API_ROOT.concat('/cms/tag_group/del'); // 删除TAG分组

export const CmsTagListApi = API_ROOT.concat('/cms/tag/list'); // TAG列表
export const CmsTagAddApi = API_ROOT.concat('/cms/tag/add'); // 增加TAG
export const CmsTagEditApi = API_ROOT.concat('/cms/tag/edit'); // 编辑TAG
export const CmsTagDelApi = API_ROOT.concat('/cms/tag/del'); // 删除TAG
export const CmsTagGetApi = API_ROOT.concat('/cms/tag/get'); // 获到TAG数据
export const CmsTagByGroupApi = API_ROOT.concat('/cms/tag/group'); // 获到TAG数据


export const CmsArticleGetApi = API_ROOT.concat('/cms/article/get'); // 获到文章
export const CmsArticleListApi = API_ROOT.concat('/cms/article/list'); // 文章列表
export const CmsArticleCreateApi = API_ROOT.concat('/cms/article/create'); // 创建文章
export const CmsArticleEditApi = API_ROOT.concat('/cms/article/edit'); // 编辑文章
export const CmsArticlePublishApi = API_ROOT.concat('/cms/article/publish'); // 发布文章
export const CmsArticleDelApi = API_ROOT.concat('/cms/article/del'); // 删除文章

export const SystemAttListApi = API_ROOT.concat('/attachment/list'); // 附件列表
export const SystemAttNetworkApi = API_ROOT.concat('/attachment/network'); // 网络图片素材

export const CmsEditorListApi = API_ROOT.concat('/cms/editor/list'); // 编辑人员列表
export const CmsEditorFormApi = API_ROOT.concat('/cms/editor/form'); // 编辑人员
export const CmsEditorDelApi = API_ROOT.concat('/cms/editor/del'); // 编辑人员
export const CmsEditorAuthApi = API_ROOT.concat('/cms/editor/auth'); // 编辑人员
export const CmsEditorGetApi = API_ROOT.concat('/cms/editor/get'); // 编辑人员

export const CmsBrandsListApi = API_ROOT.concat('/rv/brands/list'); // 品牌列表
export const CmsBrandsAllApi = API_ROOT.concat('/rv/brands/all'); // 所有品牌
export const CmsRvListApi = API_ROOT.concat('/rv/rv/list'); // 车系列表
export const CmsRvBrandsApi = API_ROOT.concat('/rv/rv/brands'); // 通过品牌获取车系列表
export const CmsRvGetApi = API_ROOT.concat('/rv/rv/get'); // 获取车系
export const CmsRvFormApi = API_ROOT.concat('/rv/rv/form'); // 编辑车系
export const CmsRvDelApi = API_ROOT.concat('/rv/rv/del'); // 删除车系
export const CmsModelListApi = API_ROOT.concat('/rv/model/list'); // 车型列表
export const CmsModelGetApi = API_ROOT.concat('/rv/model/get'); // 获取车型
export const CmsModelFormApi =  API_ROOT.concat('/rv/model/form'); // 编辑车型