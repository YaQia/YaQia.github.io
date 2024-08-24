# 编译Linux内核时需要生成`compile_commands.json`的两种方法

1. 用默认的gcc编译，加之使用bear

```bash
bear -- make -j$(nproc)
```

2. 使用clang编译器
```bash
make CC=clang defconfig
make CC=clang -j$(nproc)
```
编译完成后再使用工具生成`compile_commands.json`
```bash
scripts/clang-tools/gen_compile_commands.py
```
