# 编译Linux内核时需要生成`compile_commands.json`的两种方法

1. 用默认的gcc编译，加之使用bear

   ```bash
   bear -- make -j$(nproc)
   ```

2. 使用内核的`gen_compile_commands.py`工具

   ```bash
   make CC=clang defconfig
   make CC=clang -j$(nproc)
   ```

   编译完成后再使用工具生成`compile_commands.json`

   ```bash
   scripts/clang-tools/gen_compile_commands.py
   ```

> [!NOTE]
> 实际上这种方式用gcc也可以生成compile_commands.json，只不过会有错误的unknown flag的error，无伤大雅
