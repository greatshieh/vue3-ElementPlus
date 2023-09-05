# Vue 3 + Vite + Element Plus

<div align=center>
<img src="https://img.shields.io/badge/vue-3.2.27-blue" />
<img src="https://img.shields.io/badge/vite-3.10-blue" />
<img src="https://img.shields.io/badge/ElementPlus-2.2.19-blue" />
</div>

参照[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin), 使用`vue3+Vite+Element Plus`改写。

## 工具

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## 实现功能

- [x] 登录
- [x] 表格(导出excel和zip)
- [x] 错误页面 (包括403, 404, 500 )
- [x] 富文本编辑器 ([TinyMEC 6](https://www.tiny.cloud/tinymce/)和[CKEditor 5](https://ckeditor.com/))
- [ ] markdown编辑器
- [x] 仿照[antdv](https://www.antdv.com/components/overview)的[List](https://www.antdv.com/components/list)封装了自定义组件[GList](./src/components/GList/README.md)
- [x] CountTo组件用vue3改写
- [x] 中国传统色
- [ ] 尽可能用vueuse实现部分功能(目前完成的有, useEventListener, useBreakpoints)
