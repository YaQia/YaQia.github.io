# 用 ccache 加速内核编译

~作为内核开发者，我最喜欢的就是在每一次做了少量修改后全量编译时摸鱼了~（不是）。其实每一次内核的编译都要等待很长时间，而且有一些场景还不能只做增量编译：

1. 中间文件损坏：增量编译的过程中如果因为某些特殊原因（例如不耐烦按了 Ctrl+C，或者系统关机了）导致某些中间文件输出未遂，而 make 又以为它已经完成输出（make只看文件是否存在不验证文件内容），就会导致 vmlinux 会缺失部分内容。这时不想去查哪一个文件损坏了，最简单的办法就是 `make clean` 删掉中间文件然后全量编译一遍；
2. LSP 支持：`bear -- make -j$(nproc)` 可以按照当前的编译命令生成 `compile_commands.json`，方便 clangd 使用。（当然，也可以用 `scripts/clang-tools/gen_compile_commands.py`，但是它导出的结果会存在对 clang 未知的编译器参数，有点难看）

anyway，为了减少等待编译的时间，我在偶然间发现了 `ccache` 这个编译器缓存工具。

## 使用方法

`ccache` 的实现原理是**根据预处理后的源码、编译器版本、命令行参数算哈希**，命中的情况下将之前生成的 .o 复制出来跳过编译。它支持两种使用方法：

1. 前缀执行方法:

   ```bash
   ccache gcc -c example.c
   ```

2. 伪装执行方法：

   ```bash
   cp ccache /usr/local/bin/
   ln -s ccache /usr/local/bin/gcc
   ln -s ccache /usr/local/bin/g++
   # 或者对不支持软链接的系统
   cp ccache /usr/local/bin/gcc
   cp ccache /usr/local/bin/g++
   ```

伪装执行的方法可以更充分地拦截每一次编译。

在内核编译时，我们可以这样使用：

```bash
# 将内核本体和 host 侧工具都用 ccache 缓存
make CC="ccache gcc" HOSTCC="ccache gcc" -j$(nproc)
```

> [!WARNING]
> 由于第一次 ccache 需要构建缓存，所以反而会变得更慢。

> [!TIP]
> 虽然编译阶段会快不少，但是生成 BTF 的阶段和链接阶段还是会成为瓶颈。个人实测的最终节省的时间大约是 50% 左右。
