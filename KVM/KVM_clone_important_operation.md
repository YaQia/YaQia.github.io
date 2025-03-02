# KVM 克隆的达摩克利斯剑

KVM 克隆很方便地做到了多个虚拟机部署，但同时由于Linux本身的复杂性，存在一些用于标识机器独一无二的标识符不能直接克隆。

- `machine id`（下面会重点讲到）
- MAC地址（在KVM克隆时已经帮我们处理好了两个虚拟机的MAC地址）
- 主机名（无关紧要，重复也不会出问题）

`machine id`，存储在`/etc/machine-id`下，是类似Windows中的SID的存在，用于标识机器唯一性的标识符。

许多软件依赖于这个`machine id`，而DHCP是最显著的一个。DHCP依赖于`dhcp clientId`来分配IP地址，而`dhcp clientId`是由`systemd-networkd`基于`machine id`生成的，一旦`machine id`相同，则多个机器会从DHCP中得到相同的IP地址。

> 如果没有`machine id`，那DHCP就更不能区分哪个请求是谁发来的了。
> 总不能每一次请求就开辟一个新IP地址分配吧？这样遇到攻击的情况下很快IP会被耗尽的。
>
> 当然，就算有了`machine id`依然可以用伪造的、不断变更的`machine id`来攻击，但那不在我们这篇文章讨论范围。

## 救赎之路

首先，我们需要在拷贝的VM中将其DHCP分配的IP地址给清除掉：

```bash
sudo systemctl stop systemd-networkd
# 清除DHCP租约记录
sudo rm -f /run/systemd/netif/leases/*
sudo rm -f /var/lib/systemd/network/*
sudo systemctl start systemd-networkd
```

在拷贝得到的VM中，执行如下命令：

```bash
sudo chmod 644 /etc/machine-id
sudo rm /etc/machine-id
sudo dbus-uuidgen --ensure
sudo systemd-machine-id-setup
# 修改完成后再检查machine id
hostnamectl | grep "Machine ID"
```

接下来，宿主机侧也需要删除DHCP租约记录
```bash
# 这里用qemu:///system是因为这些KVM都是virt-manager创建、管理的
sudo virsh -c qemu:///system net-list --all
# 确定好是哪一个网络
sudo virsh net-destroy \<network domain\>
sudo virsh net-start \<network domain\>
# 这会强制`dnsmasq`释放所有租约
```

最后，重启拷贝的VM即可

```bash
# 查看虚拟机的网络配置情况
virsh -c qemu:///system domifaddr \<VM name\>
```

> 注：运气好的话，你不需要执行上面所有的代码，只需要重新生成machine id，并重启VM即可
