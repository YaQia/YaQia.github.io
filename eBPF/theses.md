## Dissecting Overheads of Service Mesh Sidecars

Authors: Xiangfeng Zhu; Guozhen She; Bowen Xue; Yu Zhang; Yongsu Zhang; Xuan Kelvin Zou; XiongChun Duan; Peng He; Arvind Krishnamurthy; Matthew Lentz; Danyang Zhuo; Ratul Mahajan

Conference : SoCC '23

Tags: `QoS`

Url: <https://dl.acm.org/doi/10.1145/3620678.3624652>

Abstract: Service meshes play a central role in the modern application ecosystem by providing an easy and flexible way to connect microservices of a distributed application. However, because of how they interpose on application traffic, they can substantially increase application latency and its resource consumption. We develop a tool called MeshInsight to help developers quantify the overhead of service meshes in deployment scenarios of interest and make informed trade-offs about their functionality vs. overhead. Using MeshInsight, we confirm that service meshes can have high overhead---up to 269% higher latency and up to 163% more virtual CPU cores for our benchmark applications---but the severity is intimately tied to how they are configured and the application workload. IPC (inter-process communication) and socket writes dominate when the service mesh operates as a TCP proxy, but protocol parsing dominates when it operates as an HTTP proxy. MeshInsight also enables us to study the end-to-end impact of optimizations to service meshes. We show that not all seemingly-promising optimizations lead to a notable overhead reduction in realistic settings.

摘要翻译： 服务网格通过提供一种简单而灵活的方式来连接分布式应用程序的微服务，在现代应用程序生态系统中发挥着核心作用。但是，由于它们对应用程序流量的干预方式，它们可能会大大增加应用程序延迟及其资源消耗。我们开发了一个名为MeshInsight的工具，以帮助开发人员量化服务网格在部署场景中的开销，并对其功能和开销做出明智的权衡。使用MeshInsight，我们确认服务网格可能会有很高的开销——对于我们的基准应用程序，延迟高达269%，虚拟CPU内核高达163%——但其严重程度与它们的配置方式和应用程序工作负载密切相关。当服务网格作为TCP代理运行时，IPC(进程间通信)和套接字写入占主导地位，但当它作为HTTP代理运行时，协议解析占主导地位。MeshInsight还使我们能够研究优化对服务网格的端到端影响。我们表明，并非所有看似有希望的优化都能在实际设置中显著降低开销。

Notes:

提供了一种服务网格的负载开销监控工具，还用这个工具实现了不那么显而易见的端到端的优化以显著降低负载开销

## Gödel: Unified Large-Scale Resource Management and Scheduling at ByteDance

Authors: Wu Xiang; Yakun Li; Yuquan Ren; Fan Jiang; Chaohui Xin; Varun Gupta; Chao Xiang; Xinyi Song; Meng Liu; Bing Li; Kaiyang Shao; Chen Xu; Wei Shao; Yuqi Fu; Wilson Wang; Cong Xu; Wei Xu; Caixue Lin; Rui Shi; Yuming Liang

Conference : SoCC '23

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/3620678.3624663>

Abstract: Over the last few years, at ByteDance, our compute infrastructure scale has been expanding significantly due to expedited business growth. In this journey, to meet hyper-scale growth, some business groups resorted to managing their own compute infrastructure stack running different scheduling systems such as Kubernetes, YARN which created two major pain points: the increasing resource fragmentation across different business groups and the inadequate resource elasticity between workloads of different business priorities. Isolation across different business groups (and their compute infrastructure management) leads to inefficient compute resource utilization and prevents us from serving the business growth needs in the long run. To meet these challenges, we propose a resource management and scheduling system named Gödel, which provides a unified compute infrastructure for all business groups to run their diverse workloads under a unified resource pool. It co-locates various workloads on every machine to achieve better resource utilization and elasticity. Gödel is built upon Kubernetes, the de facto open-source container orchestration system, but with significant components replaced or enhanced to accommodate various workloads at a large scale. In production, it manages clusters with tens of thousands of machines, achieves high overall resource utilization of over 60%, and scheduling throughput of up to 5000 pods per second. This paper reports on our design and implementation with Gödel. Moreover, it discusses the lessons and best practices we learned in developing and operating it in production at ByteDance's scale.

摘要翻译： 在过去的几年里，由于业务的快速增长，字节跳动的计算基础设施规模得到了显著的扩展。在这一过程中，为了满足超大规模的增长，一些业务团队开始管理自己的计算基础设施堆栈，运行不同的调度系统，如Kubernetes、YARN，这造成了两个主要的痛点:不同业务团队之间日益增加的资源碎片，以及不同业务优先级的工作负载之间的资源弹性不足。跨不同业务组(及其计算基础设施管理)的隔离导致计算资源利用效率低下，并妨碍我们长期满足业务增长需求。为了应对这些挑战，我们提出了一个名为Gödel的资源管理和调度系统，它为所有业务组提供了一个统一的计算基础设施，以便在统一的资源池下运行不同的工作负载。它将各种工作负载放在每台机器上，以实现更好的资源利用和弹性。Gödel建立在Kubernetes(事实上的开源容器编排系统)之上，但是替换或增强了重要的组件，以适应大规模的各种工作负载。在生产中，它管理着拥有数万台机器的集群，实现了超过60%的高整体资源利用率，以及高达每秒5000个pod的调度吞吐量。本文报告了我们的设计和实现Gödel。此外，它还讨论了我们在ByteDance规模的生产环境中开发和操作它时学到的经验教训和最佳实践。

Notes:

由于商业组隔离导致资源碎片（例如重复存储的资源）以及内部资源与其他商业组的资源不平衡、不一致的弹性的问题，做了一个k8s上的全局资源管理和调度系统

很粗暴，乍一眼看起来没什么学术价值，只是量比较大而已

## Not All Resources are Visible: Exploiting Fragmented Shadow Resources in Shared-State Scheduler Architecture

Authors: Xinkai Wang; Hao He; Yuancheng Li; Chao Li; Xiaofeng Hou; Jing Wang; Quan Chen; Jingwen Leng; Minyi Guo; Leibo Wang

Conference : SoCC '23

Tags: `QoS`,`scheduler`

Url: <https://dl.acm.org/doi/10.1145/3620678.3624650>

Abstract: With the rapid development of cloud computing, the increasing scale of clusters and task parallelism put forward higher requirements on the scheduling capability at scale. To this end, the shared-state scheduler architecture has emerged as the popular solution for large-scale scheduling due to its high scalability and utilization. In such an architecture, a central resource state view periodically updates the global cluster status to distributed schedulers for parallel scheduling. However, the schedulers obtain broader resource views at the cost of intermittently stale states, rendering resources released invisible to schedulers until the next view update. These fleeting resource fragments are referred to as shadow resources in this paper. Current shared-state solutions overlook or fail to systematically utilize the shadow resources, leaving a void in fully exploiting these invisible resources. In this paper, we present a thorough analysis of shadow resources through theoretic modeling and extensive experiments. In order to systematically utilize these resources, we propose Resource Miner (RMiner), a hybrid scheduling sub-system on top of the shared-state scheduler architecture. RMiner comprises three cooperative components: a shadow resource manager that efficiently manages shadow resources, an RM filter that selects suitable tasks as RM tasks, and an RM scheduler that allocates shadow resources to RM tasks. In total, our design enhances the visibility of shared-state scheduling solutions by adding manageability to invisible resources. Through extensive trace-driven evaluation, we show that RMiner greatly outperforms current shared-state schedulers in terms of resource utilization, task throughput, and job wait time with only minor costs of scheduling conflicts and overhead.

摘要翻译： 随着云计算的快速发展，集群规模和任务并行性的不断提高，对大规模调度能力提出了更高的要求。为此，共享状态调度器架构因其高可伸缩性和高利用率而成为大规模调度的流行解决方案。在这样的体系结构中，中央资源状态视图定期向分布式调度器更新全局集群状态，以进行并行调度。但是，调度器以间歇性失效状态为代价获得更广泛的资源视图，在下一次视图更新之前，调度器无法看到释放的资源。这些稍纵即逝的资源片段在本文中称为影子资源。目前的共享状态解决方案忽视或未能系统地利用影子资源，在充分利用这些无形资源方面留下了空白。在本文中，我们通过理论建模和广泛的实验对阴影资源进行了深入的分析。为了系统地利用这些资源，我们提出了一种基于共享状态调度器架构的混合调度子系统Resource Miner (RMiner)。RMiner包含三个协作组件:一个有效管理影子资源的影子资源管理器，一个选择合适任务作为RM任务的RM过滤器，以及一个将影子资源分配给RM任务的RM调度器。总的来说，我们的设计通过增加对不可见资源的可管理性来增强共享状态调度解决方案的可见性。通过广泛的跟踪驱动评估，我们发现RMiner在资源利用率、任务吞吐量和作业等待时间方面大大优于当前的共享状态调度器，而调度冲突和开销的代价很小。

Notes:

现有的大规模集群的调度器一般分为两层：全局状态共享调度器和局部调度器，全局状态共享调度器定期检查资源情况以通知局部调度器进行相应的容器的调度。但两次定期检查之间会出现资源已经被释放但没有容器能够使用的情况，这种状态的资源在文中称为“影子资源”，文中提出的调度器就是在全局调度器的基础上增设了一个管理“影子资源”的调度器，提高了全局调度器对不可见资源的资源管理能力。

> 这个架构听起来很美好，但性能开销究竟如何呢？

## Workload consolidation in alibaba clusters: the good, the bad, and the ugly

Authors: Yongkang Zhang; Yinghao Yu; Wei Wang; Qiukai Chen; Jie Wu; Zuowei Zhang; Jiang Zhong; Tianchen Ding; Qizhen Weng; Lingyun Yang; Cheng Wang; Jian He; Guodong Yang; Liping Zhang

Conference : SoCC '22

Tags: `scheduler`,`useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/3542929.3563465>

Abstract: Web companies typically run latency-critical long-running services and resource-intensive, throughput-hungry batch jobs in a shared cluster for improved utilization and reduced cost. Despite many recent studies on workload consolidation, the production practice remains largely unknown. This paper describes our efforts to efficiently consolidate the two types of workloads in Alibaba clusters to support the company's e-commerce businesses. At the cluster level, the host and GPU memory are the bottleneck resources that limit the scale of consolidation. Our system proactively reclaims the idle host memory pages of service jobs and dynamically relinquishes their unused host and GPU memory following the predictable diurnal pattern of user traffic, a technique termed tidal scaling. Our system further performs node-level micro-management to ensure that the increased workload consolidation does not result in harmful resource contention. We briefly share our experience in handling the surging traffic with flash-crowd customers during the seasonal shopping festivals (e.g., November 11) using these "good" practices. We also discuss the limitations of our current solution (the "bad") and some practical engineering constraints (the "ugly") that make many prior research solutions inapplicable to our system.

摘要翻译： Web公司通常在共享集群中运行延迟关键的长时间运行服务和资源密集型、需要大量吞吐量的批处理作业，以提高利用率并降低成本。尽管最近有许多关于工作量整合的研究，但生产实践在很大程度上仍然未知。本文描述了我们在阿里巴巴集群中有效整合两类工作负载以支持公司电子商务业务的努力。在集群级别，主机和GPU内存是限制整合规模的瓶颈资源。我们的系统主动回收服务作业的空闲主机内存页面，并根据可预测的用户流量的每日模式动态放弃其未使用的主机和GPU内存，这是一种称为潮汐缩放的技术。我们的系统进一步执行节点级微观管理，以确保增加的工作负载整合不会导致有害的资源争用。我们简单分享一下我们在季节性购物节(例如双十一)处理快闪人群的经验。我们还讨论了我们当前解决方案的局限性(“坏”)和一些实际工程约束(“丑陋”)，这些约束使得许多先前的研究解决方案不适用于我们的系统。

Notes:

对分得过小的工作负载进行合并，也是商用大规模集群的

## KOLE: breaking the scalability barrier for managing far edge nodes in cloud

Authors: Jie Zhang; Chen Jin; YuQi Huang; Li Yi; Yu Ding; Fei Guo

Conference : SoCC '22

Tags: `useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/3542929.3563462>

Abstract: In edge computing, the trend is moving towards leveraging cloud native technologies and platforms such as con-tainerization and Kubernetes to manage edge applications to improve operation efficiency. Unfortunately, the supported number of nodes per cluster is only several thousand in Kubernetes which is much less than what typical far edge use cases require. In this paper, we propose KOLE, a framework that extends the upstream Kubernetes for supporting a large number of far edge nodes. It replaces the existing apiserver-to-node communication mechanism in Kubernetes with a MQTT messaging system. The MQTT broker completely offloads the overhead of keeping numerous HTTP connections for nodes in the apiserver. In KOLE, we avoid creating numerous individual objects in the apiserver by maintaining them in a cloud state cache. The cache is snapshotted periodically for disaster recovery. Overall, KOLE achieves outstanding scalability by sacrificing the manageability of having individual objects, which we believe is a reasonable trade-off for far edge use cases. The experiment results show that KOLE is scalable and can support up to one million nodes.

摘要翻译： 在边缘计算方面，趋势是利用云原生技术和平台(如容器化和Kubernetes)来管理边缘应用程序，以提高操作效率。不幸的是，在Kubernetes中，每个集群支持的节点数量只有几千个，这远远少于典型的远端用例所需的节点数量。在本文中，我们提出了KOLE，这是一个扩展上游Kubernetes以支持大量远边节点的框架。它用MQTT消息传递系统取代了Kubernetes中现有的apisserver到节点通信机制。MQTT代理完全减轻了在apisserver中为节点保持大量HTTP连接的开销。在KOLE中，我们通过在云状态缓存中维护它们来避免在apisserver中创建大量单独的对象。定时对缓存进行快照，用于容灾。总的来说，KOLE通过牺牲拥有单个对象的可管理性来实现出色的可伸缩性，我们认为这对于边缘用例来说是合理的权衡。实验结果表明，KOLE具有可扩展性，可以支持多达一百万个节点。

Notes:

给边缘计算用k8s的时候，节点数上限远远不够（一般k8s上限是几千个），为此开发了KOLE以提高可扩展性：

1.  用MQTT消息传递系统替代现有apiserver到节点的通信机制
2.  避免在apiserver的缓存中维护某个对象（牺牲单个对象的维护时间换取更好的可扩展性）

## Demeter: QoS-aware CPU scheduling to reduce power consumption of multiple black-box workloads

Authors: Wenda Tang; Yutao Ke; Senbo Fu; Hongliang Jiang; Junjie Wu; Qian Peng; Feng Gao

Conference : SoCC '22

Tags: `QoS`,`scheduler`

Url: <https://dl.acm.org/doi/10.1145/3542929.3563476>

Abstract: Energy consumption in cloud data centers has become an increasingly important contributor to greenhouse gas emissions and operation costs. To reduce energy-related costs and improve environmental sustainability, most modern data centers consolidate Virtual Machine (VM) workloads belonging to different application classes, some being latency-critical (LC) and others being more tolerant to performance changes, known as best-effort (BE). However, in public cloud scenarios, the real classes of applications are often opaque to data center operators. The heterogeneous applications from different cloud tenants are usually consolidated onto the same hosts to improve energy efficiency, but it is not trivial to guarantee decent performance isolation among colocated workloads. We tackle the above challenges by introducing Demeter, a QoS-aware power management controller for heterogeneous black-box workloads in public clouds. Demeter is designed to work without offline profiling or prior knowledge about black-box workloads. Through the correlation analysis between network throughput and CPU resource utilization, Demeter automatically classifies black-box workloads as either LC or BE. By provisioning differentiated CPU management strategies (including dynamic core allocation and frequency scaling) to LC and BE workloads, Demeter achieves considerable power savings together with a minimum impact on the performance of all workloads. We discuss the design and implementation of Demeter in this work, and conduct extensive experimental evaluations to reveal its effectiveness. Our results show that Demeter not only meets the performance demand of all workloads, but also responds quickly to dynamic load changes in our cloud environment. In addition, Demeter saves an average of 10.6% power consumption than state of the art mechanisms.

摘要翻译： 云数据中心的能源消耗已经成为温室气体排放和运营成本的一个越来越重要的因素。为了降低与能源相关的成本并提高环境的可持续性，大多数现代数据中心合并属于不同应用程序类的虚拟机(VM)工作负载，其中一些是延迟关键型(LC)，而另一些则更能容忍性能变化，这被称为“尽力而为”(BE)。然而，在公共云场景中，应用程序的实际类别通常对数据中心运营商来说是不透明的。来自不同云租户的异构应用程序通常被整合到相同的主机上，以提高能源效率，但是保证在托管的工作负载之间实现良好的性能隔离并非易事。我们通过引入Demeter来解决上述挑战，Demeter是一种面向公共云中异构黑箱工作负载的qos感知电源管理控制器。Demeter可以在没有离线分析或事先了解黑箱工作负载的情况下工作。通过分析网络吞吐量和CPU资源利用率之间的相关性，Demeter自动将黑箱工作负载划分为LC或BE。通过为LC和BE工作负载提供不同的CPU管理策略(包括动态内核分配和频率缩放)，Demeter实现了相当大的功耗节约，同时对所有工作负载的性能影响最小。我们在这项工作中讨论了Demeter的设计和实现，并进行了广泛的实验评估，以揭示其有效性。我们的结果表明，Demeter不仅可以满足所有工作负载的性能需求，而且可以快速响应我们云环境中的动态负载变化。此外，Demeter比目前最先进的机制平均节省10.6%的功耗。

Notes:

将容器内部视为黑箱，仅通过对其CPU利用率和网络负载的分析判断出容器是延迟关键型(Latancy Critical - LC)还是尽力而为型(Best Effort - BE)，以此实现降低功耗同时不失性能的调度

## Atoll: A Scalable Low-Latency Serverless Platform

Authors: Arjun Singhvi; Arjun Balasubramanian; Kevin Houck; Mohammed Danish Shaikh; Shivaram Venkataraman; Aditya Akella

Conference : SoCC '21

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/3472883.3486981>

Abstract: With user-facing apps adopting serverless computing, good latency performance of serverless platforms has become a strong fundamental requirement. However, it is difficult to achieve this on platforms today due to the design of their underlying control and data planes that are particularly ill-suited to short-lived functions with unpredictable arrival patterns. We present Atoll, a serverless platform, that overcomes the challenges via a ground-up redesign of the control and data planes. In Atoll, each app is associated with a latency deadline. Atoll achieves its per-app request latency goals by: (a) partitioning the cluster into (semi-global scheduler, worker pool) pairs, (b) performing deadline-aware scheduling and proactive sandbox allocation, and (c) using a load balancing layer to do sandbox-aware routing, and automatically scale the semi-global schedulers per app. Our results show that Atoll reduces missed deadlines by \~66x and tail latencies by \~3x compared to state-of-the-art alternatives.

摘要翻译： 随着面向用户的应用采用无服务器计算，无服务器平台良好的延迟性能已经成为一个强有力的基本要求。然而，由于其底层控制和数据平面的设计特别不适合具有不可预测到达模式的短期功能，因此很难在当今的平台上实现这一点。我们介绍了Atoll，一个无服务器平台，它通过对控制和数据平面的重新设计来克服这些挑战。在Atoll中，每个应用程序都与延迟截止日期相关联。Atoll通过以下方式实现其每个应用程序请求延迟目标:(a)将集群划分为(半全局调度器，工作池)对，(b)执行截止日期感知调度和主动沙盒分配，以及(c)使用负载平衡层进行沙盒感知路由，并自动扩展每个应用程序的半全局调度器。我们的结果表明，与最先进的替代方案相比，Atoll将错过的截止日期减少了~66x，尾延迟减少了~3x。

Notes:

对serverless的一种调度器实现，有应用延迟的deadline，有每个worker池的半全局调度器，有负载均衡和弹性伸缩

## Tell me when you are sleepy and what may wake you up!

Authors: Djob Mvondo; Antonio Barbalace; Alain Tchana; Gilles Muller

Conference : SoCC '21

Tags: `eBPF`,`important`,`scheduler`

Url: <https://dl.acm.org/doi/10.1145/3472883.3487013>

Abstract: Nowadays, there is a shift in the deployment model of Cloud and Edge applications. Applications are now deployed as a set of several small units communicating with each other - the microservice model. Moreover, each unit - a microservice, may be implemented as a virtual machine, container, function, etc., spanning the different Cloud and Edge service models including IaaS, PaaS, FaaS. A microservice is instantiated upon the reception of a request (e.g., an http packet or a trigger), and a rack-level or data-center-level scheduler decides the placement for such unit of execution considering for example data locality and load balancing. With such a configuration, it is common to encounter scenarios where different units, as well as multiple instances of the same unit, may be running on a single server at the same time. When multiple microservices are running on the same server not necessarily all of them are doing actual processing, some may be busy-waiting - i.e., waiting for events (or requests) sent by other units. However, these "idle" units are consuming CPU time which could be used by other running units or cloud utility functions on the server (e.g., monitoring daemons). In a controlled experiment, we observe that units can spend up to 20% - 55% of their CPU time waiting, thus a great amount of CPU time is wasted; these values significantly grow when overcommitting CPU resources (i.e., units CPU reservations exceed server CPU capacity), where we observe up to 69% - 75%. This is a result of the lack of information/context about what is running in each unit from the server CPU scheduler perspective. In this paper, we first provide evidence of the problem and discuss several research questions. Then, we propose an handful of solutions worth exploring that consists in revisiting hypervisor and host OS scheduler designs to reduce the CPU time wasted on idle units. Our proposal leverages the concepts of informed scheduling, and monitoring for internal and external events. Based on the aforementioned solutions, we propose our initial implementation on Linux/KVM.

摘要翻译： 如今，云和边缘应用程序的部署模型发生了转变。应用程序现在被部署为一组相互通信的小单元——微服务模型。此外，每个微服务单元都可以作为虚拟机、容器、功能等实现，跨越不同的云和边缘服务模型，包括IaaS、PaaS、FaaS。微服务在接收请求(例如，http数据包或触发器)时被实例化，并且机架级或数据中心级调度器考虑例如数据局部性和负载平衡来决定此类执行单元的位置。使用这样的配置，通常会遇到不同单元以及同一单元的多个实例可能同时在单个服务器上运行的情况。当多个微服务在同一台服务器上运行时，不一定所有的微服务都在进行实际的处理，有些微服务可能在忙等待——即等待其他单元发送的事件(或请求)。然而，这些“空闲”单元正在消耗CPU时间，而这些时间本可以由服务器上的其他运行单元或云实用程序功能使用(例如，监视守护进程)。在一个对照实验中，我们观察到单元可以花费高达20% - 55%的CPU时间等待，从而浪费了大量的CPU时间;当过度使用CPU资源时(即，单位CPU预留超过服务器CPU容量)，这些值显著增长，我们观察到高达69% - 75%。这是因为从服务器CPU调度器的角度来看，缺乏关于每个单元中正在运行的内容的信息/上下文。在本文中，我们首先提供了问题的证据，并讨论了几个研究问题。然后，我们提出了一些值得探索的解决方案，这些解决方案包括重新审视管理程序和主机操作系统调度器的设计，以减少在空闲单元上浪费的CPU时间。我们的建议利用了知情调度的概念，以及对内部和外部事件的监控。基于上述解决方案，我们提出了在Linux/KVM上的初步实现。

Notes:

基本上就是在微服务这个应用场景下的实现的我们要实现的调度器（文章中有hypervisor的调度器，我们这里对应的是k8s的调度器）

## Mind the Gap: Broken Promises of CPU Reservations in Containerized Multi-tenant Clouds

Authors: Li Liu; Haoliang Wang; An Wang; Mengbai Xiao; Yue Cheng; Songqing Chen

Conference : SoCC '21

Tags: `important`,`scheduler`

Url: <https://dl.acm.org/doi/10.1145/3472883.3486997>

Abstract: Containerization is becoming increasingly popular, but unfortunately, containers often fail to deliver the anticipated performance with the allocated resources. In this paper, we first demonstrate the performance variance and degradation are significant (by up to 5x) in a multi-tenant environment where containers are co-located. We then investigate the root cause of such performance degradation. Contrary to the common belief that such degradation is caused by resource contention and interference, we find that there is a gap between the amount of CPU a container reserves and actually gets. The root cause lies in the design choices of today's Linux scheduling mechanism, which we call Forced Runqueue Sharing and Phantom CPU Time. In fact, there are fundamental conflicts between the need to reserve CPU resources and Completely Fair Scheduler's work-conserving nature, and this contradiction prevents a container from fully utilizing its requested CPU resources. As a proof-of-concept, we implement a new resource configuration mechanism atop the widely used Kubernetes and Linux to demonstrate its potential benefits and shed light on future scheduler redesign. Our proof-of-concept, compared to the existing scheduler, improves the performance of both batch and interactive containerized apps by up to 5.6x and 13.7x.

摘要翻译： 容器化正变得越来越流行，但不幸的是，容器经常无法使用分配的资源交付预期的性能。在本文中，我们首先演示了在容器共存的多租户环境中，性能差异和性能下降是显著的(高达5倍)。然后，我们研究这种性能下降的根本原因。与通常认为这种退化是由资源争用和干扰引起的观点相反，我们发现容器预留的CPU数量与实际获得的CPU数量之间存在差距。根本原因在于当今Linux调度机制的设计选择，我们称之为强制运行队列共享和虚拟CPU时间。实际上，预留CPU资源的需求与完全公平调度程序的工作保护特性之间存在着根本的冲突，这种矛盾使容器无法充分利用其请求的CPU资源。作为概念验证，我们在广泛使用的Kubernetes和Linux上实现了一种新的资源配置机制，以展示其潜在的好处，并为未来重新设计调度器提供思路。与现有的调度程序相比，我们的概念验证将批处理和交互式容器化应用程序的性能分别提高了5.6倍和13.7倍。

Notes:

该文介绍了现有的Linux调度机制中CPU时间的计算方式和强制运行队列共享导致CFS调度算法下容器无法正确地预约需要的CPU资源数量。（对于CPU资源的管理角度来看相当关键）

## Secure Namespaced Kernel Audit for Containers

Authors: Soo Yee Lim; Bogdan Stelea; Xueyuan Han; Thomas Pasquier

Conference : SoCC '21

Tags:

Url: <https://dl.acm.org/doi/10.1145/3472883.3486976>

Abstract: Despite the wide usage of container-based cloud computing, container auditing for security analysis relies mostly on built-in host audit systems, which often lack the ability to capture high-fidelity container logs. State-of-the-art reference-monitor-based audit techniques greatly improve the quality of audit logs, but their system-wide architecture is too costly to be adapted for individual containers. Moreover, these techniques typically require extensive kernel modifications, making it difficult to deploy in practical settings. In this paper, we present saBPF (secure audit BPF), an extension of the eBPF framework capable of deploying secure system-level audit mechanisms at the container granularity. We demonstrate the practicality of saBPF in Kubernetes by designing an audit framework, an intrusion detection system, and a lightweight access control mechanism. We evaluate saBPF and show that it is comparable in performance and security guarantees to audit systems from the literature that are implemented directly in the kernel.

摘要翻译： 尽管基于容器的云计算被广泛使用，但用于安全分析的容器审计主要依赖于内置的主机审计系统，而这些系统通常缺乏捕获高保真容器日志的能力。最先进的基于参考监视器的审计技术极大地提高了审计日志的质量，但是它们的系统范围架构成本太高，无法适应于单个容器。此外，这些技术通常需要对内核进行大量修改，因此难以在实际环境中部署。在本文中，我们介绍了saBPF(安全审计BPF)，它是eBPF框架的扩展，能够在容器粒度上部署安全的系统级审计机制。我们通过设计一个审计框架、一个入侵检测系统和一个轻量级访问控制机制来演示saBPF在Kubernetes中的实用性。我们对saBPF进行了评估，并表明它在性能和安全保证方面与直接在内核中实现的审计系统相当。

Notes:

k8s中的安全审计功能，利用eBPF实现了容器粒度的全系统范围的日志审计框架（而非系统全局的）、指令探测系统和轻量级访问控制机制。

## Speedo: Fast dispatch and orchestration of serverless workflows

Authors: Nilanjan Daw; Umesh Bellur; Purushottam Kulkarni

Conference : SoCC '21

Tags: `useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/3472883.3486982>

Abstract: Structuring cloud applications as collections of interacting fine-grained microservices makes them scalable and affords the flexibility of hot upgrading parts of the application. The current avatar of serverless computing (FaaS) with its dynamic resource allocation and auto-scaling capabilities make it the deployment model of choice for such applications. FaaS platforms operate with user space dispatchers that receive requests over the network and make a dispatch decision to one of multiple workers (usually a container) distributed in the data center. With the granularity of microservices approaching execution times of a few milliseconds combined with loads approaching tens of thousands of requests a second, having a low dispatch latency of less than one millisecond becomes essential to keep up with line rates. When these microservices are part of a workflow making up an application, the orchestrator that coordinates the sequence in which microservices execute also needs to operate with microsecond latency. Our observations reveal that the most significant component of the dispatch/orchestration latency is the time it takes for the request to traverse into and out of the user space from the network. Motivated by the presence of a multitude of low power cores on today's SmartNICs, one approach to keeping up with these high line rates and the stringent latency expectations is to run both the dispatcher and the orchestrator close to the network on a SmartNIC. Doing so will save valuable cycles spent in transferring requests to and back from the user space. The operating characteristics of short-lived ephemeral state and low CPU burst requirements of FaaS dispatcher/orchestrator make them ideal candidates for offloading from the server to the NIC cores. This also brings other benefit of freeing up the server CPU. In this paper, we present Speedo--- a design for offloading of FaaS dispatch and orchestration services to the SmartNIC from the user space. We implemented Speedo on ASIC based Netronome Agilio SmartNICs and our comprehensive evaluation shows that Speedo brings down the dispatch latency from \~150ms to \~140μs at a load of 10K requests per second.

摘要翻译： 将云应用程序构建为相互作用的细粒度微服务的集合，使它们具有可伸缩性，并提供了热升级应用程序部分的灵活性。当前的无服务器计算(FaaS)具有动态资源分配和自动伸缩功能，这使其成为此类应用程序的首选部署模型。FaaS平台与用户空间调度程序一起操作，用户空间调度程序通过网络接收请求，并向分布在数据中心的多个工作器(通常是容器)中的一个做出调度决策。由于微服务的粒度接近几毫秒的执行时间，加上负载接近每秒数万个请求，因此拥有低于1毫秒的低调度延迟对于跟上线路速率至关重要。当这些微服务是组成应用程序的工作流的一部分时，协调微服务执行顺序的编排器也需要以微秒级延迟进行操作。我们的观察表明，调度/编排延迟中最重要的组成部分是请求从网络进出用户空间所花费的时间。由于今天的SmartNIC上存在大量低功耗核心，要跟上这些高线路速率和严格的延迟预期，一种方法是在SmartNIC上靠近网络运行调度程序和编排程序。这样做将节省在向用户空间传输请求和从用户空间返回请求所花费的宝贵周期。FaaS调度程序/编排程序的短暂临时状态和低CPU突发需求的操作特性使它们成为从服务器卸载到NIC内核的理想选择。这还带来了释放服务器CPU的其他好处。在本文中，我们提出了Speedo——一种将FaaS调度和编排服务从用户空间卸载到SmartNIC的设计。我们在基于ASIC的Netronome Agilio SmartNICs上实现了Speedo，我们的综合评估表明，在每秒10K请求的负载下，Speedo将调度延迟从~~150ms降低到~~140μs。

Notes:

FaaS的与smartNIC联动的内容，应该对我们项目没什么帮助

## SHOWAR: Right-Sizing And Efficient Scheduling of Microservices

Authors: Ataollah Fatahi Baarzi; George Kesidis

Conference : SoCC '21

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/3472883.3486999>

Abstract: Microservices architecture have been widely adopted in designing distributed cloud applications where the application is decoupled into multiple small components (i.e. "microservices"). One of the challenges in deploying microservices is finding the optimal amount of resources (i.e. size) and the number of instances (i.e. replicas) for each microservice in order to maintain a good performance as well as prevent resource wastage and under-utilization which is not cost-effective. This paper presents SHOWAR, a framework that configures the resources by determining the number of replicas (horizontal scaling) and the amount of CPU and Memory for each microservice (vertical scaling). For vertical scaling, SHOWAR uses empirical variance in the historical resource usage to find the optimal size and mitigate resource wastage. For horizontal scaling, SHOWAR uses basic ideas from control theory along with kernel level performance metrics. Additionally, once the size for each microservice is found, SHOWAR bridges the gap between optimal resource allocation and scheduling by generating affinity rules (i.e. hints) for the scheduler to further improve the performance. Our experiments, using a variety of microservice applications and real-world workloads, show that, compared to the state-of-the-art autoscaling and scheduling systems, SHOWAR on average improves the resource allocation by up to 22% while improving the 99th percentile end-to-end user request latency by 20%.

摘要翻译： 在设计分布式云应用程序时，微服务架构已被广泛采用，其中应用程序被解耦为多个小组件(例如:“microservices”)。部署微服务的挑战之一是为每个微服务找到最佳的资源量(即大小)和实例数量(即副本)，以保持良好的性能，并防止资源浪费和利用不足，这是不划算的。本文介绍了SHOWAR，一个通过确定每个微服务的副本数量(水平扩展)和CPU和内存数量(垂直扩展)来配置资源的框架。对于垂直扩展，SHOWAR使用历史资源使用的经验方差来找到最优大小并减少资源浪费。对于水平扩展，SHOWAR使用控制理论的基本思想以及内核级性能指标。此外，一旦找到每个微服务的大小，SHOWAR通过为调度器生成亲和规则(即提示)来弥合最优资源分配和调度之间的差距，从而进一步提高性能。我们使用各种微服务应用程序和实际工作负载进行的实验表明，与最先进的自动伸缩和调度系统相比，SHOWAR平均可将资源分配提高22%，同时将第99百分位的端到端用户请求延迟提高20%。

Notes:

微服务调度算法，做了横向扩展（replicaset）和纵向扩展（分配的CPU、内存等资源数）的调度。横向扩展用自定义的“亲和性”控制算法，纵向扩展用的历史资源分配情况。

## Cloud-Scale Runtime Verification of Serverless Applications

Authors: Kalev Alpernas; Aurojit Panda; Leonid Ryzhyk; Mooly Sagiv

Conference : SoCC '21

Tags: `debugger`

Url: <https://dl.acm.org/doi/10.1145/3472883.3486977>

Abstract: Serverless platforms aim to simplify the deployment, scaling, and management of cloud applications. Serverless applications are inherently distributed, and are executed using shortlived ephemeral processes. The use of short-lived ephemeral processes simplifies application scaling and management, but also means that existing approaches to monitoring distributed systems and detecting bugs cannot be applied to serverless applications. In this paper we propose Watchtower, a framework that enables runtime monitoring of serverless applications. Watchtower takes program properties as inputs, and can detect cases where applications violate these properties. We design Watchtower to minimize application changes, and to scale at the same rate as the application. We achieve the former by instrumenting libraries rather than application code, and the latter by structuring Watchtower as a serverless application. Once a bug is found, developers can use the Watchtower debugger to identify and address the root cause of the bug.

摘要翻译： 无服务器平台旨在简化云应用程序的部署、扩展和管理。无服务器应用程序本质上是分布式的，并且使用短暂的临时进程执行。使用短暂的临时流程简化了应用程序的扩展和管理，但也意味着现有的监视分布式系统和检测错误的方法不能应用于无服务器应用程序。在本文中，我们提出了Watchtower，这是一个支持无服务器应用程序运行时监控的框架。Watchtower将程序属性作为输入，并且可以检测应用程序违反这些属性的情况。我们设计Watchtower是为了尽量减少应用程序的更改，并以与应用程序相同的速率进行扩展。我们通过插装库而不是应用程序代码来实现前者，通过将Watchtower构建为无服务器应用程序来实现后者。一旦发现bug，开发人员就可以使用Watchtower调试器来识别并解决bug的根本原因。

Notes:

微服务的监控框架，由于检查要求的应用运行的属性是否满足，以及发现bug后使用其watchower调试器监测和解决问题

## Particle: ephemeral endpoints for serverless networking

Authors: Shelby Thomas; Lixiang Ao; Geoffrey M. Voelker; George Porter

Conference : SoCC '20

Tags: `QoS`

Url: <https://dl.acm.org/doi/10.1145/3419111.3421275>

Abstract: Burst-parallel serverless applications invoke thousands of short-lived distributed functions to complete complex jobs such as data analytics, video encoding, or compilation. While these tasks execute in seconds, starting and configuring the virtual network they rely on is a major bottleneck that can consume up to 84% of total startup time. In this paper we characterize the magnitude of this network cold start problem in three popular overlay networks, Docker Swarm, Weave, and Linux Overlay. We focus on end-to-end startup time that encompasses both the time to boot a group of containers as well as interconnecting them. Our primary observation is that existing overlay approaches for serverless networking scale poorly in short-lived serverless environments. Based on our findings we develop Particle, a network stack tailored for multi-node serverless overlay networks that optimizes network creation without sacrificing multi-tenancy, generality, or throughput. When integrated into a serverless burst-parallel video processing pipeline, Particle improves application runtime by 2.4--3X over existing overlays.

摘要翻译： 突发并行无服务器应用程序调用数千个短期分布式函数来完成复杂的作业，如数据分析、视频编码或编译。虽然这些任务可以在几秒钟内执行，但启动和配置它们所依赖的虚拟网络是一个主要瓶颈，可能会消耗高达84%的总启动时间。在本文中，我们描述了三种流行的覆盖网络(Docker Swarm, Weave和Linux overlay)中网络冷启动问题的严重程度。我们关注端到端启动时间，包括启动一组容器的时间以及连接它们的时间。我们的主要观察是，现有的无服务器网络覆盖方法在短期无服务器环境中扩展性很差。基于我们的发现，我们开发了Particle，这是一种为多节点无服务器覆盖网络量身定制的网络堆栈，可以在不牺牲多租户、通用性或吞吐量的情况下优化网络创建。当集成到无服务器突发并行视频处理管道时，Particle将应用程序的运行时间提高了2.4- 3倍。

Notes:

短寿命的微服务环境中多个应用程序之间的内部执行时间不是瓶颈，容器启动和网络互联（网络冷启动）所消耗的时间才是最主要的。particle是专门为这种多节点无服务的overlay网络场景设计的裁剪的网络协议栈，提高了网络互联的启动性能。

## Sequoia: enabling quality-of-service in serverless computing

Authors: Ali Tariq; Austin Pahl; Sharat Nimmagadda; Eric Rozner; Siddharth Lanka

Conference : SoCC '20

Tags: `QoS`

Url: <https://dl.acm.org/doi/10.1145/3419111.3421306>

Abstract: Serverless computing is a rapidly growing paradigm that easily harnesses the power of the cloud. With serverless computing, developers simply provide an event-driven function to cloud providers, and the provider seamlessly scales function invocations to meet demands as event-triggers occur. As current and future serverless offerings support a wide variety of serverless applications, effective techniques to manage serverless workloads becomes an important issue. This work examines current management and scheduling practices in cloud providers, uncovering many issues including inflated application run times, function drops, inefficient allocations, and other undocumented and unexpected behavior. To fix these issues, a new quality-of-service function scheduling and allocation framework, called Sequoia, is designed. Sequoia allows developers or administrators to easily def ne how serverless functions and applications should be deployed, capped, prioritized, or altered based on easily configured, flexible policies. Results with controlled and realistic workloads show Sequoia seamlessly adapts to policies, eliminates mid-chain drops, reduces queuing times by up to 6.4X, enforces tight chain-level fairness, and improves run-time performance up to 25X.

摘要翻译： 无服务器计算是一种快速发展的范例，它可以轻松地利用云的力量。使用无服务器计算，开发人员只需向云提供商提供事件驱动的功能，提供商就可以无缝地扩展功能调用，以满足事件触发器发生时的需求。由于当前和未来的无服务器产品支持各种各样的无服务器应用程序，因此管理无服务器工作负载的有效技术成为一个重要问题。这项工作检查了云提供商当前的管理和调度实践，揭示了许多问题，包括应用程序运行时间过长、功能下降、分配效率低下以及其他未记录的和意外的行为。为了解决这些问题，设计了一个新的服务质量功能调度和分配框架，称为Sequoia。Sequoia允许开发人员或管理员轻松定义无服务器功能和应用程序应该如何部署、限制、优先级或基于易于配置的灵活策略进行更改。控制和实际工作负载的结果显示，Sequoia无缝地适应策略，消除了中间链下降，将排队时间减少了6.4倍，强制执行严格的链级公平性，并将运行时性能提高了25倍。

Notes:

对现有的serverless的调度和资源管理方式的缺陷进行了总结（<span class="highlight" data-annotation="%7B%22attachmentURI%22%3A%22http%3A%2F%2Fzotero.org%2Fusers%2F14190829%2Fitems%2FGJ64ZCWH%22%2C%22pageLabel%22%3A%22311%22%2C%22position%22%3A%7B%22pageIndex%22%3A0%2C%22rects%22%3A%5B%5B69.048%2C381.466%2C294.044%2C391.498%5D%2C%5B53.798%2C369.51%2C100.786%2C379.542%5D%5D%7D%2C%22citationItem%22%3A%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F14190829%2Fitems%2F247VGQTY%22%5D%2C%22locator%22%3A%22311%22%7D%7D" ztype="zhighlight"><a href="zotero://open-pdf/library/items/GJ64ZCWH?page=1">“inflated application run times, function drops, inefficient allocations,”</a></span>等）并开发了一个自己的serverless调度器

## Bypassing the load balancer without regrets

Authors: Marios Kogias; Rishabh Iyer; Edouard Bugnion

Conference : SoCC '20

Tags: `QoS`

Url: <https://dl.acm.org/doi/10.1145/3419111.3421304>

Abstract: Load balancers are a ubiquitous component of cloud deployments and the cornerstone of workload elasticity. Load balancers can significantly affect the end-to-end application latency with their load balancing decisions, and constitute a significant portion of cloud tenant expenses. We propose CRAB, an alternative L4 load balancing scheme that eliminates latency overheads and scalability bottlenecks while simultaneously enabling the deployment of complex, stateful load balancing policies. A CRAB load balancer only participates in the TCP connection establishment phase and stays off the connection's datapath. Thus, load balancer provisioning depends on the rate of new connections rather than the actual connection bandwidth. CRAB depends on a new TCP option that enables connection redirection. We provide different implementations for a CRAB load balancer on different technologies, e.g., P4, DPDK, and eBPF, showing that a CRAB load balancer does not require many resources to perform well. We introduce the connection redirection option to the Linux kernel with minor modifications, so that it that can be shipped with the VM images offered by the cloud providers. We show how the same functionality can be achieved with a vanilla Linux kernel using a Netfilter module, while we discuss how CRAB can work while clients and servers remain completely agnostic, based on functionality added on the host. Our evaluation shows that CRAB pushes the IO bottleneck from the load balancer to the servers in cases where vanilla L4 load balancing does not scale and provides end-to-end latencies that are close to direct communication while retaining all the scheduling benefits of stateful L4 load balancing.

摘要翻译： 负载平衡器是云部署中无处不在的组件，也是工作负载弹性的基石。负载平衡器通过其负载平衡决策可以显著影响端到端应用程序延迟，并构成云租户费用的很大一部分。我们提出了一种可替代的L4负载平衡方案CRAB，它消除了延迟开销和可伸缩性瓶颈，同时支持部署复杂的有状态负载平衡策略。CRAB负载均衡器只参与TCP连接建立阶段，不参与连接的数据路径。因此，负载平衡器的配置取决于新连接的速率，而不是实际的连接带宽。CRAB依赖于一个启用连接重定向的新TCP选项。我们在不同的技术(如P4、DPDK和eBPF)上为螃蟹负载平衡器提供了不同的实现，表明螃蟹负载平衡器不需要很多资源就能运行良好。我们对Linux内核引入了连接重定向选项，并进行了一些修改，以便它可以与云提供商提供的VM映像一起发布。我们将展示如何使用Netfilter模块使用普通Linux内核实现相同的功能，同时我们将讨论在客户端和服务器完全不可知的情况下，基于主机上添加的功能，CRAB如何工作。我们的评估表明，在普通L4负载平衡无法扩展的情况下，CRAB将IO瓶颈从负载平衡器推到了服务器上，并提供了接近直接通信的端到端延迟，同时保留了有状态L4负载平衡的所有调度优势。

Notes:

TCP层负载均衡，消除了原本负载均衡的延迟开销和扩展性瓶颈。只在连接建立时介入（依赖于TCP重定向选项），负载均衡考虑连接的建立速率而不是数据连接带宽，不影响数据通路传输。（文中提到了3种实现方法：P4、DPDK、eBPF，三种方式的资源需求量都不大）提供了TCP连接重定向功能的Linux内核选项。

## Perphon: a ML-based Agent for Workload Co-location via Performance Prediction and Resource Inference

Authors: Jianyong Zhu; Renyu Yang; Chunming Hu; Tianyu Wo; Shiqing Xue; Jin Ouyang; Jie Xu

Conference : SoCC '19

Tags: `important`,`scheduler`

Url: <https://dl.acm.org/doi/10.1145/3357223.3365440>

Abstract: Cluster administrators are facing great pressures to improve cluster utilization through workload co-location. Guaranteeing performance of long-running applications (LRAs), however, is far from settled as unpredictable interference across applications is catastrophic to QoS \[2]. Current solutions such as \[1] usually employ sandboxed and offline profiling for different workload combinations and leverage them to predict incoming interference. However, the time complexity restricts the applicability to complex co-locations. Hence, this issue entails a new framework to harness runtime performance and mitigate the time cost with machine intelligence: i) It is desirable to explore a quantitative relationship between allocated resource and consequent workload performance, not relying on analyzing interference derived from different workload combinations. The majority of works, however, depend on offline profiling and training which may lead to model aging problem. Moreover, multi-resource dimensions (e.g., LLC contention) that are not completely included by existing works but have impact on performance interference need to be considered \[3]. ii) Workload co-location also necessitates fine-grained isolation and access control mechanism. Once performance degradation is detected, dynamic resource adjustment will be enforced and application will be assigned an access to specific slices of each resources. Inferring a "just enough" amount of resource adjustment ensures the application performance can be secured whilst improving cluster utilization. We present Perphon, a runtime agent on a per node basis, that decouples ML-based performance prediction and resource inference from centralized scheduler. Figure 1 outlines the proposed architecture. We initially exploit sensitivity of applications to multi-resources to establish performance prediction. To achieve this, Metric Monitor aggregates application fingerprint and system-level performance metrics including CPU, memory, Last Level Cache (LLC), memory bandwidth (MBW) and number of running threads, etc. They are enabled by Intel-RDT and precisely obtained from resource group manager. Perphon employs an Online Gradient Boost Regression Tree (OGBRT) approach to resolve model aging problem. Res-Perf Model warms up via offline learning that merely relies on a small volume of profiling in the early stage, but evolves with arrival of workloads. Consequently, parameters will be automatically updated and synchronized among agents. Anomaly Detector can timely pinpoint a performance degradation via LSTM time-series analysis and determine when and which application need to be re-allocated resources. Once abnormal performance counter or load is detected, Resource Inferer conducts a gradient ascend based inference to work out a proper slice of resources, towards dynamically recovering targeted performance. Upon receiving an updated re-allocation, Access Controller re-assigns a specific portion of the node resources to the affected application. Eventually, Isolation Executor enforces resource manipulation and ensures performance isolation across applications. Specifically, we use cgroup cpuset and memory subsystem to control usage of CPU and memory while leveraging Intel-RDT technology to underpin the manipulation of LLC and MBW. For fine-granularity management, we create different groups for LRA and batch jobs when the agent starts. Our prototype integration with Node Manager of Apache YARN shows that throughput of Kafka data-streaming application in Perphon is 2.0x and 1.82x times that of isolation execution schemes in native YARN and pure cgroup cpu subsystem.

摘要翻译： 集群管理员面临着通过工作负载协同定位提高集群利用率的巨大压力。然而，保证长时间运行的应用程序(lra)的性能远未解决，因为应用程序之间不可预测的干扰对QoS是灾难性的\[2]。目前的解决方案，如\[1]通常采用沙盒和离线分析不同的工作负载组合，并利用它们来预测传入的干扰。然而，时间的复杂性限制了该方法在复杂共址中的适用性。因此，这个问题需要一个新的框架来利用运行时性能和减少机器智能的时间成本:i)我们希望探索分配的资源和随之而来的工作负载性能之间的定量关系，而不是依赖于分析来自不同工作负载组合的干扰。然而，大多数工作依赖于离线分析和训练，这可能导致模型老化问题。此外，还需要考虑现有作品未完全包含但对性能干扰有影响的多资源维度(如LLC争用)\[3]。ii)工作负载共存还需要细粒度隔离和访问控制机制。一旦检测到性能下降，将强制执行动态资源调整，并为应用程序分配对每个资源的特定切片的访问权限。推断“刚刚好”的资源调整量可以确保应用程序性能，同时提高集群利用率。我们提出了Perphon，一个基于每个节点的运行时代理，它将基于ml的性能预测和资源推断与集中式调度程序解耦。图1概述了建议的体系结构。我们首先利用应用程序对多资源的敏感性来建立性能预测。为了实现这一点，Metric Monitor聚合了应用程序指纹和系统级性能指标，包括CPU、内存、最后一级缓存(LLC)、内存带宽(MBW)和运行线程数等。它们由Intel-RDT启用，并精确地从资源组管理器中获取。Perphon采用在线梯度增强回归树(OGBRT)方法来解决模型老化问题。Res-Perf模型通过离线学习进行预热，在早期阶段仅依赖于少量的分析，但随着工作负载的到来而发展。因此，参数将在代理之间自动更新和同步。异常检测器可以通过LSTM时间序列分析及时查明性能下降，并确定何时以及哪些应用程序需要重新分配资源。一旦检测到异常的性能计数器或负载，Resource Inferer进行基于梯度上升的推理，计算出适当的资源切片，以动态恢复目标性能。在收到更新的重新分配后，访问控制器将节点资源的特定部分重新分配给受影响的应用程序。最终，隔离执行器强制执行资源操作，并确保跨应用程序的性能隔离。具体来说，我们使用cgroup cpuset和内存子系统来控制CPU和内存的使用，同时利用Intel-RDT技术来支持LLC和MBW的操作。对于细粒度管理，我们在代理启动时为LRA和批处理作业创建不同的组。我们与Apache YARN的Node Manager的原型集成表明，Perphon中Kafka数据流应用的吞吐量是原生YARN和纯cgroup cpu子系统隔离执行方案的2.0倍和1.82倍。

Notes:

提出了Perpon，一个基于每个节点的运行时代理，它将基于ML的性能预测和资源推理与集中式调度器解耦。主要是基于硬件的性能测量（Intel的RDT）得到CPU、内存、LLC、内存带宽、运行的线程数等数据作为性能预测的源数据。还额外做了模型退化（老化）的解决

## The Curious Case of Container Orchestration and Scheduling in GPU-based Datacenters

Authors: Prashanth Thinakaran; Jashwant Raj; Bikash Sharma; Mahmut T. Kandemir; Chita R. Das

Conference : SoCC '18

Tags: `useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/3267809.3275466>

Abstract: Modern data centers are increasingly being provisioned with compute accelerators such as GPUs, FPGAs and ASIC's to catch up with the workload performance demands and reduce the total cost of ownership (TCO). By 2021, traffic within hyperscale datacenters is expected to quadruple with 94% of workloads moving to cloud-based datacenters according to Cisco's global cloud index. A majority of these workloads include data mining, image processing, speech recognition and gaming which uses GPUs for high throughput computing. This trend is evident as public cloud operators like Amazon and Microsoft have started to offer GPU-based infrastructure services in the recent times. The GPU-bound applications in general, can either be batch or latency-sensitive. Typically the latency-critical applications subscribe to datacenter resources in the form of queries (e.g. inference requests from a DNN model). For example, a wearable health monitoring device aggregates several sensor data through a mobile application. In case of a data anomaly, inference services can be triggered from the mobile device to the cloud, requesting for a deep neural network (DNN) model that fits the symptom. Such inference requests which are GPU bound impose strict Service Level Agreements (SLAs) that is typically set around 150 to 500ms. In contrast to the regular datacenter batch workloads, these user-facing applications are typically hosted as services that occur and scale in short bursts. On the other hand, batch applications are HPC based compute-bound workloads which are throughput oriented. In a typical datacenter, these both applications might co-exist on the same device depends on the orchestration and scheduling policy. With the expected increase in such workloads, this GPU resource management problem is expected to exacerbate. Hence, GPUs/accelerators are on the critical path to ensure the performance and meet the end-to-end latency demands of such queries. State-of-the-art resource orchestrators are agnostic of GPUs and their resource utilization footprints, and thus not equipped to dynamically orchestrate these accelerator-bound containers. On the other hand, job schedulers at the datacenter are heavily optimized and tuned for CPU-based systems. Kubernetes and Mesos by default does uniform task scheduling which statically assigns the GPU resources to the applications. The scheduled tasks access the GPUs via PCIe pass-through which gives the application complete access to the GPU as seen in Figure 1. Hence the resource utilization of the GPU is based on the parallelism of the application which is scheduled to run on it. In case of CPUs, Kubernetes has support for dynamic orchestration with the features such as node affinity, pod affinity, and pod preemption. However, these features cannot be extended for GPUs. This is because, it neither has the support for pod preemption nor the ability to query the real-time GPU metrics such as memory, symmetric multiprocessor (SM) utilization, PCIe bandwidth, etc. Moreover, the containers often overstate their GPU resource requirements such as memory, and this leads to severe resource underutilization which leads to multiple QoS violations because of queuing delays. We identify that by employing CPU-based scheduling policies for GPU-bound workloads would fail to yield high accelerator utilization and lead to poor performance per watt per query. Motivated by this, we propose a GPU-aware resource orchestration layer which enables the resource scheduler to take advantage of the GPUs by knowing their real-time utilization. We further discuss the ideal scheduler properties for a GPU rich datacenter and list the challenges in developing such a production-grade GPU-based datacenter scheduler. Therefore we modify the well-known Google's Kubernetes datacenter-level resource orchestrator by making it GPU-aware by exposing GPU driver APIs. Based on our observations from Alibaba's cluster traces and real hardware GPU cluster experiments, we build Knots, a GPU-aware resource orchestration layer and integrate it with Kubernetes container orchestrator. In addition, we also evaluate three GPU-based scheduling schemes to schedule datacenter representative GPU workload mixes through Kube-Knots. Evaluations on a ten node GPU cluster demonstrate that Knots together with our proposed GPU-aware scheduling scheme improves the cluster-wide GPU utilization while significantly reducing the cluster-wide power consumption across three different workload mixes when compared against Kubernetes's default uniform scheduler.

摘要翻译： 现代数据中心越来越多地配备gpu、fpga和ASIC等计算加速器，以满足工作负载性能需求并降低总拥有成本(TCO)。根据思科的全球云指数，到2021年，超大规模数据中心内的流量预计将翻两番，94%的工作负载将转移到基于云的数据中心。这些工作负载中的大多数包括数据挖掘、图像处理、语音识别和使用gpu进行高吞吐量计算的游戏。随着亚马逊和微软等公共云运营商最近开始提供基于gpu的基础设施服务，这一趋势非常明显。一般来说，绑定gpu的应用程序可以是批处理的，也可以是延迟敏感的。通常，延迟关键型应用程序以查询的形式订阅数据中心资源(例如，来自DNN模型的推理请求)。例如，可穿戴健康监测设备通过移动应用程序聚合多个传感器数据。在数据异常的情况下，可以从移动设备到云触发推理服务，请求符合症状的深度神经网络(DNN)模型。这种GPU绑定的推理请求强制执行严格的服务水平协议(sla)，通常设置在150到500ms左右。与常规的数据中心批处理工作负载相比，这些面向用户的应用程序通常作为服务托管，在短时间内发生和扩展。另一方面，批处理应用程序是基于HPC的计算绑定工作负载，它是面向吞吐量的。在典型的数据中心中，这两个应用程序可能共存于同一设备上，这取决于业务流程和调度策略。随着这种工作负载的预期增加，GPU资源管理问题预计会加剧。因此，gpu /加速器处于关键路径上，以确保性能并满足此类查询的端到端延迟需求。最先进的资源编排器不知道gpu及其资源利用足迹，因此不能动态地编排这些加速器绑定的容器。另一方面，数据中心的作业调度器针对基于cpu的系统进行了大量优化和调优。Kubernetes和Mesos默认执行统一的任务调度，静态地将GPU资源分配给应用程序。计划任务通过PCIe直通访问GPU，这使应用程序完全访问GPU，如图1所示。因此，GPU的资源利用率是基于计划在其上运行的应用程序的并行性。在cpu方面，Kubernetes支持动态编排，包括节点关联、pod关联和pod抢占等特性。但是，这些特性不能扩展到gpu。这是因为，它既不支持pod抢占，也不能查询实时GPU指标，如内存、对称多处理器(SM)利用率、PCIe带宽等。此外，容器经常夸大其GPU资源需求(如内存)，这会导致严重的资源利用不足，从而由于排队延迟而导致多个QoS违规。我们发现，为gpu绑定的工作负载采用基于cpu的调度策略将无法产生高加速器利用率，并导致每次查询的每瓦性能较差。受此启发，我们提出了一个gpu感知的资源编排层，它使资源调度程序能够通过了解gpu的实时利用率来利用gpu。我们进一步讨论了富GPU数据中心的理想调度器属性，并列出了开发这种基于GPU的生产级数据中心调度器所面临的挑战。因此，我们修改了著名的Google的Kubernetes数据中心级资源编排器，通过暴露GPU驱动程序api使其能够感知GPU。根据我们对阿里巴巴集群跟踪和真实硬件GPU集群实验的观察，我们构建了一个感知GPU的资源编排层Knots，并将其与Kubernetes容器编排器集成。此外，我们还评估了三种基于GPU的调度方案，通过Kube-Knots调度数据中心代表性GPU工作负载混合。对10个节点GPU集群的评估表明，与Kubernetes的默认统一调度器相比，与我们提出的GPU感知调度方案一起，Knots提高了集群范围内的GPU利用率，同时显着降低了跨三种不同工作负载混合的集群范围内的功耗。

Notes:

不知道为什么，这篇只有个摘要

## The Elasticity and Plasticity in Semi-Containerized Co-locating Cloud Workload: a View from Alibaba Trace

Authors: Qixiao Liu; Zhibin Yu

Conference : SoCC '18

Tags: `QoS`,`scheduler`

Url: <https://dl.acm.org/doi/10.1145/3267809.3267830>

Abstract: Cloud computing with large-scale datacenters provides great convenience and cost-efficiency for end users. However, the resource utilization of cloud datacenters is very low, which wastes a huge amount of infrastructure investment and energy to operate. To improve resource utilization, cloud providers usually co-locate workloads of different types on shared resources. However, resource sharing makes the quality of service (QoS) unguaranteed. In fact, improving resource utilization (IRU) and guaranteeing QoS at the same time in cloud has been a dilemma which we name an IRU-QoS curse. To tackle this issue, characterizing the workloads from real production cloud computing platforms is extremely important. In this work, we analyze a recently released 24-hour trace dataset from a production cluster in Alibaba. We reveal three key findings which are significantly different from those from the Google trace. First, each online service runs in a container while batch jobs run on physical servers. Further, they are concurrently managed by two different schedulers and co-located on same servers, which we call semi-containerized co-location. Second, batch instances largely use the spare resources that containers reserved but not used, which shows the elasticity feature of resource allocation of the Alibaba cluster. Moreover, through resource overprovisioning, overbooking, and overcommitment, the resource allocation of the Alibaba cluster achieves high elasticity. Third, as the high elasticity may hurt the performance of co-located online services, the Alibaba cluster sets bounds of resources used by batch tasks to guarantee the steady performance of both online services and batch tasks, which we call plasticity of resource allocation.

摘要翻译： 具有大规模数据中心的云计算为最终用户提供了极大的便利和成本效益。然而，云数据中心的资源利用率很低，浪费了大量的基础设施投资和能源来运营。为了提高资源利用率，云提供商通常将不同类型的工作负载放在共享资源上。然而，资源共享使得服务质量(QoS)得不到保证。实际上，在云环境中，提高资源利用率(IRU)和保证服务质量(QoS)一直是一个难题，我们称之为“IRU-QoS诅咒”。要解决这个问题，描述来自实际生产云计算平台的工作负载是非常重要的。在这项工作中，我们分析了最近发布的来自阿里巴巴生产集群的24小时跟踪数据集。我们揭示了三个关键发现，这些发现与谷歌追踪的发现有很大不同。首先，每个在线服务在容器中运行，而批处理作业在物理服务器上运行。此外，它们由两个不同的调度器并发管理，并位于相同的服务器上，我们称之为半容器化的协同位置。其次，批处理实例大量使用了容器保留而未使用的空闲资源，这体现了阿里集群资源分配的弹性特性。此外，通过资源超分配、超预订和超承诺，阿里巴巴集群的资源分配实现了高弹性。第三，由于高弹性会影响同址在线服务的性能，阿里巴巴集群设置了批处理任务使用的资源边界，以保证在线服务和批处理任务的性能稳定，我们称之为资源分配的可塑性。

Notes:

对现有的阿里巴巴的生产集群24小时的trace进行分析，探究当前系统的特点：半容器化——批处理应用不容器化而其他应用容器化，两套调度算法，批处理应用可以使用容器应用申请但尚未使用的资源，提高了弹性。

## DC-DRF: Adaptive Multi-Resource Sharing at Public Cloud Scale

Authors: Ian A. Kash; Greg O'Shea; Stavros Volos

Conference : SoCC '18

Tags: `QoS`

Url: <https://dl.acm.org/doi/10.1145/3267809.3267848>

Abstract: Public cloud datacenters implement a distributed computing environment built for economy at scale, with hundreds of thousands of compute and storage servers and a large population of predominantly small customers often densely packed to a compute server. Several recent contributions have investigated how equitable sharing and differentiated services can be achieved in this multi-resource environment, using the Extended Dominant Resource Fairness (EDRF) algorithm. However, we find that EDRF requires prohibitive execution time when employed at datacenter scale due to its iterative nature and polynomial time complexity; its closed-form expression does not alter its asymptotic complexity. In response, we propose Deadline-Constrained DRF, or DC-DRF, an adaptive approximation of EDRF designed to support centralized multi-resource allocation at datacenter scale in bounded time. The approximation introduces error which can be reduced using a high-performance implementation, drawing on parallelization techniques from the field of High-Performance Computing and vector arithmetic instructions available in modern server processors. We evaluate DC-DRF at scales that exceed those previously reported by several orders of magnitude, calculating resource allocations for one million predominantly small tenants and one hundred thousand resources, in seconds. Our parallel implementation preserves the properties of EDRF up to a small error, and empirical results show that the error introduced by approximation is insignificant for practical purposes.

摘要翻译： 公共云数据中心实现了为大规模经济而构建的分布式计算环境，其中有数十万台计算和存储服务器，以及大量以小型客户为主的客户通常密集地挤在一台计算服务器上。最近的一些贡献研究了如何使用扩展主导资源公平(EDRF)算法在这种多资源环境中实现公平共享和差异化服务。然而，我们发现EDRF由于其迭代性质和多项式时间复杂度，在数据中心规模上使用时需要令人望而却步的执行时间;它的闭形式表达式不改变它的渐近复杂性。作为回应，我们提出了截止日期约束DRF或DC-DRF，这是EDRF的自适应近似，旨在支持在有限时间内数据中心规模的集中多资源分配。这种近似引入的误差可以通过高性能实现来减小，利用高性能计算领域的并行化技术和现代服务器处理器中可用的矢量算术指令。我们评估DC-DRF的规模超出了先前报道的几个数量级，在几秒钟内计算出100万个主要是小租户和10万个资源的资源分配。我们的并行实现保留了EDRF的特性，误差很小，经验结果表明，近似引入的误差对于实际目的来说是微不足道的。

Notes:

改进现有的资源分配算法EDRF（扩展域资源公平，特点是公平共享+差异化服务），使它算法时间复杂度降低能够在大规模集群上使用。

## Henge: Intent-driven Multi-Tenant Stream Processing

Authors: Faria Kalim; Le Xu; Sharanya Bathey; Richa Meherwal; Indranil Gupta

Conference : SoCC '18

Tags: `important`,`QoS`,`scheduler`

Url: <https://dl.acm.org/doi/10.1145/3267809.3267832>

Abstract: We present Henge, a system to support intent-based multi-tenancy in modern distributed stream processing systems. Henge supports multi-tenancy as a first-class citizen: everyone in an organization can now submit their stream processing jobs to a single, shared, consolidated cluster. Secondly, Henge allows each job to specify its own intents (i.e., requirements) as a Service Level Objective (SLO) that captures latency and/or throughput needs. In such an intent-driven multi-tenant cluster, the Henge scheduler adapts continually to meet jobs' respective SLOs in spite of limited cluster resources, and under dynamically varying workloads. SLOs are soft and are based on utility functions. Henge's overall goal is to maximize the total system utility achieved by all jobs in the system. Henge is integrated into Apache Storm and we present experimental results using both production jobs from Yahoo! and real datasets from Twitter.

摘要翻译： 我们提出了Henge，一个支持现代分布式流处理系统中基于意图的多租户的系统。Henge作为一流公民支持多租户:组织中的每个人现在都可以将他们的流处理作业提交到单个、共享的、整合的集群。其次，Henge允许每个作业指定自己的意图(即需求)作为捕获延迟和/或吞吐量需求的服务水平目标(Service Level Objective, SLO)。在这样一个意图驱动的多租户集群中，尽管集群资源有限，并且在动态变化的工作负载下，Henge调度器会不断适应以满足作业各自的slo。slo是软的，基于实用函数。Henge的总体目标是最大化系统中所有作业实现的总系统效用。Henge集成到Apache Storm中，我们展示了使用Yahoo!以及来自Twitter的真实数据集。

Notes:

一个基于用户需求的多租户集群调度器（已经集成到Apache storm里了）

## WorkloadCompactor: reducing datacenter cost while providing tail latency SLO guarantees

Authors: Timothy Zhu; Michael A. Kozuch; Mor Harchol-Balter

Conference : SoCC '17

Tags: `QoS`

Url: <https://dl.acm.org/doi/10.1145/3127479.3132245>

Abstract: Service providers want to reduce datacenter costs by consolidating workloads onto fewer servers. At the same time, customers have performance goals, such as meeting tail latency Service Level Objectives (SLOs). Consolidating workloads while meeting tail latency goals is challenging, especially since workloads in production environments are often bursty. To limit the congestion when consolidating workloads, customers and service providers often agree upon rate limits. Ideally, rate limits are chosen to maximize the number of workloads that can be co-located while meeting each workload's SLO. In reality, neither the service provider nor customer knows how to choose rate limits. Customers end up selecting rate limits on their own in some ad hoc fashion, and service providers are left to optimize given the chosen rate limits. This paper describes WorkloadCompactor, a new system that uses workload traces to automatically choose rate limits simultaneously with selecting onto which server to place workloads. Our system meets customer tail latency SLOs while minimizing datacenter resource costs. Our experiments show that by optimizing the choice of rate limits, WorkloadCompactor reduces the number of required servers by 30--60% as compared to state-of-the-art approaches.

摘要翻译： 服务提供商希望通过将工作负载整合到更少的服务器上来降低数据中心成本。同时，客户有性能目标，例如满足尾延迟服务水平目标(slo)。在满足尾部延迟目标的同时整合工作负载是具有挑战性的，特别是因为生产环境中的工作负载通常是突发的。为了在合并工作负载时限制拥塞，客户和服务提供商通常会商定速率限制。理想情况下，选择速率限制是为了在满足每个工作负载的SLO的同时，最大限度地增加可共存的工作负载数量。实际上，服务提供商和客户都不知道如何选择费率限制。客户最终会以某种特别的方式自行选择费率限制，而服务提供商则会根据所选的费率限制进行优化。本文介绍了WorkloadCompactor，一个利用工作负载跟踪来自动选择速率限制的新系统，同时选择将工作负载放在哪个服务器上。我们的系统满足客户尾部延迟slo，同时最大限度地降低数据中心资源成本。我们的实验表明，与最先进的方法相比，通过优化速率限制的选择，WorkloadCompactor将所需服务器的数量减少了30- 60%。

Notes:

利用工作负载的trace数据做资源限制和选择应当运行该工作负载的server，主旨是降低集群的服务器数量来满足相同性能需求

## SLO-aware colocation of data center tasks based on instantaneous processor requirements

Authors: Pawel Janus; Krzysztof Rzadca

Conference : SoCC '17

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/3127479.3132244>

Abstract: In a cloud data center, a single physical machine simultaneously executes dozens of highly heterogeneous tasks. Such colocation results in more efficient utilization of machines, but, when tasks' requirements exceed available resources, some of the tasks might be throttled down or preempted. We analyze version 2.1 of the Google cluster trace that shows short-term (1 second) task CPU usage. Contrary to the assumptions taken by many theoretical studies, we demonstrate that the empirical distributions do not follow any single distribution. However, high percentiles of the total processor usage (summed over at least 10 tasks) can be reasonably estimated by the Gaussian distribution. We use this result for a probabilistic fit test, called the Gaussian Percentile Approximation (GPA), for standard bin-packing algorithms. To check whether a new task will fit into a machine, GPA checks whether the resulting distribution's percentile corresponding to the requested service level objective, SLO is still below the machine's capacity. In our simulation experiments, GPA resulted in colocations exceeding the machines' capacity with a frequency similar to the requested SLO.

摘要翻译： 在云数据中心中，一台物理机器同时执行数十个高度异构的任务。这样的托管可以更有效地利用机器，但是，当任务的需求超过可用资源时，一些任务可能会被抑制或抢占。我们分析了Google集群跟踪的2.1版本，它显示了短期(1秒)任务CPU使用情况。与许多理论研究的假设相反，我们证明了经验分布不遵循任何单一分布。但是，总处理器使用的高百分位数(至少10个任务的总和)可以通过高斯分布合理地估计出来。我们将此结果用于标准装箱算法的概率拟合检验，称为高斯百分位近似(GPA)。为了检查新任务是否适合机器，GPA检查结果分布的百分位数是否与请求的服务水平目标相对应，SLO仍然低于机器的容量。在我们的模拟实验中，GPA导致的并发超过了机器的容量，其频率与所请求的SLO相似。

Notes:

可以通过高斯分布合理地估计总处理器使用的高百分位数（在至少10个任务上求和）。我们将此结果用于标准装箱算法的概率拟合测试，称为高斯百分位近似（GPA）。为了检查新任务是否适合机器，GPA检查与请求的服务级别目标SLO相对应的结果分布的百分比是否仍低于机器的容量。在我们的模拟实验中，GPA导致主机代管超过了机器的容量，频率与所要求的SLO相似。

以概率为基础的调度算法，看看当前的总体概率分布是否还能满足SLO要求，能就加入并重新计算总体概率分布，不能就找别的节点或者准入限制。

> 思路挺新颖的，说不定也是一种合适的方法

## SNC-Meister: Admitting More Tenants with Tail Latency SLOs

Authors: Timothy Zhu; Daniel S. Berger; Mor Harchol-Balter

Conference : SoCC '16

Tags: `QoS`

Url: <https://dl.acm.org/doi/10.1145/2987550.2987585>

Abstract: Meeting tail latency Service Level Objectives (SLOs) in shared cloud networks is both important and challenging. One primary challenge is determining limits on the multi-tenancy such that SLOs are met. Doing so involves estimating latency, which is difficult, especially when tenants exhibit bursty behavior as is common in production environments. Nevertheless, recent papers in the past two years (Silo, QJump, and PriorityMeister) show techniques for calculating latency based on a branch of mathematical modeling called Deterministic Network Calculus (DNC). The DNC theory is designed for adversarial worst-case conditions, which is sometimes necessary, but is often overly conservative. Typical tenants do not require strict worst-case guarantees, but are only looking for SLOs at lower percentiles (e.g., 99th, 99.9th). This paper describes SNC-Meister, a new admission control system for tail latency SLOs. SNC-Meister improves upon the state-of-the-art DNC-based systems by using a new theory, Stochastic Network Calculus (SNC), which is designed for tail latency percentiles. Focusing on tail latency percentiles, rather than the adversarial worst-case DNC latency, allows SNC-Meister to pack together many more tenants: in experiments with production traces, SNC-Meister supports 75% more tenants than the state-of-the-art.

摘要翻译： 在共享云网络中，满足尾部延迟服务水平目标(Service Level goals, slo)既重要又具有挑战性。一个主要挑战是确定多租户的限制，以便满足slo。这样做涉及到估计延迟，这是很困难的，特别是当租户表现出生产环境中常见的突发行为时。然而，过去两年的最新论文(Silo、QJump和PriorityMeister)展示了基于称为确定性网络演算(Deterministic Network Calculus, DNC)的数学建模分支计算延迟的技术。DNC理论是为对抗的最坏情况而设计的，这有时是必要的，但往往过于保守。典型的租户并不要求严格的最坏情况保证，而是只寻找较低百分位数的slo(例如，第99、99.9)。本文介绍了一种新的尾延迟slo准入控制系统SNC-Meister。SNC- meister通过使用一种新的理论，随机网络演算(SNC)改进了最先进的基于dnc的系统，该理论是为尾部延迟百分位数设计的。专注于尾部延迟百分位数，而不是对抗最坏情况的DNC延迟，允许SNC-Meister打包更多的租户:在生产跟踪的实验中，SNC-Meister支持的租户比最先进的多75%。

Notes:

实现一个租户准入策略。改进当时最好的DNC为SNC，增加了随机性，因为尾部延迟也是概率性的

## Evaluating the impact of fine-scale burstiness on cloud elasticity

Authors: Sadeka Islam; Srikumar Venugopal; Anna Liu

Conference : SoCC '15

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/2806777.2806846>

Abstract: Elasticity is the defining feature of cloud computing. Performance analysts and adaptive system designers rely on representative benchmarks for evaluating elasticity for cloud applications under realistic reproducible workloads. A key feature of web workloads is burstiness or high variability at fine timescales. In this paper, we explore the innate interaction between fine-scale burstiness and elasticity and quantify the impact from the cloud consumer's perspective. We propose a novel methodology to model workloads with fine-scale burstiness so that they can resemble the empirical stylized facts of the arrival process. Through an experimental case study, we extract insights about the implications of fine-scale burstiness for elasticity penalty and adaptive resource scaling. Our findings demonstrate the detrimental effect of fine-scale burstiness on the elasticity of cloud applications.

摘要翻译： 弹性是云计算的定义特性。性能分析师和自适应系统设计人员依靠代表性基准来评估实际可再现工作负载下云应用程序的弹性。web工作负载的一个关键特征是在精细时间尺度上的突发性或高可变性。在本文中，我们探讨了精细尺度突发性和弹性之间的内在相互作用，并从云消费者的角度量化了其影响。我们提出了一种新的方法来模拟工作负载与精细尺度爆发，使他们可以类似于经验程式化的事实的到达过程。通过一个实验案例研究，我们提取了精细尺度突发性对弹性惩罚和自适应资源缩放的影响的见解。我们的研究结果证明了精细尺度的突发性对云应用弹性的有害影响。

Notes:

研究了某种细粒度的资源利用率突然增加对云的弹性penalty和自适应资源伸缩的影响，对调度器可能有参考意义

## Tarcil: reconciling scheduling speed and quality in large shared clusters

Authors: Christina Delimitrou; Daniel Sanchez; Christos Kozyrakis

Conference : SoCC '15

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/2806777.2806779>

Abstract: Scheduling diverse applications in large, shared clusters is particularly challenging. Recent research on cluster scheduling focuses either on scheduling speed, using sampling to quickly assign resources to tasks, or on scheduling quality, using centralized algorithms that search for the resources that improve both task performance and cluster utilization. We present Tarcil, a distributed scheduler that targets both scheduling speed and quality. Tarcil uses an analytically derived sampling framework that adjusts the sample size based on load, and provides statistical guarantees on the quality of allocated resources. It also implements admission control when sampling is unlikely to find suitable resources. This makes it appropriate for large, shared clusters hosting short- and long-running jobs. We evaluate Tarcil on clusters with hundreds of servers on EC2. For highly-loaded clusters running short jobs, Tarcil improves task execution time by 41% over a distributed, sampling-based scheduler. For more general scenarios, Tarcil achieves near-optimal performance for 4× and 2× more jobs than sampling-based and centralized schedulers respectively.

摘要翻译： 在大型共享集群中调度不同的应用程序尤其具有挑战性。最近关于集群调度的研究要么集中在调度速度上，使用采样来快速地将资源分配给任务，要么集中在调度质量上，使用集中算法来搜索资源，从而提高任务性能和集群利用率。我们提出了Tarcil，一个分布式调度程序，目标是调度速度和质量。Tarcil使用一种分析派生的抽样框架，根据负载调整样本大小，并提供分配资源质量的统计保证。当采样不太可能找到合适的资源时，它还实现了允许控制。这使得它适用于托管短期和长期运行作业的大型共享集群。我们在EC2上有数百台服务器的集群上评估了Tarcil。对于运行短作业的高负载集群，与基于抽样的分布式调度器相比，Tarcil将任务执行时间提高了41%。对于更一般的场景，与基于采样的调度器和集中式调度器相比，Tarcil分别实现了4倍和2倍的近乎最优的性能。

Notes:

Tarcil，一个以调度速度和质量为目标的**分布式调度器**。Tarcil使用分析推导的采样框架，该框架根据负载调整采样样本大小，并对分配资源的质量提供概率意义上的保证。当采样不太可能找到合适的资源时，它还实现工作负载的准入控制。

## PriorityMeister: Tail Latency QoS for Shared Networked Storage

Authors: Timothy Zhu; Alexey Tumanov; Michael A. Kozuch; Mor Harchol-Balter; Gregory R. Ganger

Conference : SOCC '14

Tags: `scheduler`,`useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/2670979.2671008>

Abstract: Meeting service level objectives (SLOs) for tail latency is an important and challenging open problem in cloud computing infrastructures. The challenges are exacerbated by burstiness in the workloads. This paper describes PriorityMeister -- a system that employs a combination of per-workload priorities and rate limits to provide tail latency QoS for shared networked storage, even with bursty workloads. PriorityMeister automatically and proactively configures workload priorities and rate limits across multiple stages (e.g., a shared storage stage followed by a shared network stage) to meet end-to-end tail latency SLOs. In real system experiments and under production trace workloads, PriorityMeister outperforms most recent reactive request scheduling approaches, with more workloads satisfying latency SLOs at higher latency percentiles. PriorityMeister is also robust to mis-estimation of underlying storage device performance and contains the effect of misbehaving workloads.

摘要翻译： 在云计算基础设施中，满足尾部延迟的服务水平目标(slo)是一个重要且具有挑战性的开放性问题。工作量的激增加剧了这些挑战。本文描述了PriorityMeister——一个结合了每个工作负载优先级和速率限制的系统，即使在突发工作负载下也可以为共享网络存储提供尾部延迟QoS。PriorityMeister自动地、主动地跨多个阶段(例如，一个共享存储阶段和一个共享网络阶段)配置工作负载优先级和速率限制，以满足端到端的尾部延迟slo。在实际系统实验和生产跟踪工作负载下，PriorityMeister优于大多数最新的响应式请求调度方法，在更高的延迟百分位数下，更多的工作负载可以满足延迟slo。PriorityMeister对于底层存储设备性能的错误估计也很健壮，并且包含了行为不端的工作负载的影响。

Notes:

应该是网络请求的优先级调度，不确定是否与我们的内容相关

## What Bugs Live in the Cloud? A Study of 3000+ Issues in Cloud Systems

Authors: Haryadi S. Gunawi; Mingzhe Hao; Tanakorn Leesatapornwongsa; Tiratat Patana-anake; Thanh Do; Jeffry Adityatama; Kurnia J. Eliazar; Agung Laksono; Jeffrey F. Lukman; Vincentius Martin; Anang D. Satria

Conference : SOCC '14

Tags: `useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/2670979.2670986>

Abstract: We conduct a comprehensive study of development and deployment issues of six popular and important cloud systems (Hadoop MapReduce, HDFS, HBase, Cassandra, ZooKeeper and Flume). From the bug repositories, we review in total 21,399 submitted issues within a three-year period (2011-2014). Among these issues, we perform a deep analysis of 3655 "vital" issues (i.e., real issues affecting deployments) with a set of detailed classifications. We name the product of our one-year study Cloud Bug Study database (CbsDB) \[9], with which we derive numerous interesting insights unique to cloud systems. To the best of our knowledge, our work is the largest bug study for cloud systems to date.

摘要翻译： 我们对六个流行且重要的云系统(Hadoop MapReduce、HDFS、HBase、Cassandra、ZooKeeper和Flume)的开发和部署问题进行了全面的研究。从bug库中，我们总共审查了三年内(2011-2014年)提交的21,399个问题。在这些问题中，我们使用一组详细的分类对3655个“关键”问题(即影响部署的实际问题)进行了深入分析。我们将为期一年的研究成果命名为云Bug研究数据库(CbsDB)\[9]，我们从中获得了许多云系统特有的有趣见解。据我们所知，我们的工作是迄今为止规模最大的云系统漏洞研究。

Notes:

云服务系统的典型bug分析，文章分析了2011-2014年的典型的云服务系统代码仓库中的issue（当时的主流是MapReduce、ZooKeeper等），可能没什么参考意义了

## Long-term SLOs for reclaimed cloud computing resources

Authors: Marcus Carvalho; Walfredo Cirne; Francisco Brasileiro; John Wilkes

Conference : SOCC '14

Tags: `useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/2670979.2670999>

Abstract: The elasticity promised by cloud computing does not come for free. Providers need to reserve resources to allow users to scale on demand, and cope with workload variations, which results in low utilization. The current response to this low utilization is to re-sell unused resources with no Service Level Objectives (SLOs) for availability. In this paper, we show how to make some of these reclaimable resources more valuable by providing strong, long-term availability SLOs for them. These SLOs are based on forecasts of how many resources will remain unused during multi-month periods, so users can do capacity planning for their long-running services. By using confidence levels for the predictions, we give service providers control over the risk of violating the availability SLOs, and allow them trade increased risk for more resources to make available. We evaluated our approach using 45 months of workload data from 6 production clusters at Google, and show that 6--17% of the resources can be re-offered with a long-term availability of 98.9% or better. A conservative analysis shows that doing so may increase the profitability of selling reclaimed resources by 22--60%.

摘要翻译： 云计算所承诺的弹性并不是免费的。提供商需要保留资源以允许用户按需扩展，并应对工作负载变化，这导致利用率较低。对这种低利用率的当前响应是重新出售未使用的资源，而没有可用性的服务水平目标(Service Level goals, slo)。在本文中，我们展示了如何通过为这些可回收资源提供强大的、长期的可用性slo来使它们更有价值。这些slo基于对多个月期间有多少资源未使用的预测，因此用户可以为其长期运行的服务进行容量规划。通过对预测使用置信度，我们为服务提供者提供了对违反可用性slo的风险的控制，并允许他们以增加的风险换取更多可用资源。我们使用来自Google 6个生产集群的45个月的工作负载数据来评估我们的方法，并表明6- 17%的资源可以重新提供，长期可用性为98.9%或更高。保守分析表明，这样做可能会使销售再生资源的盈利能力提高22% -60%。

Notes:

让没有SLO要求的资源能够被利用起来，让云提供商资源利用率更上一层楼，让他们赚更多钱（应该没什么用）

## Small is better: avoiding latency traps in virtualized data centers

Authors: Yunjing Xu; Michael Bailey; Brian Noble; Farnam Jahanian

Conference : SOCC '13

Tags: `QoS`,`useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/2523616.2523620>

Abstract: Public clouds have become a popular platform for building Internet-scale applications. Using virtualization, public cloud services grant customers full control of guest operating systems and applications, while service providers still retain the management of their host infrastructure. Because applications built with public clouds are often highly sensitive to response time, infrastructure builders strive to reduce the latency of their data center's internal network. However, most existing solutions require modification to the software stack controlled by guests. We introduce a new host-centric solution for improving latency in virtualized cloud environments. In this approach, we extend a classic scheduling principle---Shortest Remaining Time First---from the virtualization layer, through the host network stack, to the network switches. Experimental and simulation results show that our solution can reduce median latency of small flows by 40%, with improvements in the tail of almost 90%, while reducing throughput of large flows by less than 3%.

摘要翻译： 公共云已经成为构建互联网规模应用程序的流行平台。通过虚拟化，公共云服务允许客户完全控制客户操作系统和应用程序，而服务提供商仍然保留对其主机基础设施的管理。由于使用公共云构建的应用程序通常对响应时间高度敏感，因此基础设施构建者努力减少其数据中心内部网络的延迟。但是，大多数现有的解决方案都需要修改来宾控制的软件堆栈。我们介绍了一种新的以主机为中心的解决方案，用于改善虚拟化云环境中的延迟。在这种方法中，我们扩展了经典的调度原则——剩余时间最短优先——从虚拟化层，通过主机网络堆栈，再到网络交换机。实验和仿真结果表明，该方案可将小流的中位延迟降低40%，尾部延迟提高近90%，而将大流的吞吐量降低不到3%。

Notes:

网络协议栈和网络交换机的通信传输的调度策略，采用最短剩余时间优先策略

可能没啥用，主要是网络的

## Pico replication: a high availability framework for middleboxes

Authors: Shriram Rajagopalan; Dan Williams; Hani Jamjoom

Conference : SOCC '13

Tags: `useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/2523616.2523635>

Abstract: Middleboxes are being rearchitected to be service oriented, composable, extensible, and elastic. Yet system-level support for high availability (HA) continues to introduce significant performance overhead. In this paper, we propose Pico Replication (PR), a system-level framework for middleboxes that exploits their flow-centric structure to achieve low overhead, fully customizable HA. Unlike generic (virtual machine level) techniques, PR operates at the flow level. Individual flows can be checkpointed at very high frequencies while the middlebox continues to process other flows. Furthermore, each flow can have its own checkpoint frequency, output buffer and target for backup, enabling rich and diverse policies that balance---per-flow---performance and utilization. PR leverages OpenFlow to provide near instant flow-level failure recovery, by dynamically rerouting a flow's packets to its replication target. We have implemented PR and a flow-based HA policy. In controlled experiments, PR sustains checkpoint frequencies of 1000Hz, an order of magnitude improvement over current VM replication solutions. As a result, PR drastically reduces the overhead on end-to-end latency from 280% to 15.5% and throughput overhead from 99.5% to 3.2%.

摘要翻译： 中间件被重新架构为面向服务的、可组合的、可扩展的和弹性的。然而，对高可用性(HA)的系统级支持继续带来显著的性能开销。在本文中，我们提出了Pico Replication (PR)，这是一种用于中间件的系统级框架，利用其以流为中心的结构来实现低开销、完全可定制的HA。与一般(虚拟机级别)技术不同，PR在流级别操作。当中间箱继续处理其他流时，单个流可以以非常高的频率被检查点。此外，每个流可以有自己的检查点频率、输出缓冲区和备份目标，从而支持丰富多样的策略来平衡每个流的性能和利用率。PR通过动态地将流的数据包重路由到其复制目标，利用OpenFlow提供近乎即时的流级故障恢复。我们已经实现了PR和基于流的HA策略。在受控实验中，PR维持检查点频率为1000Hz，比当前VM复制解决方案提高了一个数量级。因此，PR将端到端延迟开销从280%大幅降低到15.5%，吞吐量开销从99.5%大幅降低到3.2%。

Notes:

高可用相关的，不确定是否有用

## PoWER: prediction of workload for energy efficient relocation of virtual machines

Authors: Kashifuddin Qazi; Yang Li; Andrew Sohn

Conference : SOCC '13

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/2523616.2525938>

Abstract: Virtual Machines (VM) offer data center owners the option to lease computational resources like CPU cycles, Memory, Disk space and Network bandwidth to end-users. An important consideration in this scenario is the optimal usage of the resources (CPU cycles, Memory, Block I/O and Network Bandwidth) of the physical machines that make up the cloud or 'machine-farms'. At any given time, the machines should not be overloaded (to ensure certain QoS requirements are met) and at the same time a minimum number of machines should be running (to conserve energy). The loads on individual VMs residing on these machines is, in fact, not absolutely random. Certain patterns can be found that can help the data center owners arrange the VMs on the physical machines such that both of the above conditions are met (minimum number of machines running without any being overloaded). In this work we propose a framework, PoWER that tries to intelligently predict the behavior of the cluster based on its history and then accordingly distributes VMs in the cluster and turns off unused Physical Machines, thus saving energy. Central to our framework are concepts of Chaos Theory that make our framework indifferent to the type of loads and inherent cycles in them as opposed to other current prediction algorithms. We also test this framework on our testbed cluster and analyze its performance. We demonstrate that PoWER performs better than another FFT-based time series method in predicting VM loads and freeing resources on Physical Machines for our test loads.

摘要翻译： 虚拟机(VM)为数据中心所有者提供了将计算资源(如CPU周期、内存、磁盘空间和网络带宽)租给最终用户的选择。在这种情况下，一个重要的考虑因素是组成云或“机器农场”的物理机器的资源(CPU周期、内存、块I/O和网络带宽)的最佳使用。在任何给定时间，机器都不应该过载(以确保满足某些QoS要求)，同时应该运行最少数量的机器(以节省能源)。实际上，驻留在这些机器上的单个vm上的负载并不是绝对随机的。可以找到某些模式，这些模式可以帮助数据中心所有者在物理机器上安排虚拟机，从而满足上述两个条件(运行的机器数量最少，没有任何过载)。在这项工作中，我们提出了一个框架，PoWER，它试图根据其历史智能地预测集群的行为，然后相应地在集群中分配vm并关闭未使用的物理机，从而节省能源。我们的框架的核心是混沌理论的概念，它使我们的框架与负载的类型和固有周期无关，而不是与其他当前的预测算法相反。我们还在我们的测试平台集群上测试了这个框架，并分析了它的性能。我们证明，在预测VM负载和为我们的测试负载释放物理机上的资源方面，PoWER比另一种基于fft的时间序列方法表现得更好。

Notes:

将数据中心的每个节点上运行的虚拟机的负载不是随机的，利用这种规律可以实现更好的调度，PoWER是以<span class="highlight" data-annotation="%7B%22attachmentURI%22%3A%22http%3A%2F%2Fzotero.org%2Fusers%2F14190829%2Fitems%2F8GAAACRK%22%2C%22pageLabel%22%3A%221%22%2C%22position%22%3A%7B%22pageIndex%22%3A0%2C%22rects%22%3A%5B%5B201.006%2C421.516%2C295.058%2C432.545%5D%2C%5B72.024%2C410.116%2C276.104%2C421.145%5D%5D%7D%2C%22citationItem%22%3A%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F14190829%2Fitems%2F9NLBXRQB%22%5D%2C%22locator%22%3A%221%22%7D%7D" ztype="zhighlight"><a href="zotero://open-pdf/library/items/8GAAACRK?page=1">“minimum number of machines running without any being overloaded”</a></span>为目标的调度框架，核心理论是**Chaos Theory，**使其时间复杂度与循环无关

## Natjam: design and evaluation of eviction policies for supporting priorities and deadlines in mapreduce clusters

Authors: Brian Cho; Muntasir Rahman; Tej Chajed; Indranil Gupta; Cristina Abad; Nathan Roberts; Philbert Lin

Conference : SOCC '13

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/2523616.2523624>

Abstract: This paper presents Natjam, a system that supports arbitrary job priorities, hard real-time scheduling, and efficient preemption for Mapreduce clusters that are resource-constrained. Our contributions include: i) exploration and evaluation of smart eviction policies for jobs and for tasks, based on resource usage, task runtime, and job deadlines; and ii) a work-conserving task preemption mechanism for Mapreduce. We incorporated Natjam into the Hadoop YARN scheduler framework (in Hadoop 0.23). We present experiments from deployments on a test cluster, Emulab and a Yahoo! Inc. commercial cluster, using both synthetic workloads as well as Hadoop cluster traces from Yahoo!. Our results reveal that Natjam incurs overheads as low as 7%, and is preferable to existing approaches.

摘要翻译： 本文介绍了Natjam，一个支持任意作业优先级、硬实时调度和资源受限的Mapreduce集群的有效抢占的系统。我们的贡献包括:i)基于资源使用、任务运行时和任务截止日期，探索和评估工作和任务的智能退出策略;ii) Mapreduce的节省工作的任务抢占机制。我们将Natjam整合到Hadoop YARN调度器框架中(在Hadoop 0.23中)。我们在测试集群、Emulab和Yahoo!使用Yahoo!的合成工作负载和Hadoop集群跟踪。我们的研究结果表明，Natjam的开销低至7%，比现有的方法更可取。

Notes:

有优先级和deadline限制的硬实时、高效抢占替换策略（专门为MapReduce设计的）

## Zeta: scheduling interactive services with partial execution

Authors: Yuxiong He; Sameh Elnikety; James Larus; Chenyu Yan

Conference : SoCC '12

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/2391229.2391241>

Abstract: This paper presents a scheduling model for a class of interactive services in which requests are time bounded and lower result quality can be traded for shorter execution time. These applications include web search engines, finance servers, and other interactive, on-line services. We develop an efficient scheduling algorithm, Zeta, that allocates processor time among service requests to maximize the quality and minimize the variance of the response. Zeta exploits the concavity of the request quality profile to distribute processing time among outstanding requests. By executing some requests partially (and obtaining much or most benefit of a full execution), Zeta frees resources for other requests, which might have timed out and produced no results. Compared to scheduling algorithms that consider only deadline or quality profile information, Zeta improves overall response quality and reduces response quality variance, yielding significant improvement in the high-percentile response quality. We implemented and deployed Zeta in the Microsoft Bing web search engine and evaluated its performance in a production environment with realistic workloads. Measurements show that at the same response quality and latency as the production system, Zeta increases system capacity by 29% by improving both average and high percentile response quality. We also implemented Zeta in a finance server that computes option prices. In this application, Zeta improves average response quality by 28% and the 99-percentile quality by 80%. Using a simulation, we also compared Zeta to the offline optimal schedule and other scheduling algorithms. Although Zeta is only close to optimal, it provides better performance than prior algorithms under a wide variety of operating conditions.

摘要翻译： 本文提出了一类交互服务的调度模型，其中请求是有时间限制的，可以用较低的结果质量换取较短的执行时间。这些应用程序包括网络搜索引擎、金融服务器和其他交互式在线服务。我们开发了一种高效的调度算法Zeta，它在服务请求之间分配处理器时间，以最大限度地提高质量并最小化响应的方差。Zeta利用请求质量配置文件的凹凸性在未完成的请求之间分配处理时间。通过部分执行一些请求(并获得完全执行的大部分或大部分好处)，Zeta为其他请求释放了资源，这些请求可能已经超时并且没有产生结果。与只考虑截止日期或质量概要信息的调度算法相比，Zeta提高了整体响应质量，减少了响应质量方差，在高百分位响应质量方面产生了显著改善。我们在微软Bing网络搜索引擎中实现和部署了Zeta，并在实际工作负载的生产环境中评估了它的性能。测量表明，在与生产系统相同的响应质量和延迟下，Zeta通过提高平均和高百分位响应质量将系统容量提高了29%。我们还在一个计算期权价格的金融服务器中实现了Zeta。在这个应用程序中，Zeta将平均响应质量提高了28%，99百分位质量提高了80%。通过仿真，我们还将Zeta与离线最优调度和其他调度算法进行了比较。虽然Zeta只是接近最优，但它在各种操作条件下提供了比先前算法更好的性能。

Notes:

同时考虑了响应时间deadline和应用程序运行质量的调度器（相比于当年其他的实现，考虑了多个指标的调度）

## Finding Correctness Bugs in eBPF Verifier with Structured and Sanitized Program

Authors: Hao Sun; Yiru Xu; Jianzhong Liu; Yuheng Shen; Nan Guan; Yu Jiang

Conference : EuroSys '24

Tags: `eBPF`

Url: <https://dl.acm.org/doi/10.1145/3627703.3629562>

Abstract: eBPF is an inspiring technique in Linux that allows user space processes to extend the kernel by dynamically injecting programs. However, it poses security issues, since the untrusted user code is now executed in the kernel space. eBPF utilizes a verifier to validate the safety of the provided programs, thus its correctness is of paramount importance as attackers may exploit vulnerabilities within it to inject malicious programs. Bug-finding tools like kernel fuzzers currently can detect memory bugs in eBPF system calls, but they experience difficulties in finding correctness bugs in the verifier, e.g., incorrect validations that allow the loading of unsafe programs. Because, unlike detecting memory bugs, where sanitizers can capture such errors once observed, automatically uncovering correctness bugs is very difficult, without an effective test oracle that determines if the verifier behaves correctly for given programs. In this paper, we propose an effective approach to automatically detect the verifier's correctness bugs. Our core observation is that since the verifier aims to ensure that eBPF programs do not affect the security of the kernel, any illegal behaviors in verified programs are indicators of correctness bugs in the verifier. Indeed, we can convert the detection of logical errors in the verifier to traditional bug finding in eBPF programs. Based on such insight, we devise two indicators for correctness bugs and propose corresponding sanitation mechanisms to capture them, both of which naturally form an effective test oracle. We implemented our idea in a tool, namely BVF, which generates structured eBPF programs to pass the verifier, and subsequently, it finds correctness bugs by detecting runtime errors in verified programs with the indicators. Experiments show that although the verifier has received extensive scrutiny and has been intensively tested by tools like Syzkaller and Buzzer, BVF still found 11 previously unknown vulnerabilities in eBPF, of which six are correctness bugs of critical severity in the verifier.

摘要翻译： eBPF是Linux中的一项鼓舞人心的技术，它允许用户空间进程通过动态注入程序来扩展内核。但是，它带来了安全问题，因为不受信任的用户代码现在在内核空间中执行。eBPF使用验证器来验证所提供程序的安全性，因此其正确性至关重要，因为攻击者可能会利用其中的漏洞注入恶意程序。像内核fuzzers这样的bug查找工具目前可以检测eBPF系统调用中的内存bug，但是它们在查找验证器中的正确性bug时遇到了困难，例如，允许加载不安全程序的错误验证。因为，与检测内存错误不同，如果没有一个有效的测试oracle来确定验证器对给定程序的行为是否正确，那么自动发现正确性错误是非常困难的。本文提出了一种自动检测验证者正确性错误的有效方法。我们的核心观察是，由于验证器的目的是确保eBPF程序不影响内核的安全性，因此在被验证的程序中任何非法行为都是验证器正确性错误的指示。实际上，我们可以将验证器中的逻辑错误检测转换为eBPF程序中的传统错误查找。基于这样的见解，我们为正确性错误设计了两个指示器，并提出了相应的卫生机制来捕获它们，这两者都自然地形成了一个有效的测试oracle。我们在一个工具中实现了我们的想法，即BVF，它生成结构化的eBPF程序来通过验证者，随后，它通过使用指示器检测验证程序中的运行时错误来发现正确性错误。实验表明，尽管验证器已经接受了广泛的审查，并通过Syzkaller和Buzzer等工具进行了深入的测试，但BVF仍然在eBPF中发现了11个以前未知的漏洞，其中6个是验证器中严重的正确性错误。

Notes:

自动监测eBPF的verifier是否有正确性bug的工具。由于eBPF验证器需要保证eBPF程序不会影响内核的安全，故任何verfier本身的超出eBPF验证器要求的非法行为都是有正确性bug的。

## Enoki: High Velocity Linux Kernel Scheduler Development

Authors: Samantha Miller; Anirudh Kumar; Tanay Vakharia; Ang Chen; Danyang Zhuo; Thomas Anderson

Conference : EuroSys '24

Tags: `important`,`scheduler`

Url: <https://dl.acm.org/doi/10.1145/3627703.3629569>

Abstract: Kernel task scheduling is important for application performance, adaptability to new hardware, and complex user requirements. However, developing, testing, and debugging new scheduling algorithms in Linux, the most widely used cloud operating system, is slow and difficult. We developed Enoki, a framework for high velocity development of Linux kernel schedulers. Enoki schedulers are written in safe Rust, and the system supports live upgrade of new scheduling policies into the kernel, userspace debugging, and bidirectional communication with applications. A scheduler implemented with Enoki achieved near identical performance (within 1% on average) to the default Linux scheduler CFS on a wide range of benchmarks. Enoki is also able to support a range of research schedulers, specifically the Shinjuku scheduler, a locality aware scheduler, and the Arachne core arbiter, with good performance.

摘要翻译： 内核任务调度对于应用程序性能、对新硬件的适应性和复杂的用户需求非常重要。然而，在使用最广泛的云操作系统Linux中开发、测试和调试新的调度算法是缓慢而困难的。我们开发了Enoki，一个用于Linux内核调度器高速开发的框架。Enoki调度器是用安全的Rust编写的，系统支持将新的调度策略实时升级到内核、用户空间调试以及与应用程序的双向通信。使用Enoki实现的调度器在广泛的基准测试中实现了与默认Linux调度器CFS几乎相同的性能(平均在1%以内)。Enoki还能够支持一系列的研究调度器，特别是Shinjuku调度器，一个位置感知调度器和Arachne核心仲裁器，具有良好的性能。

Notes:

高速开发Linux内核调度器的框架（Rust），可以作为实现调度器算法的参考，看能否利用文中说的方法提高调度器开发速度

## Understanding and Optimizing Workloads for Unified Resource Management in Large Cloud Platforms

Authors: Chengzhi Lu; Huanle Xu; Kejiang Ye; Guoyao Xu; Liping Zhang; Guodong Yang; Chengzhong Xu

Conference : EuroSys '23

Tags: `important`,`scheduler`

Url: <https://dl.acm.org/doi/10.1145/3552326.3587437>

Abstract: To fully utilize computing resources, cloud providers such as Google and Alibaba choose to co-locate online services with batch processing applications in their data centers. By implementing unified resource management policies, different types of complex computing jobs request resources in a consistent way, which can help data centers achieve global optimal scheduling and provide computing power with higher quality. To understand this new scheduling paradigm, in this paper, we first present an in-depth study of Alibaba's unified scheduling workloads. Our study focuses on the characterization of resource utilization, the application running performance, and scheduling scalability. We observe that although computing resources are significantly over-committed under unified scheduling, the resource utilization in Alibaba data centers is still low. In addition, existing resource usage predictors tend to make severe overestimations. At the same time, tasks within the same application behave fairly consistently, and the running performance of tasks can be well-profiled with respect to resource contention on the corresponding physical host. Based on these observations, in this paper, we design Optum, a unified data center scheduler for improving the overall resource utilization while ensuring good performance for each application. Optum formulates an optimization problem to schedule unified task requests, aiming to balance the trade-off between utilization and resource contention. Optum also implements efficient heuristics to solve the optimization problem in a scalable manner. Large-scale experiments demonstrate that Optum can save up to 15% of resources without performance degradation compared to state-of-the-art unified scheduling schemes.

摘要翻译： 为了充分利用计算资源，谷歌和阿里巴巴等云提供商选择将在线服务与批处理应用程序放在他们的数据中心中。通过实施统一的资源管理策略，使不同类型的复杂计算任务以一致的方式请求资源，帮助数据中心实现全局最优调度，提供更高质量的计算能力。为了理解这种新的调度范式，本文首先对阿里巴巴的统一调度工作负载进行了深入研究。我们的研究重点是资源利用的特征、应用程序运行性能和调度可伸缩性。我们观察到，虽然在统一调度下计算资源明显超量使用，但阿里数据中心的资源利用率仍然很低。此外，现有的资源使用预测器往往会做出严重的高估。同时，同一应用程序中的任务的行为相当一致，并且可以根据相应物理主机上的资源争用很好地分析任务的运行性能。基于这些观察，在本文中，我们设计了Optum，一个统一的数据中心调度器，用于提高整体资源利用率，同时确保每个应用程序的良好性能。Optum提出了一个优化问题来调度统一的任务请求，以达到利用率和资源争用之间的平衡。Optum还实现了高效的启发式算法，以可扩展的方式解决优化问题。大规模实验表明，与最先进的统一调度方案相比，Optum可以节省高达15%的资源而不会降低性能。

Notes:

## OLPart: Online Learning based Resource Partitioning for Colocating Multiple Latency-Critical Jobs on Commodity Computers

Authors: Ruobing Chen; Haosen Shi; Yusen Li; Xiaoguang Liu; Gang Wang

Conference : EuroSys '23

Tags: `QoS`,`scheduler`

Url: <https://doi.org/10.1145/3552326.3567490>

Abstract: Colocating multiple jobs on the same server has been a commonly used approach for improving resource utilization in cloud environments. However, performance interference due to the contention over shared resources makes resource partitioning an important research problem. Partitioning multiple resources coordinately is particularly challenging when multiple latency-critical (LC) jobs are colocated with best-effort (BE) jobs, since the QoS needs to be protected for all the LC jobs. So far, this problem is not well-addressed in the literatures. We propose an online learning based solution, named OL-Part, for partitioning resources among multiple colocated LC jobs and BE jobs. OLPart is designed based on our observation that runtime performance counters can approximately indicate resource sensitivities of jobs. Based on this finding, OLPart leverages contextual multi-armed bandit (CMAB) to design the partitioning solution, which employs the performance counters to enable an intelligent exploration of the search space. Applying CMAB to the resource partitioning problem faces several critical challenges. OLPart proposes several techniques to overcome these challenges. OLPart does not require prior knowledge of jobs and incurs very small overhead. Evaluations demonstrate that OLPart is optimally efficient and robust, which outperforms state-of-the-art solutions with significant margins. OLPart is publicly available at <https://github.com/crbnk/OpenOLPart>.

摘要翻译： 在同一台服务器上配置多个作业是提高云环境中资源利用率的常用方法。然而，由于共享资源争用对性能的干扰，使得资源划分成为一个重要的研究问题。当多个延迟关键型(LC)作业与best-effort (BE)作业并置时，协调地对多个资源进行分区尤其具有挑战性，因为需要为所有LC作业保护QoS。到目前为止，这个问题在文献中还没有得到很好的解决。我们提出了一种基于在线学习的解决方案，称为OL-Part，用于在多个并行的LC作业和BE作业之间划分资源。OLPart的设计基于我们的观察，即运行时性能计数器可以近似地指示作业的资源敏感性。基于这一发现，OLPart利用上下文多臂强盗(CMAB)来设计分区解决方案，该解决方案使用性能计数器来实现对搜索空间的智能探索。将CMAB应用于资源划分问题面临着几个关键的挑战。OLPart提出了几种技术来克服这些挑战。OLPart不需要事先了解作业，并且开销很小。评估表明，OLPart具有最佳的效率和鲁棒性，以显著的优势优于最先进的解决方案。OLPart可在[https://github.com/crbnk/OpenOLPart公开获取。](https://github.com/crbnk/OpenOLPart%E5%85%AC%E5%BC%80%E8%8E%B7%E5%8F%96%E3%80%82)

Notes:

用在线学习做的任务资源隔离：将多个看重延迟的任务和尽力而为的任务打包到一起（基于运行时性能计数器来表示任务的资源敏感程度，由此做打包）

## VMSH: hypervisor-agnostic guest overlays for VMs

Authors: Jörg Thalheim; Peter Okelmann; Harshavardhan Unnibhavi; Redha Gouicem; Pramod Bhatotia

Conference : EuroSys '22

Tags: `light weight VM`

Url: <https://dl.acm.org/doi/10.1145/3492321.3519589>

Abstract: Lightweight virtual machines (VMs) are prominently adopted for improved performance and dependability in cloud environments. To reduce boot up times and resource utilisation, they are usually "pre-baked" with only the minimal kernel and userland strictly required to run an application. This introduces a fundamental trade-off between the advantages of lightweight VMs and available services within a VM, usually leaning towards the former. We propose VMSH, a hypervisor-agnostic abstraction that enables on-demand attachment of services to a running VM---allowing developers to provide minimal, lightweight images without compromising their functionality. The additional applications are made available to the guest via a file system image. To ensure that the newly added services do not affect the original applications in the VM, VMSH uses lightweight isolation mechanisms based on containers. We evaluate VMSH on multiple KVM-based hypervisors and Linux LTS kernels and show that: (i) VMSH adds no overhead for the applications running in the VM, (ii) de-bloating images from the Docker registry can save up to 60% of their size on average, and (iii) VMSH enables cloud providers to offer services to customers, such as recovery shells, without interfering with their VM's execution.

摘要翻译： 轻量级虚拟机(vm)主要用于改进云环境中的性能和可靠性。为了减少启动时间和资源利用率，它们通常是“预烘焙”的，只有运行应用程序严格要求的最小内核和用户空间。这在轻量级VM的优势和VM内可用服务之间引入了一个基本的权衡，通常倾向于前者。我们提出VMSH，这是一种与虚拟机管理程序无关的抽象，可以按需将服务附加到运行中的虚拟机中——允许开发人员在不影响其功能的情况下提供最小的轻量级映像。附加的应用程序通过文件系统映像提供给客户机。为了确保新增的服务不影响虚拟机中原有的应用程序，VMSH使用了基于容器的轻量级隔离机制。我们在多个基于kvm的管理程序和Linux LTS内核上对VMSH进行了评估，结果表明:(i) VMSH不会增加虚拟机中运行的应用程序的开销，(ii)从Docker注册表中删除映像可以平均节省其大小的60%，(iii) VMSH使云提供商能够向客户提供服务，例如恢复shell，而不会干扰虚拟机的执行。

Notes:

为了提高轻量级VM的可执行应用功能性而引入的overlay中间层做VM功能扩展，保证不牺牲VM性能的情况下提高其可执行应用功能丰富度。

> 这篇文章实现的VMSH如果开源可用，可以作为我们性能劣化原型监测的实验对照平台之一

## Verified programs can party: optimizing kernel extensions via post-verification merging

Authors: Hsuan-Chi Kuo; Kai-Hsun Chen; Yicheng Lu; Dan Williams; Sibin Mohan; Tianyin Xu

Conference : EuroSys '22

Tags: `eBPF`,`important`

Url: <https://dl.acm.org/doi/10.1145/3492321.3519562>

Abstract: Operating system (OS) extensions are more popular than ever. For example, Linux BPF is marketed as a "superpower" that allows user programs to be downloaded into the kernel, verified to be safe and executed at kernel hook points. So, BPF extensions have high performance and are often placed at performance-critical paths for tracing and filtering. However, although BPF extension programs execute in a shared kernel environment and are already individually verified, they are often executed independently in chains. We observe that the chain pattern has large performance overhead, due to indirect jumps penalized by security mitigations (e.g., Spectre), loops, and memory accesses. In this paper, we argue for a separation of concerns. We propose to decouple the execution of BPF extensions from their verification requirements---BPF extension programs can be collectively optimized, after each BPF extension program is individually verified and loaded into the shared kernel. We present KFuse, a framework that dynamically and automatically merges chains of BPF programs by transforming indirect jumps into direct jumps, unrolling loops, and saving memory accesses, without loss of security or flexibility. KFuse can merge BPF programs that are (1) installed by multiple principals, (2) maintained to be modular and separate, (3) installed at different points of time, and (4) split into smaller, verifiable programs via BPF tail calls. KFuse demonstrates 85% performance improvement of BPF chain execution and 7% of application performance improvement over existing BPF use cases (systemd's Seccomp BPF filters). It achieves more significant benefits for longer chains.

摘要翻译： 操作系统(OS)扩展比以往任何时候都更加流行。例如，Linux BPF被宣传为一种“超级功能”，它允许将用户程序下载到内核中，验证其安全性并在内核钩子点执行。因此，BPF扩展具有高性能，并且通常放置在用于跟踪和过滤的性能关键路径上。然而，尽管BPF扩展程序在共享内核环境中执行并且已经单独验证，但它们通常在链中独立执行。我们观察到，由于安全缓解(例如Spectre)、循环和内存访问造成的间接跳转，链模式具有很大的性能开销。在本文中，我们主张分离关注点。我们建议将BPF扩展的执行与其验证需求解耦——在每个BPF扩展程序被单独验证并加载到共享内核之后，BPF扩展程序可以被集体优化。我们提出了KFuse，一个动态和自动合并BPF程序链的框架，通过将间接跳转转换为直接跳转，展开循环和节省内存访问，而不会失去安全性和灵活性。KFuse可以合并以下BPF程序:(1)由多个主体安装，(2)保持模块化和独立，(3)安装在不同的时间点，以及(4)通过BPF尾部调用拆分为更小的，可验证的程序。KFuse显示，与现有的BPF用例(systemd的Seccomp BPF过滤器)相比，BPF链执行的性能提高了85%，应用程序性能提高了7%。对于更长的链，它可以获得更大的好处。

Notes:

提供了一种在内核中将已验证过的多个独立的BPF程序组合（重复代码合并）的方案（以提高eBPF的性能），并给出以下优化：

1.  非连续跳转变为连续跳转
2.  循环展开
3.  减少内存访问

这篇文章提出的优化策略已经嵌入eBPF了，有必要的话可以了解了解其实现原理

[eBPF代码仓库](https://github.com/eBPF-Verifier/eurosys-kfuse-artifact)

## Unicorn: reasoning about configurable system performance through the lens of causality

Authors: Md Shahriar Iqbal; Rahul Krishna; Mohammad Ali Javidian; Baishakhi Ray; Pooyan Jamshidi

Conference : EuroSys '22

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/3492321.3519575>

Abstract: Modern computer systems are highly configurable, with the total variability space sometimes larger than the number of atoms in the universe. Understanding and reasoning about the performance behavior of highly configurable systems, over a vast and variable space, is challenging. State-of-the-art methods for performance modeling and analyses rely on predictive machine learning models, therefore, they become (i) unreliable in unseen environments (e.g., different hardware, workloads), and (ii) may produce incorrect explanations. To tackle this, we propose a new method, called Unicorn, which (i) captures intricate interactions between configuration options across the software-hardware stack and (ii) describes how such interactions can impact performance variations via causal inference. We evaluated Unicorn on six highly configurable systems, including three on-device machine learning systems, a video encoder, a database management system, and a data analytics pipeline. The experimental results indicate that Unicorn outperforms state-of-the-art performance debugging and optimization methods in finding effective repairs for performance faults and finding configurations with near-optimal performance. Further, unlike the existing methods, the learned causal performance models reliably predict performance for new environments.

摘要翻译： 现代计算机系统具有高度可配置性，其总可变性空间有时比宇宙中的原子数量还要大。理解和推理高度可配置系统的性能行为，在一个巨大的和可变的空间，是具有挑战性的。最先进的性能建模和分析方法依赖于预测机器学习模型，因此，它们在看不见的环境(例如，不同的硬件，工作负载)中变得不可靠，并且(ii)可能产生不正确的解释。为了解决这个问题，我们提出了一种名为Unicorn的新方法，该方法(i)捕获跨软硬件堆栈配置选项之间复杂的相互作用，(ii)描述这种相互作用如何通过因果推理影响性能变化。我们在六个高度可配置的系统上对Unicorn进行了评估，包括三个设备上的机器学习系统、一个视频编码器、一个数据库管理系统和一个数据分析管道。实验结果表明，在寻找性能故障的有效修复和寻找性能接近最佳的配置方面，Unicorn优于最先进的性能调试和优化方法。此外，与现有方法不同，学习到的因果性能模型可靠地预测了新环境的性能。

Notes:

这篇文章标了scheduler的标签是因为它对性能瓶颈的成因用推理分析的模型进行了训练，对我们实现一个调度器有帮助

## DeepRest: deep resource estimation for interactive microservices

Authors: Ka-Ho Chow; Umesh Deshpande; Sangeetha Seshadri; Ling Liu

Conference : EuroSys '22

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/3492321.3519564>

Abstract: Interactive microservices expose API endpoints to be invoked by users. For such applications, precisely estimating the resources required to serve specific API traffic is challenging. This is because an API request can interact with different components and consume different resources for each component. The notion of API traffic is vital to application owners since the API endpoints often reflect business logic, e.g., a customer transaction. The existing systems that simply rely on historical resource utilization are not API-aware and thus cannot estimate the resource requirement accurately. This paper presents DeepRest, a deep learning-driven resource estimation system. DeepRest formulates resource estimation as a function of API traffic and learns the causality between user interactions and resource utilization directly in a production environment. Our evaluation shows that DeepRest can estimate resource requirements with over 90% accuracy, even if the API traffic to be estimated has never been observed (e.g., 3× more users than ever or unseen traffic shape). We further apply resource estimation for application sanity checks. DeepRest identifies system anomalies by verifying whether the resource utilization is justifiable by how the application is being used. It can successfully identify two major cyber threats: ransomware and cryptojacking attacks.

摘要翻译： 交互式微服务公开供用户调用的API端点。对于这样的应用程序，精确地估计服务特定API流量所需的资源是具有挑战性的。这是因为API请求可以与不同的组件交互，并为每个组件消耗不同的资源。API流量的概念对应用程序所有者至关重要，因为API端点通常反映业务逻辑，例如，客户事务。仅依赖历史资源利用率的现有系统不支持api，因此无法准确估计资源需求。本文介绍了深度学习驱动的资源估计系统DeepRest。DeepRest将资源估算作为API流量的函数，并直接在生产环境中学习用户交互与资源利用之间的因果关系。我们的评估表明，即使从未观察到要估计的API流量(例如，比以往多3倍的用户或看不见的流量形状)，DeepRest也可以以超过90%的准确率估计资源需求。我们进一步将资源估计应用于应用程序完整性检查。DeepRest通过验证应用程序的使用方式是否合理来识别系统异常。它可以成功识别两种主要的网络威胁:勒索软件和加密劫持攻击。

Notes:

一个对用户API和资源利用率之间做因果分析的模型，对调度器的实现有帮助

## Performance evolution of mitigating transient execution attacks

Authors: Jonathan Behrens; Adam Belay; M. Frans Kaashoek

Conference : EuroSys '22

Tags: `useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/3492321.3519559>

Abstract: Today's applications pay a performance penalty for mitigations to protect against transient execution attacks such as Meltdown \[32] and Spectre \[25]. Such a reduction in performance directly translates to higher operating costs and degraded user experience. This paper measures the performance impact of these mitigations across a range of processors from multiple vendors and across several security boundaries to identify trends over successive generations of processors and to attribute how much of the overall slowdown is caused by each individual mitigation. We find that overheads for operating system intensive workloads have declined by as much as 10×, down to about 3% on modern CPUs, due to hardware changes that eliminate the need for the most expensive mitigations. Meanwhile, a JavaScript benchmark reveals approximately 20% overhead persists today because mitigations for Spectre V1 and Speculative Store Bypass have not become more efficient. Other workloads like virtual machines and single-process, compute-intensive applications did not show significant slowdowns on any of the processors we measured.

摘要翻译： 今天的应用程序为防止瞬态执行攻击(如Meltdown\[32]和Spectre\[25])而付出了性能损失。这种性能的降低直接转化为更高的运营成本和降低的用户体验。本文跨多个供应商的一系列处理器和多个安全边界测量了这些缓解措施对性能的影响，以确定连续几代处理器的趋势，并确定每个缓解措施造成的总体减速的程度。我们发现，操作系统密集型工作负载的开销下降了10倍，在现代cpu上下降到3%左右，这是由于硬件更改消除了最昂贵的缓解措施的需要。与此同时，JavaScript基准测试显示，由于Spectre V1和Speculative Store Bypass的缓解措施没有变得更有效，大约20%的开销仍然存在。其他工作负载，如虚拟机和单进程、计算密集型应用程序，在我们测量的任何处理器上都没有显示出明显的减速。

Notes:

## SmartHarvest: harvesting idle CPUs safely and efficiently in the cloud

Authors: Yawen Wang; Kapil Arya; Marios Kogias; Manohar Vanga; Aditya Bhandari; Neeraja J. Yadwadkar; Siddhartha Sen; Sameh Elnikety; Christos Kozyrakis; Ricardo Bianchini

Conference : EuroSys '21

Tags: `scheduler`

Url: <https://doi.org/10.1145/3447786.3456225>

Abstract: We can increase the efficiency of public cloud datacenters by harvesting allocated but temporarily idling CPU cores from customer virtual machines (VMs) to run batch or analytics workloads. Even small efficiency gains translate into substantial savings, since provisioning and operating a datacenter costs hundreds of millions of dollars per year. The main challenge is to harvest idle cores with little or no impact on customer VMs, which could be running latency-sensitive services and are essentially black-boxes to the cloud provider. We introduce ElasticVM, a new VM type that can run batch workloads cheaply using mainly harvested cores. We also propose SmartHarvest, a system that dynamically manages the number of cores available to ElasticVMs in each fine-grained time window. SmartHarvest uses online learning to predict the core demand of primary, customer VMs and compute the number of cores that can be safely harvested. Our results show that SmartHarvest can harvest a significant amount of CPU resources without increasing the 99th-percentile tail latency of latency-critical primary workloads by more than 10%. Unlike static harvesting techniques that rely on offline profiling, SmartHarvest is robust to different primary workloads, batch workloads, and load changes. Finally, we show that the online learning in SmartHarvest is complementary to systems optimizations for VM management.

摘要翻译： 我们可以通过从客户虚拟机(vm)中收集已分配但暂时空闲的CPU内核来运行批处理或分析工作负载，从而提高公共云数据中心的效率。即使是很小的效率提升也会转化为大量的节省，因为配置和运营数据中心每年要花费数亿美元。主要的挑战是在对客户vm影响很小或没有影响的情况下收集空闲的内核，这些虚拟机可能正在运行对延迟敏感的服务，对云提供商来说本质上是黑盒。我们介绍了ElasticVM，这是一种新的虚拟机类型，可以使用主要收集的内核来廉价地运行批处理工作负载。我们还提出了smarthharvest，一个在每个细粒度时间窗口中动态管理elasticvm可用内核数量的系统。smarthharvest使用在线学习来预测主虚拟机和客户虚拟机的核心需求，并计算可以安全收获的核心数量。我们的结果表明，smarthharvest可以收获大量的CPU资源，而不会使延迟关键型主工作负载的第99百分位尾部延迟增加10%以上。与依赖离线分析的静态收集技术不同，smarthharvest对于不同的主工作负载、批处理工作负载和负载变化都是健壮的。最后，我们证明了smarthharvest中的在线学习是对虚拟机管理系统优化的补充。

Notes:

虚拟机调度时对空闲的虚拟CPU“收割”，与调度是两条赛道，说不定有借鉴意义

## OFC: an opportunistic caching system for FaaS platforms

Authors: Djob Mvondo; Mathieu Bacou; Kevin Nguetchouang; Lucien Ngale; Stéphane Pouget; Josiane Kouam; Renaud Lachaize; Jinho Hwang; Tim Wood; Daniel Hagimont; Noël De Palma; Bernabé Batchakui; Alain Tchana

Conference : EuroSys '21

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/3447786.3456239>

Abstract: Cloud applications based on the "Functions as a Service" (FaaS) paradigm have become very popular. Yet, due to their stateless nature, they must frequently interact with an external data store, which limits their performance. To mitigate this issue, we introduce OFC, a transparent, vertically and horizontally elastic in-memory caching system for FaaS platforms, distributed over the worker nodes. OFC provides these benefits cost-effectively by exploiting two common sources of resource waste: (i) most cloud tenants overprovision the memory resources reserved for their functions because their footprint is non-trivially input-dependent and (ii) FaaS providers keep function sandboxes alive for several minutes to avoid cold starts. Using machine learning models adjusted for typical function input data categories (e.g., multimedia formats), OFC estimates the actual memory resources required by each function invocation and hoards the remaining capacity to feed the cache. We build our OFC prototype based on enhancements to the OpenWhisk FaaS platform, the Swift persistent object store, and the RAM-Cloud in-memory store. Using a diverse set of workloads, we show that OFC improves by up to 82 % and 60 % respectively the execution time of single-stage and pipelined functions.

摘要翻译： 基于“功能即服务”(FaaS)范式的云应用程序已经变得非常流行。然而，由于它们的无状态特性，它们必须经常与外部数据存储交互，这限制了它们的性能。为了缓解这个问题，我们引入了OFC，这是一个透明的、垂直和水平弹性的FaaS平台内存缓存系统，分布在工作节点上。OFC通过利用两种常见的资源浪费来源来经济有效地提供这些好处:(i)大多数云租户过度配置为其功能保留的内存资源，因为它们的内存占用非常依赖于输入;(ii) FaaS提供商将功能沙箱保持几分钟的活动时间，以避免冷启动。使用针对典型功能输入数据类别(例如，多媒体格式)调整的机器学习模型，OFC估计每个功能调用所需的实际内存资源，并将剩余容量储存到缓存中。我们基于OpenWhisk FaaS平台、Swift持久对象存储和RAM-Cloud内存存储的增强构建了OFC原型。通过使用一组不同的工作负载，我们发现OFC分别将单阶段和流水线函数的执行时间提高了82%和60%。

Notes:

机器学习对特定输入的FaaS内存使用量估计，以完成cache分配。与调度器相关

## Take it to the limit: peak prediction-driven resource overcommitment in datacenters

Authors: Noman Bashir; Nan Deng; Krzysztof Rzadca; David Irwin; Sree Kodak; Rohit Jnagal

Conference : EuroSys '21

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/3447786.3456259>

Abstract: To increase utilization, datacenter schedulers often overcommit resources where the sum of resources allocated to the tasks on a machine exceeds its physical capacity. Setting the right level of overcommitment is a challenging problem: low overcommitment leads to wasted resources, while high overcommitment leads to task performance degradation. In this paper, we take a first principles approach to designing and evaluating overcommit policies by asking a basic question: assuming complete knowledge of each task's future resource usage, what is the safest overcommit policy that yields the highest utilization? We call this policy the peak oracle. We then devise practical overcommit policies that mimic this peak oracle by predicting future machine resource usage. We simulate our overcommit policies using the recently-released Google cluster trace, and show that they result in higher utilization and less overcommit errors than policies based on per-task allocations. We also deploy these policies to machines inside Google's datacenters serving its internal production workload. We show that our overcommit policies increase these machines' usable CPU capacity by 10-16% compared to no overcommitment.

摘要翻译： 为了提高利用率，当一台机器上分配给任务的资源总和超过其物理容量时，数据中心调度器通常会过度使用资源。设置正确的超承诺级别是一个具有挑战性的问题:低的超承诺会导致资源浪费，而高的超承诺会导致任务性能下降。在本文中，我们通过提出一个基本问题，采用第一原则方法来设计和评估超提交策略:假设完全了解每个任务未来的资源使用情况，那么产生最高利用率的最安全的超提交策略是什么?我们称此策略为峰值oracle。然后，我们通过预测未来的机器资源使用情况，设计实用的超额提交策略来模拟这个峰值oracle。我们使用最近发布的Google集群跟踪来模拟我们的超提交策略，并显示它们比基于每任务分配的策略产生更高的利用率和更少的超提交错误。我们还将这些策略部署到Google数据中心内为其内部生产工作负载服务的机器上。我们表明，与没有超提交相比，我们的超提交策略使这些机器的可用CPU容量增加了10-16%。

Notes:

overcommitment（暂且翻译为过度分配）策略的全局观测和分配，对调度算法不一定有用，但相关

## Rhythm: component-distinguishable workload deployment in datacenters

Authors: Laiping Zhao; Yanan Yang; Kaixuan Zhang; Xiaobo Zhou; Tie Qiu; Keqiu Li; Yungang Bao

Conference : EuroSys '20

Tags: `scheduler`

Url: <https://doi.org/10.1145/3342195.3387534>

Abstract: Cloud service providers improve resource utilization by co-locating latency-critical (LC) workloads with best-effort batch (BE) jobs in datacenters. However, they usually treat an LC workload as a whole when allocating resources to BE jobs and neglect the different features of components of an LC workload. This kind of coarse-grained co-location method leaves a significant room for improvement in resource utilization. Based on the observation of the inconsistent interference tolerance abilities of different LC components, we propose a new abstraction called Servpod, which is a collection of a LC parts that are deployed on the same physical machine together, and show its merits on building a fine-grained co-location framework. The key idea is to differentiate the BE throughput launched with each LC Servpod, i.e., Servpod with high interference tolerance ability can be deployed along with more BE jobs. Based on Servpods, we present Rhythm, a co-location controller that maximizes the resource utilization while guaranteeing LC service's tail latency requirement. It quantifies the interference tolerance ability of each servpod through the analysis of tail-latency contribution. We evaluate Rhythm using LC services in forms of containerized processes and microservices, and find that it can improve the system throughput by 31.7%, CPU utilization by 26.2%, and memory bandwidth utilization by 34% while guaranteeing the SLA (service level agreement).

摘要翻译： 云服务提供商通过将延迟关键型(LC)工作负载与尽力而为的批处理(BE)作业放在数据中心中，从而提高资源利用率。然而，在将资源分配给BE作业时，他们通常将LC工作负载视为一个整体，而忽略了LC工作负载组件的不同特征。这种粗粒度的协同定位方法在资源利用方面留下了很大的改进空间。基于对不同LC组件的干扰容忍能力不一致的观察，我们提出了一种新的抽象Servpod，即在同一台物理机上部署的LC组件集合，并展示了其在构建细粒度协同定位框架方面的优点。关键思想是区分每个LC Servpod启动的BE吞吐量，即具有高抗干扰能力的Servpod可以与更多的BE作业一起部署。基于Servpods，我们提出了一种能够在保证LC服务尾部延迟需求的同时最大化资源利用率的协同位置控制器Rhythm。通过对尾延迟贡献的分析，量化了每个舵机的抗干扰能力。我们以容器化进程和微服务的形式对使用LC服务的Rhythm进行了评估，发现在保证SLA(服务水平协议)的同时，它可以将系统吞吐量提高31.7%，CPU利用率提高26.2%，内存带宽利用率提高34%。

Notes:

将云服务分为延迟关键型应用和批处理应用，对二者的部署做区分

## GrandSLAm: Guaranteeing SLAs for Jobs in Microservices Execution Frameworks

Authors: Ram Srivatsa Kannan; Lavanya Subramanian; Ashwin Raju; Jeongseob Ahn; Jason Mars; Lingjia Tang

Conference : EuroSys '19

Tags: `important`,`QoS`,`scheduler`

Url: <https://doi.org/10.1145/3302424.3303958>

Abstract: The microservice architecture has dramatically reduced user effort in adopting and maintaining servers by providing a catalog of functions as services that can be used as building blocks to construct applications. This has enabled datacenter operators to look at managing datacenter hosting microservices quite differently from traditional infrastructures. Such a paradigm shift calls for a need to rethink resource management strategies employed in such execution environments. We observe that the visibility enabled by a microservices execution framework can be exploited to achieve high throughput and resource utilization while still meeting Service Level Agreements, especially in multi-tenant execution scenarios. In this study, we present GrandSLAm, a microservice execution framework that improves utilization of datacenters hosting microservices. GrandSLAm estimates time of completion of requests propagating through individual microservice stages within an application. It then leverages this estimate to drive a runtime system that dynamically batches and reorders requests at each microservice in a manner where individual jobs meet their respective target latency while achieving high throughput. GrandSLAm significantly increases throughput by up to 3x compared to the our baseline, without violating SLAs for a wide range of real-world AI and ML applications.

摘要翻译： 微服务架构通过提供一系列功能作为服务，从而极大地减少了用户采用和维护服务器的工作量，这些功能可以用作构建应用程序的构建块。这使得数据中心运营商能够以完全不同于传统基础设施的方式管理数据中心托管微服务。这种范式转变需要重新考虑在这种执行环境中使用的资源管理策略。我们观察到，微服务执行框架支持的可见性可以被利用来实现高吞吐量和资源利用率，同时仍然满足服务水平协议，特别是在多租户执行场景中。在这项研究中，我们提出了GrandSLAm，这是一个微服务执行框架，可以提高托管微服务的数据中心的利用率。GrandSLAm估计通过应用程序内各个微服务阶段传播请求的完成时间。然后，它利用这个估计来驱动一个运行时系统，该系统可以动态地对每个微服务的请求进行批处理和重新排序，从而使各个作业在实现高吞吐量的同时满足各自的目标延迟。与我们的基线相比，GrandSLAm显着将吞吐量提高了3倍，而不会违反广泛的现实世界AI和ML应用程序的sla。

Notes:

微服务执行框架，估测每一个阶段的请求完成时间，利用估测的时间进行批处理和重排序使得每个任务满足它们的指标要求

## RTVirt: enabling time-sensitive computing on virtualized systems through cross-layer CPU scheduling

Authors: Ming Zhao; Jorge Cabrera

Conference : EuroSys '18

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/3190508.3190527>

Abstract: Virtualization enables flexible application delivery and efficient resource consolidation, and is pervasively used to build various virtualized systems including public and private cloud computing systems. Many applications can benefit from computing on virtualized systems, including those that are time sensitive, but it is still challenging for existing virtualized systems to deliver application-desired timeliness. In particular, the lack of awareness between VM host- and guest-level schedulers presents a serious hurdle to achieving strong timeliness guarantees on virtualized systems. This paper presents RTVirt, a new solution to time-sensitive computing on virtualized systems through cross-layer scheduling. It allows the two levels of schedulers on a virtualized system to communicate key scheduling information and coordinate on the scheduling decisions. It enables optimal multiprocessor schedulers to support virtualized time-sensitive applications with strong timeliness guarantees and efficient resource utilization. RTVirt is prototyped on a widely used virtualization framework (Xen) and evaluated with diverse workloads. The results show that it can meet application deadlines (99%) or tail latency requirements (99.9th percentile) nearly perfectly; it can handle large numbers of applications and dynamic changes in their timeliness requirements; and it substantially outperforms the existing solutions in both timeliness and resource utilization.

摘要翻译： 虚拟化支持灵活的应用程序交付和高效的资源整合，广泛用于构建各种虚拟化系统，包括公共和私有云计算系统。许多应用程序可以从虚拟化系统上的计算中获益，包括那些对时间敏感的系统，但是现有的虚拟化系统要提供应用程序所需的时效性仍然是一个挑战。特别是，VM主机级和客户机级调度器之间缺乏意识，这对在虚拟化系统上实现强大的时效性保证构成了严重障碍。提出了一种基于跨层调度的虚拟化系统时间敏感计算解决方案RTVirt。它允许虚拟化系统上的两个级别的调度器通信关键的调度信息，并就调度决策进行协调。它使最优的多处理器调度器能够支持具有强时效性保证和高效资源利用的虚拟化时间敏感型应用程序。RTVirt在广泛使用的虚拟化框架(Xen)上进行了原型设计，并在不同的工作负载下进行了评估。结果表明，它几乎可以完美地满足应用程序截止日期(99%)或尾延迟要求(99.9百分位数);它可以处理大量的应用程序和动态变化的时效性要求;它在时效性和资源利用率方面都大大优于现有的解决方案。

Notes:

GuestOS的调度器和Host调度器之间怎么做信息传递，怎么更好地满足实时性要求。（我们的多层调度可能有可以参考的方面）

## Tableau: a high-throughput and predictable VM scheduler for high-density workloads

Authors: Manohar Vanga; Arpan Gujarati; Björn B. Brandenburg

Conference : EuroSys '18

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/3190508.3190557>

Abstract: In the increasingly competitive public-cloud marketplace, improving the efficiency of data centers is a major concern. One way to improve efficiency is to consolidate as many VMs onto as few physical cores as possible, provided that performance expectations are not violated. However, as a prerequisite for increased VM densities, the hypervisor's VM scheduler must allocate processor time efficiently and in a timely fashion. As we show in this paper, contemporary VM schedulers leave substantial room for improvements in both regards when facing challenging high-VM-density workloads that frequently trigger the VM scheduler. As root causes, we identify (i) high runtime overheads and (ii) unpredictable scheduling heuristics. To better support high VM densities, we propose Tableau, a VM scheduler that guarantees a minimum processor share and a maximum bound on scheduling delay for every VM in the system. Tableau combines a low-overhead, core-local, table-driven dispatcher with a fast on-demand table-generation procedure (triggered on VM creation/teardown) that employs scheduling techniques typically used in hard real-time systems. In an evaluation of Tableau and three current Xen schedulers on a 16-core Intel Xeon machine, Tableau is shown to improve tail latency (e.g., a 17X reduction in maximum ping latency compared to Credit) and throughput (e.g., 1.6X peak web server throughput compared to RTDS when serving 1 KiB files with a 100 ms SLA).

摘要翻译： 在竞争日益激烈的公共云市场中，提高数据中心的效率是一个主要问题。提高效率的一种方法是在不违反性能预期的前提下，将尽可能多的vm合并到尽可能少的物理内核上。但是，作为增加VM密度的先决条件，管理程序的VM调度器必须有效且及时地分配处理器时间。正如我们在本文中所展示的，当面对频繁触发VM调度器的高VM密度工作负载时，当代VM调度器在这两方面都有很大的改进空间。作为根本原因，我们确定了(i)高运行时开销和(ii)不可预测的调度启发式。为了更好地支持高VM密度，我们提出了一个VM调度器Tableau，它保证了系统中每个VM的最小处理器共享和最大调度延迟。Tableau结合了一个低开销、核心本地、表驱动的调度程序和一个快速的按需表生成过程(在VM创建/拆除时触发)，该过程采用了硬实时系统中通常使用的调度技术。在一台16核Intel Xeon机器上对Tableau和三个当前Xen调程器的评估中，Tableau被证明可以改善尾部延迟(例如，与Credit相比，最大ping延迟减少了17倍)和吞吐量(例如，当以100毫秒SLA服务1 KiB文件时，与RTDS相比，峰值web服务器吞吐量减少了1.6倍)。

Notes:

hypervisor的调度算法

## Welcome to zombieland: practical and energy-efficient memory disaggregation in a datacenter

Authors: Vlad Nitu; Boris Teabe; Alain Tchana; Canturk Isci; Daniel Hagimont

Conference : EuroSys '18

Tags: `useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/3190508.3190537>

Abstract: In this paper, we propose an effortless way for disaggregating the CPU-memory couple, two of the most important resources in cloud computing. Instead of redesigning each resource board, the disaggregation is done at the power supply domain level. In other words, CPU and memory still share the same board, but their power supply domains are separated. Besides this disaggregation, we make the two following contributions: (1) the prototyping of a new ACPI sleep state (called zombie and noted Sz) which allows to suspend a server (thus save energy) while making its memory remotely accessible; and (2) the prototyping of a rack-level system software which allows the transparent utilization of the entire rack resources (avoiding resource waste). We experimentally evaluate the effectiveness of our solution and show that it can improve the energy efficiency of state-of-the-art consolidation techniques by up to 86%, with minimal additional complexity.

摘要翻译： 在本文中，我们提出了一种简单的方法来分解cpu -内存对，这是云计算中最重要的两个资源。不是重新设计每个资源板，而是在电源域级别进行分解。换句话说，CPU和内存仍然共享同一个板，但它们的电源域是分开的。除了这种分解之外，我们还做出了以下两个贡献:(1)新的ACPI睡眠状态(称为僵尸并标记为Sz)的原型设计，该状态允许挂起服务器(从而节省能源)，同时使其内存远程访问;(2)机架级系统软件的原型设计，实现了整个机架资源的透明利用(避免了资源浪费)。我们通过实验评估了我们的解决方案的有效性，并表明它可以将最先进的固结技术的能源效率提高高达86%，并且最小化了额外的复杂性。

Notes:

做了服务器的CPU、内存的电源分配的隔离，硬件设计了一个zombie状态（本机关闭CPU和内存，但远端可以访问其内存）

## TetriSched: global rescheduling with adaptive plan-ahead in dynamic heterogeneous clusters

Authors: Alexey Tumanov; Timothy Zhu; Jun Woo Park; Michael A. Kozuch; Mor Harchol-Balter; Gregory R. Ganger

Conference : EuroSys '16

Tags: `important`,`scheduler`

Url: <https://doi.org/10.1145/2901318.2901355>

Abstract: TetriSched is a scheduler that works in tandem with a calendaring reservation system to continuously re-evaluate the immediate-term scheduling plan for all pending jobs (including those with reservations and best-effort jobs) on each scheduling cycle. TetriSched leverages information supplied by the reservation system about jobs' deadlines and estimated runtimes to plan ahead in deciding whether to wait for a busy preferred resource type (e.g., machine with a GPU) or fall back to less preferred placement options. Plan-ahead affords significant flexibility in handling mis-estimates in job runtimes specified at reservation time. Integrated with the main reservation system in Hadoop YARN, TetriSched is experimentally shown to achieve significantly higher SLO attainment and cluster utilization than the best-configured YARN reservation and CapacityScheduler stack deployed on a real 256 node cluster.

摘要翻译： TetriSched是一个调度器，它与日历预约系统协同工作，在每个调度周期中不断地重新评估所有待处理作业(包括那些有预约和最努力工作的作业)的近期调度计划。TetriSched利用预定系统提供的有关作业截止日期和估计运行时间的信息，提前计划决定是否等待繁忙的首选资源类型(例如，带有GPU的机器)或退回到较少首选的放置选项。提前计划在处理预定时指定的作业运行时的错误估计方面提供了极大的灵活性。与Hadoop YARN中的主预留系统集成，实验表明，与部署在256节点集群上的最佳配置YARN预留和CapacityScheduler堆栈相比，TetriSched可以实现更高的SLO和集群利用率。

Notes:

对数据中心的全局调度器，使用了提前预约的配置来提高应用的调度参数

## PSLO: enforcing the Xth percentile latency and throughput SLOs for consolidated VM storage

Authors: Ning Li; Hong Jiang; Dan Feng; Zhan Shi

Conference : EuroSys '16

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/2901318.2901330>

Abstract: It is desirable but challenging to simultaneously support latency SLO at a pre-defined percentile, i.e., the Xth percentile latency SLO, and throughput SLO for consolidated VM storage. Ensuring the Xth percentile latency contributes to accurately differentiating service levels in the metric of the application-level latency SLO compliance, especially for the application built on multiple VMs. However, the Xth percentile latency SLO and throughput SLO enforcement are the opposite sides of the same coin due to the conflicting requirements for the level of IO concurrency. To address this challenge, this paper proposes PSLO, a framework supporting the Xth percentile latency and throughput SLOs under consolidated VM environment by precisely coordinating the level of IO concurrency and arrival rate for each VM issue queue. It is noted that PSLO can take full advantage of the available IO capacity allowed by SLO constraints to improve throughput or reduce latency with the best effort. We design and implement a PSLO prototype in the real VM consolidation environment created by Xen. Our extensive trace-driven prototype evaluation shows that our system is able to optimize the Xth percentile latency and throughput for consolidated VMs under SLO constraints.

摘要翻译： 同时以预定义的百分位数支持延迟SLO(即第x百分位数延迟SLO)和统一VM存储的吞吐量SLO，这是可取的，但具有挑战性。确保第x百分位延迟有助于在应用程序级延迟SLO遵从性度量中准确区分服务级别，特别是对于构建在多个vm上的应用程序。然而，第x百分位延迟SLO和吞吐量SLO实施是同一枚硬币的对立面，因为对IO并发性级别的需求是相互冲突的。为了解决这一挑战，本文提出了PSLO框架，该框架通过精确协调每个VM问题队列的IO并发级别和到达率来支持合并VM环境下的第x百分位延迟和吞吐量slo。值得注意的是，PSLO可以充分利用SLO约束所允许的可用IO容量，以最大的努力提高吞吐量或减少延迟。我们在Xen创建的真实虚拟机整合环境中设计并实现了一个PSLO原型。我们广泛的跟踪驱动原型评估表明，我们的系统能够在SLO约束下优化合并vm的第x百分位延迟和吞吐量。

Notes:

## Reconciling high server utilization and sub-millisecond quality-of-service

Authors: Jacob Leverich; Christos Kozyrakis

Conference : EuroSys '14

Tags: `important`,`QoS`,`scheduler`

Url: <https://doi.org/10.1145/2592798.2592821>

Abstract: The simplest strategy to guarantee good quality of service (QoS) for a latency-sensitive workload with sub-millisecond latency in a shared cluster environment is to never run other workloads concurrently with it on the same server. Unfortunately, this inevitably leads to low server utilization, reducing both the capability and cost effectiveness of the cluster. In this paper, we analyze the challenges of maintaining high QoS for low-latency workloads when sharing servers with other workloads. We show that workload co-location leads to QoS violations due to increases in queuing delay, scheduling delay, and thread load imbalance. We present techniques that address these vulnerabilities, ranging from provisioning the latency-critical service in an interference aware manner, to replacing the Linux CFS scheduler with a scheduler that provides good latency guarantees and fairness for co-located workloads. Ultimately, we demonstrate that some latency-critical workloads can be aggressively co-located with other workloads, achieve good QoS, and that such co-location can improve a datacenter's effective throughput per TCO-\$ by up to 52%.

摘要翻译： 在共享集群环境中，对于延迟敏感且延迟低于毫秒的工作负载，保证良好服务质量(QoS)的最简单策略是永远不要在同一台服务器上与它并发运行其他工作负载。不幸的是，这将不可避免地导致低服务器利用率，从而降低集群的能力和成本效益。在本文中，我们分析了在与其他工作负载共享服务器时为低延迟工作负载保持高QoS的挑战。我们表明，由于队列延迟、调度延迟和线程负载不平衡的增加，工作负载共定位会导致QoS违规。我们提出了解决这些漏洞的技术，从以干扰感知的方式提供延迟关键服务，到用一个为共置工作负载提供良好延迟保证和公平性的调度器替换Linux CFS调度器。最终，我们证明了一些延迟关键型工作负载可以积极地与其他工作负载共存，从而实现良好的QoS，并且这种共存可以将数据中心的每TCO-\$的有效吞吐量提高52%。

Notes:

## CPI2: CPU performance isolation for shared compute clusters

Authors: Xiao Zhang; Eric Tune; Robert Hagmann; Rohit Jnagal; Vrigo Gokhale; John Wilkes

Conference : EuroSys '13

Tags: `isolation`,`scheduler`

Url: <https://doi.org/10.1145/2465351.2465388>

Abstract: Performance isolation is a key challenge in cloud computing. Unfortunately, Linux has few defenses against performance interference in shared resources such as processor caches and memory buses, so applications in a cloud can experience unpredictable performance caused by other programs' behavior. Our solution, CPI2, uses cycles-per-instruction (CPI) data obtained by hardware performance counters to identify problems, select the likely perpetrators, and then optionally throttle them so that the victims can return to their expected behavior. It automatically learns normal and anomalous behaviors by aggregating data from multiple tasks in the same job. We have rolled out CPI2 to all of Google's shared compute clusters. The paper presents the analysis that lead us to that outcome, including both case studies and a large-scale evaluation of its ability to solve real production issues.

摘要翻译： 性能隔离是云计算中的一个关键挑战。不幸的是，Linux对共享资源(如处理器缓存和内存总线)中的性能干扰几乎没有防御措施，因此云中的应用程序可能会遇到由其他程序的行为引起的不可预测的性能。我们的解决方案CPI2使用硬件性能计数器获得的每指令周期(CPI)数据来识别问题，选择可能的肇事者，然后有选择地限制它们，以便受害者可以恢复到预期的行为。它通过聚合来自同一工作中多个任务的数据，自动学习正常和异常行为。我们已经在所有谷歌的共享计算集群上推出了CPI2。本文介绍了导致我们得出这一结果的分析，包括案例研究和对其解决实际生产问题的能力的大规模评估。

Notes:

利用CPI信息对异常应用做节流，来保证云服务的运行稳定性(QoS)

## A Comparative Analysis of Linux Mandatory Access Control Policy Enforcement Mechanisms

Authors: Brennon Brimhall; Justin Garrard; Christopher De La Garza; Joel Coffman

Conference : EUROSEC '23

Tags: `eBPF`,`eBPF performance`

Url: <https://dl.acm.org/doi/10.1145/3578357.3589454>

Abstract: Unix---and by extension, Linux---traditionally uses a discretionary access control (DAC) paradigm. DAC mechanisms are decentralized by design, which makes it difficult to audit the security of a computer system. Furthermore, Unix systems have the concept of a root user who can bypass any DAC policies in place. These issues led to the development of mandatory access control (MAC) mechanisms, such as AppArmor, Security-Enhanced Linux (SELinux), and eBPF. We compare and contrast the performance differences between two popular MAC mechanisms for the Linux kernel: SELinux and Berkeley Packet Filter (BPF)/kernel runtime security implementation (KRSI). We demonstrate that BPF policies offer superior performance, have greater expressive power, and are easier to implement than comparable SELinux policies. Our results suggest that BPF/KRSI is the leading MAC mechanism for Linux systems.

摘要翻译： Unix——以及扩展到Linux——传统上使用自主访问控制(DAC)范式。DAC机制在设计上是分散的，这使得审计计算机系统的安全性变得困难。此外，Unix系统有一个可以绕过任何DAC策略的根用户的概念。这些问题导致了强制访问控制(MAC)机制的开发，例如AppArmor、Security-Enhanced Linux (SELinux)和eBPF。我们比较和对比了Linux内核中两种流行的MAC机制:SELinux和伯克利包过滤(BPF)/内核运行时安全实现(KRSI)之间的性能差异。我们证明了BPF策略提供了优越的性能，具有更强的表达能力，并且比类似的SELinux策略更容易实现。我们的研究结果表明，BPF/KRSI是Linux系统的主要MAC机制。

Notes:

这篇论文对eBPF的性能做出了评估，可以作为我们引言的引用论文

## Look Ma, no constants: practical constant blinding in GraalVM

Authors: Felix Berlakovich; Matthias Neugschwandtner; Gergö Barany

Conference : EuroSec '22

Tags: `JIT编译随机化`

Url: <https://doi.org/10.1145/3517208.3523751>

Abstract: With the advent of JIT compilers, code-injection attacks have seen a revival in the form of JIT spraying. JIT spraying enables an attacker to inject gadgets into executable memory, effectively sidestepping W⊕X and ASLR. In response to JIT spraying, constant blinding has emerged as a conceptually straightforward and performance friendly defense. Unfortunately, increasingly sophisticated attacks have pinpointed the shortcomings of existing constant blinding implementations. In this paper we present our constant blinding implementation in the GraalVM compiler, enabling constant blinding across a wide range of languages. Our implementation takes insights from the last decade of research on the security of constant blinding into account. We discuss important design decisions and trade-offs as well as the practical implementation issues encountered when implementing constant blinding for GraalVM. We evaluate the performance impact of our implementation with different configurations and demonstrate its effectiveness by fuzzing for unblinded constants.

摘要翻译： 随着JIT编译器的出现，代码注入攻击以JIT喷射的形式重新流行起来。JIT喷涂使攻击者能够将小工具注入可执行内存，有效地避开了W⊕X和ASLR。为了应对JIT喷洒，持续致盲已经成为一种概念上简单且性能友好的防御方法。不幸的是，越来越复杂的攻击已经指出了现有的持续致盲实现的缺点。在本文中，我们展示了GraalVM编译器中的恒盲实现，使恒盲能够跨多种语言实现。我们的实施考虑了过去十年对持续致盲安全性研究的见解。我们讨论了重要的设计决策和权衡，以及在为GraalVM实现持续盲化时遇到的实际实现问题。我们用不同的配置评估了我们的实现对性能的影响，并通过模糊化非盲常数来证明其有效性。

Notes:

## syslrn: learning what to monitor for efficient anomaly detection

Authors: Davide Sanvito; Giuseppe Siracusano; Sharan Santhanam; Roberto Gonzalez; Roberto Bifulco

Conference : EuroMLSys '22

Tags: `important`

Url: <https://doi.org/10.1145/3517207.3526979>

Abstract: While monitoring system behavior to detect anomalies and failures is important, existing methods based on log-analysis can only be as good as the information contained in the logs, and other approaches that look at the OS-level software state introduce high overheads. We tackle the problem with syslrn, a system that first builds an understanding of a target system offline, and then tailors the online monitoring instrumentation based on the learned identifiers of normal behavior. While our syslrn prototype is still preliminary and lacks many features, we show in a case study for the monitoring of OpenStack failures that it can outperform state-of-the-art log-analysis systems with little overhead.

摘要翻译： 虽然监视系统行为以检测异常和故障很重要，但基于日志分析的现有方法只能与日志中包含的信息一样好，而其他查看操作系统级软件状态的方法会带来很高的开销。我们用syslrn解决了这个问题，这个系统首先建立了对离线目标系统的理解，然后根据学习到的正常行为标识符定制在线监控仪器。虽然我们的系统原型仍然是初步的，并且缺乏许多功能，但我们在一个用于监控OpenStack故障的案例研究中表明，它可以以很少的开销胜过最先进的日志分析系统。

Notes:

监控系统先进行静态分析，只对静态分析得到的非常规路径进行动态监控，保证了监控系统同时拥有高性能和最好的错误处理能力

## An Evaluation of Service Mesh Frameworks for Edge Systems

Authors: Yehia Elkhatib; Jose Povedano Poyato

Conference : EdgeSys '23

Tags: `I/O performance`,`useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/3578354.3592867>

Abstract: Service Mesh Technologies (SMTs) are increasingly popular in simplifying the networking between microservices. They allow one to declaratively and programmatically define service-to-service policies and interactions, and take all sorts of network management logic (e.g., traffic splitting, request tracing, security, reliability) out of the application. This simplifies the development of microservice architectures, which are widely used in cloud and edge applications. However, the suitability for different SMTs for use in edge applications is unclear. Thus, this work compares the two most popular SMTs (Istio and Linkerd) in terms of performance and overhead for resource-constrained devices. Through extensive experimentation and comparing with a baseline of standard networking in a Kubernetes cluster, we identify that Linkerd offers a more edge-friendly SMT option in contrast to Istio. Overall, Istio's communications are ≈10% slower than Linkerd at an increased 1.2--1.4x more memory and ≈1.2x more CPU utilization.

摘要翻译： 服务网格技术(smt)在简化微服务之间的网络方面越来越受欢迎。它们允许以声明式和编程方式定义服务到服务的策略和交互，并将各种网络管理逻辑(例如，流量分割、请求跟踪、安全性、可靠性)从应用程序中取出。这简化了微服务架构的开发，微服务架构在云和边缘应用程序中被广泛使用。然而，在边缘应用中使用不同smt的适用性尚不清楚。因此，本文就资源受限设备的性能和开销对两种最流行的smt (Istio和Linkerd)进行了比较。通过广泛的实验，并与Kubernetes集群中的标准网络基线进行比较，我们发现与Istio相比，Linkerd提供了一个更加边缘友好的SMT选项。总体而言，Istio的通信速度比linkard慢约10%，内存增加1.2- 1.4倍，CPU利用率增加约1.2倍。

Notes:

做了Linux上各种I/O接口的性能评估，其I/O性能的结论可能对调度器有用？

## ComB: a flexible, application-oriented benchmark for edge computing

Authors: Simon Bäurle; Nitinder Mohan

Conference : EdgeSys '22

Tags: `useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/3517206.3526269>

Abstract: Edge computing is an attractive platform where applications, previously hosted in the cloud, shift parts of their workload on resources closer to the users. The field is still in its nascent stages with significant ongoing innovation in small form-factor hardware designed to operate at the edge. However, the increased hardware heterogeneity at the edge makes it difficult for application developers to determine if their workloads will operate as desired. Simultaneously, edge providers have to make expensive deployment choices for the "correct" hardware that will remain suitable for the near future. We present ComB, an application-oriented benchmarking suite for edge that assists early adopters in evaluating the suitability of an edge deployment. ComB is flexible, extensible, and incorporates a microservice-based video analytics pipeline as default workload to measure underlying hardware's compute and networking capabilities accurately. Our evaluation on a heterogeneous testbed shows that ComB enables both providers and developers to understand better the runtime capabilities of different hardware configurations for supporting operations of applications designed for the edge.

摘要翻译： 边缘计算是一个有吸引力的平台，以前托管在云中的应用程序可以将部分工作负载转移到更靠近用户的资源上。该领域仍处于起步阶段，在设计用于边缘操作的小尺寸硬件方面正在进行重大创新。然而，边缘硬件异构性的增加使得应用程序开发人员很难确定他们的工作负载是否会按预期运行。同时，边缘提供商必须为“正确的”硬件做出昂贵的部署选择，这些硬件将在不久的将来仍然适用。我们提出ComB，这是一个面向应用程序的边缘基准测试套件，可帮助早期采用者评估边缘部署的适用性。ComB灵活、可扩展，并将基于微服务的视频分析管道作为默认工作负载，以准确测量底层硬件的计算和网络能力。我们对异构测试平台的评估表明，ComB使提供商和开发人员能够更好地理解不同硬件配置的运行时功能，以支持为边缘设计的应用程序的操作。

Notes:

## eCaaS: A Management Framework of Edge Container as a Service for Business Workload

Authors: Lianjie Cao; Anu Merican; Diman Zad Tootaghaj; Faraz Ahmed; Puneet Sharma; Vinay Saxena

Conference : EdgeSys '21

Tags: `useless(probably)`

Url: <https://doi.org/10.1145/3434770.3459741>

Abstract: Enterprises are containerizing their business applications and extending those applications from cloud to edge to achieve better flexibility, agility, and performance for their business workload. Unlike data centers, edge sites including infrastructure and orchestration systems are often heterogeneous and highly customized depending on the resource availability, business requirements of the use case, and technical requirements of the application. However, in many business use cases, the lack of IT professionals with proper domain expertise makes it very challenging to create, manage, and support heterogeneous containerized edge sites at a large scale. In this work, we present the eCaaS framework that provides automated lifecycle management of containerized edge sites and applications. With eCaaS, users can create customized edge sites with only high-level business intents which are analyzed and translated to deployment templates with low-level specifications. The edge site deployment templates are then automatically executed to build, deploy, and configure the containerized edge sites and applications. To support more customization options in the future, eCaaS decouples user intents, deployment rules, and deployment specifications and formulates deployment template generation as an SMT problem to achieve better scalability and extensibility. For creating an edge site with five nodes, eCaaS takes less than one second to generate the deployment template and less than ten minutes to complete the entire deployment.

摘要翻译： 企业正在将其业务应用程序容器化，并将这些应用程序从云扩展到边缘，以便为其业务工作负载实现更好的灵活性、敏捷性和性能。与数据中心不同，包括基础设施和编排系统在内的边缘站点通常是异构的，并且根据资源可用性、用例的业务需求和应用程序的技术需求进行高度定制。然而，在许多业务用例中，缺乏具有适当领域专业知识的IT专业人员使得大规模地创建、管理和支持异构容器化边缘站点变得非常具有挑战性。在这项工作中，我们提出了eCaaS框架，它提供了容器化边缘站点和应用程序的自动化生命周期管理。使用eCaaS，用户可以创建仅具有高级业务意图的自定义边缘站点，这些站点将被分析并转换为具有低级规范的部署模板。然后自动执行边缘站点部署模板，以构建、部署和配置容器化边缘站点和应用程序。为了支持未来更多的自定义选项，eCaaS将用户意图、部署规则和部署规范解耦，并将部署模板生成作为一个SMT问题来表述，以实现更好的可伸缩性和可扩展性。创建5节点边缘站点时，eCaaS生成部署模板的时间不超过1秒，整个部署过程不超过10分钟。

Notes:

## Snowflakes at the Edge: A Study of Variability among NVIDIA Jetson AGX Xavier Boards

Authors: Hazem A. Abdelhafez; Hassan Halawa; Karthik Pattabiraman; Matei Ripeanu

Conference : EdgeSys '21

Tags: `useless(probably)`

Url: <https://doi.org/10.1145/3434770.3459729>

Abstract: While applications deployed at the edge often rely on performance stability (or, at a minimum, on a predictable level of performance), variability at the edge remains a real problem \[4]. This study uncovers a surprising source of variability: intrinsic variability (in performance and power consumption) among edge platforms that are nominally identical. We focus on a popular platform designed for edge applications, the NVIDIA Jetson AGX, and aim to answer the following high-level questions through rigorous statistical analysis: (i) are the edge devices in our study statistically different from each other in terms of applications' runtime performance and power draw (although they are sold under the same product model and family)?, (ii) if the differences between these edge devices are statistically significant, what is the magnitude of these differences?, and (iii) do these differences matter from the application's perspective?

摘要翻译： 虽然部署在边缘的应用程序通常依赖于性能稳定性(或者至少依赖于可预测的性能水平)，但边缘的可变性仍然是一个真正的问题\[4]。这项研究揭示了一个令人惊讶的可变性来源:在名义上相同的边缘平台之间的内在可变性(性能和功耗)。我们专注于一个为边缘应用设计的流行平台，NVIDIA Jetson AGX，旨在通过严格的统计分析来回答以下高级问题:(i)在我们的研究中，边缘设备在应用程序的运行时性能和功耗方面是否存在统计差异(尽管它们在同一产品型号和系列下销售)?(ii)如果这些边缘设备之间的差异在统计上显着，这些差异的大小是多少?(iii)从应用程序的角度来看，这些差异是否重要?

Notes:

## ExEC: Elastic Extensible Edge Cloud

Authors: Aleksandr Zavodovski; Nitinder Mohan; Suzan Bayhan; Walter Wong; Jussi Kangasharju

Conference : EdgeSys '19

Tags: `useless(probably)`

Url: <https://doi.org/10.1145/3301418.3313941>

Abstract: Edge computing (EC) extends the centralized cloud computing paradigm by bringing computation into close proximity to the end-users, to the edge of the network, and is a key enabler for applications requiring low latency such as augmented reality or content delivery. To make EC pervasive, the following challenges must be tackled: how to satisfy the growing demand for edge computing facilities, how to discover the nearby edge servers, and how to securely access them? In this paper, we present ExEC, an open framework where edge providers can offer their capacity and be discovered by application providers and end-users. ExEC aims at the unification of interaction between edge and cloud providers so that cloud providers can utilize services of third-party edge providers, and any willing entity can easily become an edge provider. In ExEC, the unfolding of initially cloud-deployed application towards edge happens without administrative intervention, since ExEC discovers available edge providers on the fly and monitors incoming end-user traffic, determining the near-optimal placement of edge services. ExEC is a set of loosely coupled components and common practices, allowing for custom implementations needed to embrace the diverse needs of specific EC scenarios. ExEC leverages only existing protocols and requires no modifications to the deployed infrastructure. Using real-world topology data and experiments on cloud platforms, we demonstrate the feasibility of ExEC and present results on its expected performance.

摘要翻译： 边缘计算(EC)扩展了集中式云计算范例，使计算更接近最终用户和网络边缘，并且是需要低延迟的应用程序(如增强现实或内容交付)的关键推动因素。要使电子商务普及，必须解决以下挑战:如何满足对边缘计算设施日益增长的需求，如何发现附近的边缘服务器，以及如何安全地访问它们?在本文中，我们介绍了ExEC，这是一个开放框架，边缘提供商可以在其中提供其容量，并被应用程序提供商和最终用户发现。ExEC旨在统一边缘和云提供商之间的交互，使云提供商可以利用第三方边缘提供商的服务，任何愿意的实体都可以轻松成为边缘提供商。在ExEC中，最初的云部署应用程序向边缘的展开是在没有管理干预的情况下进行的，因为ExEC可以动态地发现可用的边缘提供商，并监控传入的最终用户流量，确定边缘服务的近乎最佳的位置。ExEC是一组松散耦合的组件和常用实践，允许定制实现以满足特定EC场景的不同需求。ExEC仅利用现有协议，不需要修改已部署的基础设施。利用实际拓扑数据和云平台上的实验，我们证明了ExEC的可行性，并给出了其预期性能的结果。

Notes:

是原云服务应用迁移到边缘的自动化组件工具，提供给客户最优边缘服务器，边缘服务器是在线发现的，无须停机增加边缘服务器数据

## QoS-based Cloud Application Management: Approach and Architecture

Authors: Vladimir Podolskiy; Hans Michael Gerndt; Shajulin Benedict

Conference : Crosscloud'17

Tags: `QoS`

Url: <https://dl.acm.org/doi/10.1145/3069383.3069390>

Abstract: The management of cloud infrastructures became a lot more difficult in course of last years due to the growing demand for high quality of cloud services. The lack of the ability to adapt the existing services to the dynamically changing demand from users' side yields problems of the quality of the provided services. In the poster, we present a novel decentralized architecture and approach for automatic cloud resources management under QoS requirements and budget constraints. The proposed architecture is aimed at dynamically adapting cloud application deployment on different levels of cloud infrastructure in order to meet QoS requirements and to reduce cost of cloud services.

摘要翻译： 由于对高质量云服务的需求不断增长，云基础设施的管理在过去几年中变得更加困难。由于缺乏使现有服务适应用户方面不断变化的需求的能力，所提供服务的质量出现了问题。在海报中，我们提出了一种新的分散架构和方法，用于在QoS要求和预算约束下自动管理云资源。提出的体系结构旨在动态调整云应用程序在不同级别云基础设施上的部署，以满足QoS要求并降低云服务成本。

Notes:

所提出的体系结构旨在动态调整云应用程序在不同级别的云基础设施上的部署，以满足QoS要求并降低云服务的成本。（还得往下看，摘要写得不是很清楚）

## Performance Characterization of Modern Storage Stacks: POSIX I/O, libaio, SPDK, and io\_uring

Authors: Zebin Ren; Animesh Trivedi

Conference : CHEOPS '23

Tags: `I/O performance`

Url: <https://dl.acm.org/doi/10.1145/3578353.3589545>

Abstract: Linux storage stack offers a variety of storage I/O stacks and APIs such as POSIX I/O, asynchronous I/O (libaio), high-performance asynchronous I/O (emerging io\_uring) or SPDK, the last of which completely bypasses the kernel. Despite their availability, there has not been a systematic study of their performance and overheads. In order to aid our understanding, in this work we systematically characterize performance, scalability and microarchitectural properties of popular Linux I/O APIs on high-performance storage hardware (Intel Optane SSDs). Our characterization reveals that: (1) at low I/O loads, all APIs perform competitively with each other, with polling helping the performance by 1.7X, but consuming 2.3X CPU instructions; (2) at high-loads and scale, io\_uring is more than an order of magnitude slower than SPDK; (3) at high-loads and scale, the benchmarking tool (fio) itself becomes a bottleneck; (4) state-of-practice Linux block I/O schedulers (BFQ, mq-deadline, and Kyber) introduce significant (up to 50%) overheads, and their use of global locks hinder their scalability. All artifacts from this work are available at <https://github.com/atlarge-research/Performance-Characterization-Storage-Stacks>.

摘要翻译： Linux存储堆栈提供了各种存储I/O堆栈和api，如POSIX I/O、异步I/O (libaio)、高性能异步I/O(新兴的io\_uring)或SPDK，后者完全绕过内核。尽管它们是可用的，但还没有对它们的性能和开销进行系统的研究。为了帮助我们理解，在这项工作中，我们系统地描述了高性能存储硬件(英特尔Optane ssd)上流行的Linux I/O api的性能、可扩展性和微架构属性。我们的特征揭示了:(1)在低I/O负载下，所有api相互竞争执行，轮询帮助性能提高1.7倍，但消耗2.3倍的CPU指令;(2)在高负载和规模下，io\_uring比SPDK慢一个数量级以上;(3)在高负载和规模下，基准测试工具(fio)本身成为瓶颈;(4)实践状态的Linux块I/O调度程序(BFQ、mq-deadline和Kyber)引入了大量(高达50%)的开销，并且它们对全局锁的使用阻碍了它们的可伸缩性。这项工作的所有工件都可以在[https://github.com/atlarge-research/Performance-Characterization-Storage-Stacks上获得。](https://github.com/atlarge-research/Performance-Characterization-Storage-Stacks%E4%B8%8A%E8%8E%B7%E5%BE%97%E3%80%82)

Notes:

做了Linux上各种存储、I/O接口的性能评估，其I/O性能的结论可能对调度器有用？
