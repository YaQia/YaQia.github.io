# 这是一个轻松的博客，是对Vim和中文输入法解决方案的一次记录

今天突发奇想想了解一下vim的中文输入退出时需要再按一次shift才会退出是如何解决的，偶然发现了这个插件：

[nvim-ibus-sw](https://github.com/kevinhwang91/nvim-ibus-sw)

它通过将vim的InsertEnter注册一个setInput(true)，InsertLeave注册一个setInput(false)完成整个过程

> PS: 但我已经习惯了用Shift先退出rime的中文输入再进入normal mode，感觉目前对我来说作用已经不太大了（因为这个方案极其依赖系统，所以我认为不够好）
