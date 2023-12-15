# drools 规则引擎

- 基本思想：将业务逻辑与框架逻辑分离，将业务逻辑单独编码为drools源码
- 基本特征：其规则配置与程序逻辑代码的`if/else`不同，默认是任意时刻只要条件成立就触发的（由Java程序控制其触发开始时间和停止时间）

## drools 在Java中的使用方法

必要的配置：

1. 以maven自动构建工具构建的Java项目

```bash
mvn archetype:generate -DarchetypeGroupId=org.kie -DarchetypeArtifactId=kie-drools-exec-model-ruleunit-archetype -DarchetypeVersion=8.44.0.Final
```

2. pom.xml配置
   在pom.xml中可以看到如下内容：

```xml
    <dependency>
      <groupId>org.drools</groupId>
      <artifactId>drools-ruleunits-engine</artifactId>
    </dependency>
```

> 注：`mvn`执行完成后pom.xml无须额外配置3. Java代码适配4. drl源代码

3. Java源码适配Drools
4. DRL源码

```drools
package
unit

import

declare   // Optional

query  // Optional

rule "rule name"
    // Attributes
    when
        // [Conditions](#Conditions)
    then
        // [Actions](#Actions)
end

rule "rule2 name"

...
```

5. Java测试代码

## 场景模拟

模拟一个电商平台的场景，对于不同购物额度有不同积分

- 订单`Order`的基本数据结构如下：

```java
package org.example;

public class Order {
    private int amount; // purchased RMB amount
    private int credit;  // credit score accumulated in
    public Order(int amount, int credit) {
        super();
        this.amount = amount;
        this.credit = credit;
    }
    public int getAmount() {
        return amount;
    }
    public int getCredit() {
        return credit;
    }

    @Override
    public String toString() {
        return "Order [" +
                "amount=" + amount + ", " +
                "credit=" + credit +
                "]";
    }
}
```

- 为了适配drools，需要封装一份`OrderUnit`：

```java
package org.example;

import org.drools.ruleunits.api.DataSource;
import org.drools.ruleunits.api.DataStore;
import org.drools.ruleunits.api.RuleUnitData;

// import java.util.HashSet;
// import java.util.Set;
import java.util.Vector;

public class OrderUnit implements RuleUnitData {
    private final DataStore<Order> orders;
    private final Vector<Integer> updatedCredit = new Vector<>();
    public OrderUnit() {
        this(DataSource.createStore());
    }
    public OrderUnit(DataStore<Order> orders) {
        this.orders = orders;
    }
    public DataStore<Order> getOrders() {return orders;}
    public Vector<Integer> getUpdatedCredit() {return updatedCredit;}
}
```

`OrderUnit`中除了对`Order`的存储，还保存了一个更新后的数据，方便后续查询和选择性更新

- 最终需要一个DRL源代码

```drools
package org.example;

unit OrderUnit;

rule "Shoping credit 0"
when
    /orders[ amount < 100, $credit : credit ]
then
    updatedCredit.add($credit);
end

rule "Shoping credit 100"
when
    /orders[ amount < 500 && amount >= 100, $credit : credit ]
then
    updatedCredit.add($credit + 100);
end

rule "Shoping credit 300"
when
    /orders[ amount < 1000 && amount >= 500, $credit : credit ]
then
    updatedCredit.add($credit + 300);
end

rule "Shoping credit 1000"
when
    /orders[ amount >= 1000, $credit : credit ]
then
    updatedCredit.add($credit + 1000);
end
```

> 注：本教程使用的Drools 8新语法，Drools 8完全兼容Drools 7的语法
> 另注：如果使用Drools 7，将会涉及复杂的KIE配置，本文不涉及相关内容，网络上有大量相关内容

## drools详细语法描述

可以查阅[官方文档](https://docs.drools.org/8.44.0.Final/drools-docs/drools/language-reference/index.html)

### Attributes

| Attribute        | 解释                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| salience         | 优先级                                                                                                       |
| enbaled          | 启用与否                                                                                                     |
| date-effective   | 生效日期（注：生效日期默认格式是`dd-MMM-yyyy`）                                                              |
| date-expires     | 失效日期                                                                                                     |
| no-loop          | 禁止循环，默认`false`，需注意防止死循环                                                                      |
| activation-group | 激活组（字符串），在组内一个输入只会激活一个规则，如果出现多个匹配会按优先级排序，仍无法确定时按定义先后排序 |
| duration         | 规则匹配之间的间隔，规定了在一次匹配后需要等待多久才会激活下一次匹配                                         |
| timer            | 定时检查规则触发情况，可以用`int`或`cron`的形式定义                                                          |
| dialect          | 定义使用`JAVA`还是`MVEL`作为规则中的代码表达式，默认`JAVA`                                                   |

### Conditions

#### 匹配条件

在DRL代码的`when`中写入的就是匹配规则，常见的有如下操作符：
| 操作符 | 解释 | 用例 |
| ----- | -------- | -------- |
| # |子类匹配|/persons # Student（表示匹配Person类对象persons中是Student子类的）|
| ==|相等|/persons\[ age == 50 \]（表示Person中age成员为50的，对于私有成员会自动调用getAge()方法）|
| !=|不等|/persons\[ age != 50 \]|
|matches|正则匹配| /persons\[ country matches "(USA)?\\\\S\*UK" \]|
|not matches|...|...|
|contains|数组(Array)/集合(Collection)包含| /familyTree\[ countries contains "UK" \]|
|not contains|...|...|
|memberOf|数组(Array)/集合(Collection)成员| /familyTree\[ person memberOf $europeanDescendants \]|
|not memberOf|...|...|

#### 条件连接

| 操作符 | 解释     | 用例 |
| ------ | -------- | ---- |
| &&     | 与       | 略   |
| \|\|   | 或       | 略   |
| ,      | 与       | 略   |
| &      | 非短路与 | 略   |
| \|     | 非短路或 | 略   |

### Actions

这部分可以直接书写Java代码，是较为简单直接的

## Drools的优势

1. 将业务代码与框架代码解耦，实现当业务需要变更时无须再次编译打包框架代码

## Drools的弊端

1. 增加了代码复杂度，提高了程序构建的上手难度
2. 没有实现动态加载规则代码，而是每一次更新仍然需要重启服务
