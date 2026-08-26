# Rust 编程语言进阶

## Rust 类型系统与内存模型相关的特殊类型

- 内部可变性（`Cell`、`UnsafeCell`、`RefCell`）
- 同步数据结构（`Mutex`、`RwLock`、`OnceLock`）
- Pin
- 所有权（`Box`、`Rc`、`Arc`、`Cow`）

## 异步编程模型（较为复杂）

- async/.await 机制
- 实现一个简单的异步编程运行时
