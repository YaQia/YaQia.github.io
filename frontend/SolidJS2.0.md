# SolidJS 2.0

## Async 重大调整

不再需要 `createResource` 这个 API 了，直接使用 `createMemo` 就可以接纳 `Promise` 了。

### 变量的 in-flight 机制

2.0 中提供了一个叫 `latest(fn)` 的 API，专门用于读取计算流已经更新但是渲染流还没更新的最新数据。

为什么会出现计算流和渲染流分叉？一切都是为了 UI 的一致性服务。

- 异步变量的更新有延迟，不能立刻渲染，导致与 signal 的不一致。现在的 computational 变量（即会影响渲染的变量）不光有 signal 还有 `Promise` 等 async 变量，因此假如 signal 变量修改即立刻渲染，而 `Promise` 则必须在依赖的 signal 修改后再发出请求等待结果，那么从 UI 上来看，所有 signal 变量都迅速被更新了而 `Promise` 则还没有。
- 因此，2.0 的设计将计算和渲染刻意地分割开了。在一个 signal 变量的依赖链下游存在 pending 的 async 变量时，不让 signal 触发渲染流的更新，而是等待整个依赖链下游的 async 请求都完成后统一地更新渲染流。

既然存在渲染流和计算流的分叉，那么就存在需要抓取最新的计算流结果来渲染的情况，这时就可以用 `latest(fn)` 这个函数来完成。

那么我们来看看如何使用它吧：

```jsx
import { createMemo, createSignal, flush, isPending, latest, Loading } from "solid-js";

const fetchUser = async (id: number) => {
  await new Promise((res) => setTimeout(res, 2000));
  return `Data for User ${id}`;
};

export default () => {
  const [userId, setUserId] = createSignal(1);
  const data = createMemo(() => {
    return fetchUser(userId());
  });

  const update = () => {
    setUserId(userId() + 1);
  };

  return (
    <fieldset>
      <legend>Latest 方案</legend>
      <button onClick={update}>切换用户 (2s 延迟)</button>

      {isPending(() => userId() || data()) && (
        <p style={{ color: "orange" }}>正在加载中...</p>
      )}

      <Loading>
        {/* 这里的 userId() 在加载完成前保持旧值 */}
        <p>当前显示的 ID (Stable): {userId()}</p>

        {/* 这里的 latest(userId) 会立刻显示点击后的新值 */}
        <p>准备切换到的 ID (In-flight): {latest(userId)}</p>

        <div>结果: {data()}</div>
      </Loading>
    </fieldset>
  );
};
```

:::details

实际上我们完全可以想象一个更笨但是也不依赖新 API 的方法
可以完成相同的事情：再维护一个可以立即更新的 signal，这个 signal 的依赖链与 async 剥离就行了。（和 react 里解决这类问题的思路是一致的）

```jsx
import { createMemo, createSignal, flush, isPending, Loading } from "solid-js";

const fetchUser = async (id: number) => {
  await new Promise((res) => setTimeout(res, 2000));
  return `Data for User ${id}`;
};

export default () => {
  const [userId, setUserId] = createSignal(1);
  const [immUserId, setImmUserId] = createSignal(1);
  const data = createMemo(() => {
    return fetchUser(userId());
  });

  const update = () => {
    setImmUserId(immUserId() + 1);
    flush();
    setUserId(userId() + 1);
  };

  return (
    <fieldset>
      <legend>Latest 方案</legend>
      <button onClick={update}>切换用户 (2s 延迟)</button>

      {isPending(() => userId() || data()) && (
        <p style={{ color: "orange" }}>正在加载中...</p>
      )}

      <Loading>
        {/* 这里的 userId() 在加载完成前保持旧值 */}
        <p>当前显示的 ID (Stable): {userId()}</p>

        {/* 这里的 latest(userId) 会立刻显示点击后的新值 */}
        <p>准备切换到的 ID (In-flight): {immUserId()}</p>

        <div>结果: {data()}</div>
      </Loading>
    </fieldset>
  );
};
```

> 注：代码里用到了flush()函数，是因为 SolidJS 2.0 默认会将一个函数中的所有set方法都收集起来统一触发更新（即默认batch所有的set）。因此需要一个新的 API 用于强制要求某一段 set 方法的更新与其他 set 方法不要放到一起（我个人觉得这个 API 的灵活程度不如 batch）。

:::

### UI 的乐观渲染

所谓乐观渲染，就是在数据尚未与后端同步更新，仅前端率先确认了正确更新后的数据值的时候就更新渲染结果。乐观渲染和乐观锁一样，是可能导致不一致性的。例如，在后端更新后发现更新失败，就会让乐观渲染的结果与实际后端的数据不一致，并最终触发 UI 重绘。

在 1.x 时代，触发乐观渲染的机制会丢失细粒度更新能力、在与后端数据不匹配的时候重绘时丢失自动协调细粒度更新的能力（通过diff保证匹配的项不被重新渲染的能力），且存在竞态条件问题。

在 2.0 时代，使用 createOptimisticStore 可以解决上述所有问题。

```jsx
const [todos, setOptimisticTodos] = createOptimisticStore(fetchTodos, []);

const addTodo = action(function* (todo) {
  setOptimisticTodos(s => { s.push(todo); });  // 1. 细粒度在 store 尾部追加
  yield saveTodo(todo);                        // 2. 等待保存完成
  refresh(todos);                              // 3. 用服务器数据刷新 store
});
```

（实际上这一部分我也还没完全弄明白，mark 下后续有新理解再更新）
