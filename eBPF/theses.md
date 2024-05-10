## Dissecting Overheads of Service Mesh Sidecars

Authors: Xiangfeng Zhu; Guozhen She; Bowen Xue; Yu Zhang; Yongsu Zhang; Xuan Kelvin Zou; XiongChun Duan; Peng He; Arvind Krishnamurthy; Matthew Lentz; Danyang Zhuo; Ratul Mahajan

Conference : SoCC '23

Tags: `QoS`

Url: <https://dl.acm.org/doi/10.1145/3620678.3624652>

Abstract: Service meshes play a central role in the modern application ecosystem by providing an easy and flexible way to connect microservices of a distributed application. However, because of how they interpose on application traffic, they can substantially increase application latency and its resource consumption. We develop a tool called MeshInsight to help developers quantify the overhead of service meshes in deployment scenarios of interest and make informed trade-offs about their functionality vs. overhead. Using MeshInsight, we confirm that service meshes can have high overhead---up to 269% higher latency and up to 163% more virtual CPU cores for our benchmark applications---but the severity is intimately tied to how they are configured and the application workload. IPC (inter-process communication) and socket writes dominate when the service mesh operates as a TCP proxy, but protocol parsing dominates when it operates as an HTTP proxy. MeshInsight also enables us to study the end-to-end impact of optimizations to service meshes. We show that not all seemingly-promising optimizations lead to a notable overhead reduction in realistic settings.

摘要翻译： 服务网格通过提供一种简单灵活的方式连接分布式应用程序的微服务，在现代应用程序生态系统中发挥着核心作用。然而，由于它们如何介入应用程序流量，它们可能会大大增加应用程序延迟及其资源消耗。我们开发了一个名为MeshInsight的工具，帮助开发人员量化感兴趣的部署场景中服务网格的开销，并对其功能与开销进行明智的权衡。使用MeshInsight，我们确认服务网格可能会有很高的开销——我们的基准应用程序的延迟高达269%，虚拟CPU核心高达163%——但严重程度与它们的配置方式和应用程序工作负载密切相关。当服务网格作为TCP代理运行时，IPC（进程间通信）和套接字写入占主导地位，但当它作为HTTP代理运行时协议解析占主导地位。MeshInsight还使我们能够研究端到端

Notes:

提供了一种服务网格的负载开销监控工具，还用这个工具实现了不那么显而易见的端到端的优化以显著降低负载开销

## Gödel: Unified Large-Scale Resource Management and Scheduling at ByteDance

Authors: Wu Xiang; Yakun Li; Yuquan Ren; Fan Jiang; Chaohui Xin; Varun Gupta; Chao Xiang; Xinyi Song; Meng Liu; Bing Li; Kaiyang Shao; Chen Xu; Wei Shao; Yuqi Fu; Wilson Wang; Cong Xu; Wei Xu; Caixue Lin; Rui Shi; Yuming Liang

Conference : SoCC '23

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/3620678.3624663>

Abstract: Over the last few years, at ByteDance, our compute infrastructure scale has been expanding significantly due to expedited business growth. In this journey, to meet hyper-scale growth, some business groups resorted to managing their own compute infrastructure stack running different scheduling systems such as Kubernetes, YARN which created two major pain points: the increasing resource fragmentation across different business groups and the inadequate resource elasticity between workloads of different business priorities. Isolation across different business groups (and their compute infrastructure management) leads to inefficient compute resource utilization and prevents us from serving the business growth needs in the long run. To meet these challenges, we propose a resource management and scheduling system named Gödel, which provides a unified compute infrastructure for all business groups to run their diverse workloads under a unified resource pool. It co-locates various workloads on every machine to achieve better resource utilization and elasticity. Gödel is built upon Kubernetes, the de facto open-source container orchestration system, but with significant components replaced or enhanced to accommodate various workloads at a large scale. In production, it manages clusters with tens of thousands of machines, achieves high overall resource utilization of over 60%, and scheduling throughput of up to 5000 pods per second. This paper reports on our design and implementation with Gödel. Moreover, it discusses the lessons and best practices we learned in developing and operating it in production at ByteDance's scale.

摘要翻译： 在过去的几年里，在字节跳动，由于业务增长的加快，我们的计算基础设施规模一直在显著扩大。在这一过程中，为了满足超规模增长，一些业务组求助于管理自己的计算基础设施堆栈，这些堆栈运行不同的调度系统，如Kubernetes、YARN，这造成了两个主要的痛点：不同业务组之间的资源碎片越来越大，以及不同业务优先级的工作负载之间的资源弹性不足。不同业务组之间的隔离（及其计算基础设施管理）导致计算资源利用效率低下，并使我们无法长期满足业务增长需求。为了应对这些挑战，我们提出了一个名为Gödel的资源管理和调度系统，该系统为所有业务组提供了一个统一的计算基础设施，以便在统一的资源池下运行其不同的工作负载。它将各种工作负载放在

Notes:

由于商业组隔离导致资源碎片（例如重复存储的资源）以及内部资源与其他商业组的资源不平衡、不一致的弹性的问题，做了一个k8s上的全局资源管理和调度系统

很粗暴，乍一眼看起来没什么学术价值，只是量比较大而已

## Not All Resources are Visible: Exploiting Fragmented Shadow Resources in Shared-State Scheduler Architecture

Authors: Xinkai Wang; Hao He; Yuancheng Li; Chao Li; Xiaofeng Hou; Jing Wang; Quan Chen; Jingwen Leng; Minyi Guo; Leibo Wang

Conference : SoCC '23

Tags: `QoS`,`scheduler`

Url: <https://dl.acm.org/doi/10.1145/3620678.3624650>

Abstract: With the rapid development of cloud computing, the increasing scale of clusters and task parallelism put forward higher requirements on the scheduling capability at scale. To this end, the shared-state scheduler architecture has emerged as the popular solution for large-scale scheduling due to its high scalability and utilization. In such an architecture, a central resource state view periodically updates the global cluster status to distributed schedulers for parallel scheduling. However, the schedulers obtain broader resource views at the cost of intermittently stale states, rendering resources released invisible to schedulers until the next view update. These fleeting resource fragments are referred to as shadow resources in this paper. Current shared-state solutions overlook or fail to systematically utilize the shadow resources, leaving a void in fully exploiting these invisible resources. In this paper, we present a thorough analysis of shadow resources through theoretic modeling and extensive experiments. In order to systematically utilize these resources, we propose Resource Miner (RMiner), a hybrid scheduling sub-system on top of the shared-state scheduler architecture. RMiner comprises three cooperative components: a shadow resource manager that efficiently manages shadow resources, an RM filter that selects suitable tasks as RM tasks, and an RM scheduler that allocates shadow resources to RM tasks. In total, our design enhances the visibility of shared-state scheduling solutions by adding manageability to invisible resources. Through extensive trace-driven evaluation, we show that RMiner greatly outperforms current shared-state schedulers in terms of resource utilization, task throughput, and job wait time with only minor costs of scheduling conflicts and overhead.

摘要翻译： 随着云计算的快速发展，集群规模和任务并行性的不断增加，对大规模调度能力提出了更高的要求。为此，共享状态调度器体系结构由于其高可扩展性和利用率而成为大规模调度的流行解决方案。在这样的体系结构中，中央资源状态视图定期向分布式调度器更新全局集群状态以进行并行调度。然而，调度器以间歇性陈旧状态为代价获得更广泛的资源视图，从而使释放的资源在下一次视图更新之前对调度器不可见。这些稍纵即逝的资源片段在本文中被称为影子资源。当前的共享状态解决方案忽视或未能系统地利用影子资源，从而在充分利用这些无形资源方面留下空白。在本文中，我们通过理论建模对阴影资源进行了深入的分析

Notes:

现有的大规模集群的调度器一般分为两层：全局状态共享调度器和局部调度器，全局状态共享调度器定期检查资源情况以通知局部调度器进行相应的容器的调度。但两次定期检查之间会出现资源已经被释放但没有容器能够使用的情况，这种状态的资源在文中称为“影子资源”，文中提出的调度器就是在全局调度器的基础上增设了一个管理“影子资源”的调度器，提高了全局调度器对不可见资源的资源管理能力。

> 这个架构听起来很美好，但性能开销究竟如何呢？

## Workload consolidation in alibaba clusters: the good, the bad, and the ugly

Authors: Yongkang Zhang; Yinghao Yu; Wei Wang; Qiukai Chen; Jie Wu; Zuowei Zhang; Jiang Zhong; Tianchen Ding; Qizhen Weng; Lingyun Yang; Cheng Wang; Jian He; Guodong Yang; Liping Zhang

Conference : SoCC '22

Tags: `scheduler`,`useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/3542929.3563465>

Abstract: Web companies typically run latency-critical long-running services and resource-intensive, throughput-hungry batch jobs in a shared cluster for improved utilization and reduced cost. Despite many recent studies on workload consolidation, the production practice remains largely unknown. This paper describes our efforts to efficiently consolidate the two types of workloads in Alibaba clusters to support the company's e-commerce businesses. At the cluster level, the host and GPU memory are the bottleneck resources that limit the scale of consolidation. Our system proactively reclaims the idle host memory pages of service jobs and dynamically relinquishes their unused host and GPU memory following the predictable diurnal pattern of user traffic, a technique termed tidal scaling. Our system further performs node-level micro-management to ensure that the increased workload consolidation does not result in harmful resource contention. We briefly share our experience in handling the surging traffic with flash-crowd customers during the seasonal shopping festivals (e.g., November 11) using these "good" practices. We also discuss the limitations of our current solution (the "bad") and some practical engineering constraints (the "ugly") that make many prior research solutions inapplicable to our system.

摘要翻译： Web公司通常在共享集群中运行延迟关键的长期服务和资源密集型、吞吐量高的批处理作业，以提高利用率并降低成本。尽管最近对工作量合并进行了许多研究，但生产实践在很大程度上仍是未知的。本文描述了我们在阿里巴巴集群中高效整合这两种工作负载以支持公司的电子商务业务的努力。在集群级别，主机和GPU内存是限制整合规模的瓶颈资源。我们的系统主动回收服务作业的空闲主机内存页，并根据可预测的用户流量昼夜模式动态放弃其未使用的主机和GPU内存，这是一种称为潮汐缩放的技术。我们的系统进一步执行节点级微观管理，以确保增加的工作负载整合不会导致有害的资源争用。我们简单地分享一下我们处理激增的tr的经验

Notes:

对分得过小的工作负载进行合并，也是商用大规模集群的

## KOLE: breaking the scalability barrier for managing far edge nodes in cloud

Authors: Jie Zhang; Chen Jin; YuQi Huang; Li Yi; Yu Ding; Fei Guo

Conference : SoCC '22

Tags: `useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/3542929.3563462>

Abstract: In edge computing, the trend is moving towards leveraging cloud native technologies and platforms such as con-tainerization and Kubernetes to manage edge applications to improve operation efficiency. Unfortunately, the supported number of nodes per cluster is only several thousand in Kubernetes which is much less than what typical far edge use cases require. In this paper, we propose KOLE, a framework that extends the upstream Kubernetes for supporting a large number of far edge nodes. It replaces the existing apiserver-to-node communication mechanism in Kubernetes with a MQTT messaging system. The MQTT broker completely offloads the overhead of keeping numerous HTTP connections for nodes in the apiserver. In KOLE, we avoid creating numerous individual objects in the apiserver by maintaining them in a cloud state cache. The cache is snapshotted periodically for disaster recovery. Overall, KOLE achieves outstanding scalability by sacrificing the manageability of having individual objects, which we believe is a reasonable trade-off for far edge use cases. The experiment results show that KOLE is scalable and can support up to one million nodes.

摘要翻译： 在边缘计算领域，趋势是利用云原生技术和平台，如容器化和Kubernetes来管理边缘应用程序，以提高运营效率。不幸的是，在Kubernetes中，每个集群支持的节点数量只有几千个，远远低于典型的远边缘用例所需的数量。在本文中，我们提出了KOLE，这是一个扩展上游Kubernetes以支持大量远边缘节点的框架。它用MQTT消息传递系统取代了Kubernetes中现有的apiserver-to-node通信机制。MQTT代理完全免除了为apiserver中的节点保留大量HTTP连接的开销。在KOLE中，我们通过在云状态缓存中维护单个对象来避免在apiserver中创建大量单个对象。缓存会定期进行快照以进行灾难恢复。总体而言，KOLE通过牺牲单个对象的可管理性来实现卓越的可扩展性

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

摘要翻译： 云数据中心的能源消耗已成为温室气体排放和运营成本的一个越来越重要的因素。为了降低与能源相关的成本并提高环境可持续性，大多数现代数据中心整合属于不同应用程序类别的虚拟机（VM）工作负载，其中一些是延迟关键型（LC），而另一些则更能容忍性能变化，称为尽力而为（BE）。然而，在公共云场景中，应用程序的真实类别对数据中心运营商来说往往是不透明的。来自不同云租户的异构应用程序通常被整合到相同的主机上，以提高能源效率，但确保共存工作负载之间的良好性能隔离并非易事。我们通过引入Demeter来解决上述挑战，Demeter是一种用于公共云中异构黑匣子工作负载的QoS感知电源管理控制器。Demeter被设计为在没有离线分析或先验知识的情况下工作

Notes:

将容器内部视为黑箱，仅通过对其CPU利用率和网络负载的分析判断出容器是延迟关键型(Latancy Critical - LC)还是尽力而为型(Best Effort - BE)，以此实现降低功耗同时不失性能的调度

## Atoll: A Scalable Low-Latency Serverless Platform

Authors: Arjun Singhvi; Arjun Balasubramanian; Kevin Houck; Mohammed Danish Shaikh; Shivaram Venkataraman; Aditya Akella

Conference : SoCC '21

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/3472883.3486981>

Abstract: With user-facing apps adopting serverless computing, good latency performance of serverless platforms has become a strong fundamental requirement. However, it is difficult to achieve this on platforms today due to the design of their underlying control and data planes that are particularly ill-suited to short-lived functions with unpredictable arrival patterns. We present Atoll, a serverless platform, that overcomes the challenges via a ground-up redesign of the control and data planes. In Atoll, each app is associated with a latency deadline. Atoll achieves its per-app request latency goals by: (a) partitioning the cluster into (semi-global scheduler, worker pool) pairs, (b) performing deadline-aware scheduling and proactive sandbox allocation, and (c) using a load balancing layer to do sandbox-aware routing, and automatically scale the semi-global schedulers per app. Our results show that Atoll reduces missed deadlines by \~66x and tail latencies by \~3x compared to state-of-the-art alternatives.

摘要翻译： 随着面向用户的应用程序采用无服务器计算，无服务器平台良好的延迟性能已成为一个强大的基本要求。然而，由于其底层控制和数据平面的设计特别不适合具有不可预测到达模式的短暂功能，因此在今天的平台上很难实现这一点。我们介绍了Atoll，一个无服务器平台，它通过对控制和数据平面进行从头开始的重新设计来克服挑战。在Atoll中，每个应用程序都与延迟截止日期相关联。Atoll通过以下方式实现其每个应用程序的请求延迟目标：（a）将集群划分为（半全局调度器、工作池）对，（b）执行截止日期感知调度和主动沙盒分配，以及（c）使用负载平衡层进行沙盒感知路由，并自动按每个应用程序扩展半全局调度器。我们的研究结果表明，与最先进的al相比，Atoll将错过的最后期限减少了约66倍，尾部延迟减少了约3倍

Notes:

对serverless的一种调度器实现，有应用延迟的deadline，有每个worker池的半全局调度器，有负载均衡和弹性伸缩

## Tell me when you are sleepy and what may wake you up!

Authors: Djob Mvondo; Antonio Barbalace; Alain Tchana; Gilles Muller

Conference : SoCC '21

Tags: `eBPF`,`important`,`scheduler`

Url: <https://dl.acm.org/doi/10.1145/3472883.3487013>

Abstract: Nowadays, there is a shift in the deployment model of Cloud and Edge applications. Applications are now deployed as a set of several small units communicating with each other - the microservice model. Moreover, each unit - a microservice, may be implemented as a virtual machine, container, function, etc., spanning the different Cloud and Edge service models including IaaS, PaaS, FaaS. A microservice is instantiated upon the reception of a request (e.g., an http packet or a trigger), and a rack-level or data-center-level scheduler decides the placement for such unit of execution considering for example data locality and load balancing. With such a configuration, it is common to encounter scenarios where different units, as well as multiple instances of the same unit, may be running on a single server at the same time. When multiple microservices are running on the same server not necessarily all of them are doing actual processing, some may be busy-waiting - i.e., waiting for events (or requests) sent by other units. However, these "idle" units are consuming CPU time which could be used by other running units or cloud utility functions on the server (e.g., monitoring daemons). In a controlled experiment, we observe that units can spend up to 20% - 55% of their CPU time waiting, thus a great amount of CPU time is wasted; these values significantly grow when overcommitting CPU resources (i.e., units CPU reservations exceed server CPU capacity), where we observe up to 69% - 75%. This is a result of the lack of information/context about what is running in each unit from the server CPU scheduler perspective. In this paper, we first provide evidence of the problem and discuss several research questions. Then, we propose an handful of solutions worth exploring that consists in revisiting hypervisor and host OS scheduler designs to reduce the CPU time wasted on idle units. Our proposal leverages the concepts of informed scheduling, and monitoring for internal and external events. Based on the aforementioned solutions, we propose our initial implementation on Linux/KVM.

摘要翻译：undefined

Notes:

基本上就是在微服务这个应用场景下的实现的我们要实现的调度器（文章中有hypervisor的调度器，我们这里对应的是k8s的调度器）

## Mind the Gap: Broken Promises of CPU Reservations in Containerized Multi-tenant Clouds

Authors: Li Liu; Haoliang Wang; An Wang; Mengbai Xiao; Yue Cheng; Songqing Chen

Conference : SoCC '21

Tags: `important`,`scheduler`

Url: <https://dl.acm.org/doi/10.1145/3472883.3486997>

Abstract: Containerization is becoming increasingly popular, but unfortunately, containers often fail to deliver the anticipated performance with the allocated resources. In this paper, we first demonstrate the performance variance and degradation are significant (by up to 5x) in a multi-tenant environment where containers are co-located. We then investigate the root cause of such performance degradation. Contrary to the common belief that such degradation is caused by resource contention and interference, we find that there is a gap between the amount of CPU a container reserves and actually gets. The root cause lies in the design choices of today's Linux scheduling mechanism, which we call Forced Runqueue Sharing and Phantom CPU Time. In fact, there are fundamental conflicts between the need to reserve CPU resources and Completely Fair Scheduler's work-conserving nature, and this contradiction prevents a container from fully utilizing its requested CPU resources. As a proof-of-concept, we implement a new resource configuration mechanism atop the widely used Kubernetes and Linux to demonstrate its potential benefits and shed light on future scheduler redesign. Our proof-of-concept, compared to the existing scheduler, improves the performance of both batch and interactive containerized apps by up to 5.6x and 13.7x.

摘要翻译：undefined

Notes:

该文介绍了现有的Linux调度机制中CPU时间的计算方式和强制运行队列共享导致CFS调度算法下容器无法正确地预约需要的CPU资源数量。（对于CPU资源的管理角度来看相当关键）

## Secure Namespaced Kernel Audit for Containers

Authors: Soo Yee Lim; Bogdan Stelea; Xueyuan Han; Thomas Pasquier

Conference : SoCC '21

Tags:

Url: <https://dl.acm.org/doi/10.1145/3472883.3486976>

Abstract: Despite the wide usage of container-based cloud computing, container auditing for security analysis relies mostly on built-in host audit systems, which often lack the ability to capture high-fidelity container logs. State-of-the-art reference-monitor-based audit techniques greatly improve the quality of audit logs, but their system-wide architecture is too costly to be adapted for individual containers. Moreover, these techniques typically require extensive kernel modifications, making it difficult to deploy in practical settings. In this paper, we present saBPF (secure audit BPF), an extension of the eBPF framework capable of deploying secure system-level audit mechanisms at the container granularity. We demonstrate the practicality of saBPF in Kubernetes by designing an audit framework, an intrusion detection system, and a lightweight access control mechanism. We evaluate saBPF and show that it is comparable in performance and security guarantees to audit systems from the literature that are implemented directly in the kernel.

摘要翻译：undefined

Notes:

k8s中的安全审计功能，利用eBPF实现了容器粒度的全系统范围的日志审计框架（而非系统全局的）、指令探测系统和轻量级访问控制机制。

## Speedo: Fast dispatch and orchestration of serverless workflows

Authors: Nilanjan Daw; Umesh Bellur; Purushottam Kulkarni

Conference : SoCC '21

Tags: `useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/3472883.3486982>

Abstract: Structuring cloud applications as collections of interacting fine-grained microservices makes them scalable and affords the flexibility of hot upgrading parts of the application. The current avatar of serverless computing (FaaS) with its dynamic resource allocation and auto-scaling capabilities make it the deployment model of choice for such applications. FaaS platforms operate with user space dispatchers that receive requests over the network and make a dispatch decision to one of multiple workers (usually a container) distributed in the data center. With the granularity of microservices approaching execution times of a few milliseconds combined with loads approaching tens of thousands of requests a second, having a low dispatch latency of less than one millisecond becomes essential to keep up with line rates. When these microservices are part of a workflow making up an application, the orchestrator that coordinates the sequence in which microservices execute also needs to operate with microsecond latency. Our observations reveal that the most significant component of the dispatch/orchestration latency is the time it takes for the request to traverse into and out of the user space from the network. Motivated by the presence of a multitude of low power cores on today's SmartNICs, one approach to keeping up with these high line rates and the stringent latency expectations is to run both the dispatcher and the orchestrator close to the network on a SmartNIC. Doing so will save valuable cycles spent in transferring requests to and back from the user space. The operating characteristics of short-lived ephemeral state and low CPU burst requirements of FaaS dispatcher/orchestrator make them ideal candidates for offloading from the server to the NIC cores. This also brings other benefit of freeing up the server CPU. In this paper, we present Speedo--- a design for offloading of FaaS dispatch and orchestration services to the SmartNIC from the user space. We implemented Speedo on ASIC based Netronome Agilio SmartNICs and our comprehensive evaluation shows that Speedo brings down the dispatch latency from \~150ms to \~140μs at a load of 10K requests per second.

摘要翻译：undefined

Notes:

FaaS的与smartNIC联动的内容，应该对我们项目没什么帮助

## SHOWAR: Right-Sizing And Efficient Scheduling of Microservices

Authors: Ataollah Fatahi Baarzi; George Kesidis

Conference : SoCC '21

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/3472883.3486999>

Abstract: Microservices architecture have been widely adopted in designing distributed cloud applications where the application is decoupled into multiple small components (i.e. "microservices"). One of the challenges in deploying microservices is finding the optimal amount of resources (i.e. size) and the number of instances (i.e. replicas) for each microservice in order to maintain a good performance as well as prevent resource wastage and under-utilization which is not cost-effective. This paper presents SHOWAR, a framework that configures the resources by determining the number of replicas (horizontal scaling) and the amount of CPU and Memory for each microservice (vertical scaling). For vertical scaling, SHOWAR uses empirical variance in the historical resource usage to find the optimal size and mitigate resource wastage. For horizontal scaling, SHOWAR uses basic ideas from control theory along with kernel level performance metrics. Additionally, once the size for each microservice is found, SHOWAR bridges the gap between optimal resource allocation and scheduling by generating affinity rules (i.e. hints) for the scheduler to further improve the performance. Our experiments, using a variety of microservice applications and real-world workloads, show that, compared to the state-of-the-art autoscaling and scheduling systems, SHOWAR on average improves the resource allocation by up to 22% while improving the 99th percentile end-to-end user request latency by 20%.

摘要翻译：undefined

Notes:

微服务调度算法，做了横向扩展（replicaset）和纵向扩展（分配的CPU、内存等资源数）的调度。横向扩展用自定义的“亲和性”控制算法，纵向扩展用的历史资源分配情况。

## Cloud-Scale Runtime Verification of Serverless Applications

Authors: Kalev Alpernas; Aurojit Panda; Leonid Ryzhyk; Mooly Sagiv

Conference : SoCC '21

Tags: `debugger`

Url: <https://dl.acm.org/doi/10.1145/3472883.3486977>

Abstract: Serverless platforms aim to simplify the deployment, scaling, and management of cloud applications. Serverless applications are inherently distributed, and are executed using shortlived ephemeral processes. The use of short-lived ephemeral processes simplifies application scaling and management, but also means that existing approaches to monitoring distributed systems and detecting bugs cannot be applied to serverless applications. In this paper we propose Watchtower, a framework that enables runtime monitoring of serverless applications. Watchtower takes program properties as inputs, and can detect cases where applications violate these properties. We design Watchtower to minimize application changes, and to scale at the same rate as the application. We achieve the former by instrumenting libraries rather than application code, and the latter by structuring Watchtower as a serverless application. Once a bug is found, developers can use the Watchtower debugger to identify and address the root cause of the bug.

摘要翻译：undefined

Notes:

微服务的监控框架，由于检查要求的应用运行的属性是否满足，以及发现bug后使用其watchower调试器监测和解决问题

## Particle: ephemeral endpoints for serverless networking

Authors: Shelby Thomas; Lixiang Ao; Geoffrey M. Voelker; George Porter

Conference : SoCC '20

Tags: `QoS`

Url: <https://dl.acm.org/doi/10.1145/3419111.3421275>

Abstract: Burst-parallel serverless applications invoke thousands of short-lived distributed functions to complete complex jobs such as data analytics, video encoding, or compilation. While these tasks execute in seconds, starting and configuring the virtual network they rely on is a major bottleneck that can consume up to 84% of total startup time. In this paper we characterize the magnitude of this network cold start problem in three popular overlay networks, Docker Swarm, Weave, and Linux Overlay. We focus on end-to-end startup time that encompasses both the time to boot a group of containers as well as interconnecting them. Our primary observation is that existing overlay approaches for serverless networking scale poorly in short-lived serverless environments. Based on our findings we develop Particle, a network stack tailored for multi-node serverless overlay networks that optimizes network creation without sacrificing multi-tenancy, generality, or throughput. When integrated into a serverless burst-parallel video processing pipeline, Particle improves application runtime by 2.4--3X over existing overlays.

摘要翻译：undefined

Notes:

短寿命的微服务环境中多个应用程序之间的内部执行时间不是瓶颈，容器启动和网络互联（网络冷启动）所消耗的时间才是最主要的。particle是专门为这种多节点无服务的overlay网络场景设计的裁剪的网络协议栈，提高了网络互联的启动性能。

## Sequoia: enabling quality-of-service in serverless computing

Authors: Ali Tariq; Austin Pahl; Sharat Nimmagadda; Eric Rozner; Siddharth Lanka

Conference : SoCC '20

Tags: `QoS`

Url: <https://dl.acm.org/doi/10.1145/3419111.3421306>

Abstract: Serverless computing is a rapidly growing paradigm that easily harnesses the power of the cloud. With serverless computing, developers simply provide an event-driven function to cloud providers, and the provider seamlessly scales function invocations to meet demands as event-triggers occur. As current and future serverless offerings support a wide variety of serverless applications, effective techniques to manage serverless workloads becomes an important issue. This work examines current management and scheduling practices in cloud providers, uncovering many issues including inflated application run times, function drops, inefficient allocations, and other undocumented and unexpected behavior. To fix these issues, a new quality-of-service function scheduling and allocation framework, called Sequoia, is designed. Sequoia allows developers or administrators to easily def ne how serverless functions and applications should be deployed, capped, prioritized, or altered based on easily configured, flexible policies. Results with controlled and realistic workloads show Sequoia seamlessly adapts to policies, eliminates mid-chain drops, reduces queuing times by up to 6.4X, enforces tight chain-level fairness, and improves run-time performance up to 25X.

摘要翻译：undefined

Notes:

对现有的serverless的调度和资源管理方式的缺陷进行了总结（<span class="highlight" data-annotation="%7B%22attachmentURI%22%3A%22http%3A%2F%2Fzotero.org%2Fusers%2F14190829%2Fitems%2FGJ64ZCWH%22%2C%22pageLabel%22%3A%22311%22%2C%22position%22%3A%7B%22pageIndex%22%3A0%2C%22rects%22%3A%5B%5B69.048%2C381.466%2C294.044%2C391.498%5D%2C%5B53.798%2C369.51%2C100.786%2C379.542%5D%5D%7D%2C%22citationItem%22%3A%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F14190829%2Fitems%2F247VGQTY%22%5D%2C%22locator%22%3A%22311%22%7D%7D" ztype="zhighlight"><a href="zotero://open-pdf/library/items/GJ64ZCWH?page=1">“inflated application run times, function drops, inefficient allocations,”</a></span>等）并开发了一个自己的serverless调度器

## Bypassing the load balancer without regrets

Authors: Marios Kogias; Rishabh Iyer; Edouard Bugnion

Conference : SoCC '20

Tags: `QoS`

Url: <https://dl.acm.org/doi/10.1145/3419111.3421304>

Abstract: Load balancers are a ubiquitous component of cloud deployments and the cornerstone of workload elasticity. Load balancers can significantly affect the end-to-end application latency with their load balancing decisions, and constitute a significant portion of cloud tenant expenses. We propose CRAB, an alternative L4 load balancing scheme that eliminates latency overheads and scalability bottlenecks while simultaneously enabling the deployment of complex, stateful load balancing policies. A CRAB load balancer only participates in the TCP connection establishment phase and stays off the connection's datapath. Thus, load balancer provisioning depends on the rate of new connections rather than the actual connection bandwidth. CRAB depends on a new TCP option that enables connection redirection. We provide different implementations for a CRAB load balancer on different technologies, e.g., P4, DPDK, and eBPF, showing that a CRAB load balancer does not require many resources to perform well. We introduce the connection redirection option to the Linux kernel with minor modifications, so that it that can be shipped with the VM images offered by the cloud providers. We show how the same functionality can be achieved with a vanilla Linux kernel using a Netfilter module, while we discuss how CRAB can work while clients and servers remain completely agnostic, based on functionality added on the host. Our evaluation shows that CRAB pushes the IO bottleneck from the load balancer to the servers in cases where vanilla L4 load balancing does not scale and provides end-to-end latencies that are close to direct communication while retaining all the scheduling benefits of stateful L4 load balancing.

摘要翻译：undefined

Notes:

TCP层负载均衡，消除了原本负载均衡的延迟开销和扩展性瓶颈。只在连接建立时介入（依赖于TCP重定向选项），负载均衡考虑连接的建立速率而不是数据连接带宽，不影响数据通路传输。（文中提到了3种实现方法：P4、DPDK、eBPF，三种方式的资源需求量都不大）提供了TCP连接重定向功能的Linux内核选项。

## Perphon: a ML-based Agent for Workload Co-location via Performance Prediction and Resource Inference

Authors: Jianyong Zhu; Renyu Yang; Chunming Hu; Tianyu Wo; Shiqing Xue; Jin Ouyang; Jie Xu

Conference : SoCC '19

Tags: `important`,`scheduler`

Url: <https://dl.acm.org/doi/10.1145/3357223.3365440>

Abstract: Cluster administrators are facing great pressures to improve cluster utilization through workload co-location. Guaranteeing performance of long-running applications (LRAs), however, is far from settled as unpredictable interference across applications is catastrophic to QoS \[2]. Current solutions such as \[1] usually employ sandboxed and offline profiling for different workload combinations and leverage them to predict incoming interference. However, the time complexity restricts the applicability to complex co-locations. Hence, this issue entails a new framework to harness runtime performance and mitigate the time cost with machine intelligence: i) It is desirable to explore a quantitative relationship between allocated resource and consequent workload performance, not relying on analyzing interference derived from different workload combinations. The majority of works, however, depend on offline profiling and training which may lead to model aging problem. Moreover, multi-resource dimensions (e.g., LLC contention) that are not completely included by existing works but have impact on performance interference need to be considered \[3]. ii) Workload co-location also necessitates fine-grained isolation and access control mechanism. Once performance degradation is detected, dynamic resource adjustment will be enforced and application will be assigned an access to specific slices of each resources. Inferring a "just enough" amount of resource adjustment ensures the application performance can be secured whilst improving cluster utilization. We present Perphon, a runtime agent on a per node basis, that decouples ML-based performance prediction and resource inference from centralized scheduler. Figure 1 outlines the proposed architecture. We initially exploit sensitivity of applications to multi-resources to establish performance prediction. To achieve this, Metric Monitor aggregates application fingerprint and system-level performance metrics including CPU, memory, Last Level Cache (LLC), memory bandwidth (MBW) and number of running threads, etc. They are enabled by Intel-RDT and precisely obtained from resource group manager. Perphon employs an Online Gradient Boost Regression Tree (OGBRT) approach to resolve model aging problem. Res-Perf Model warms up via offline learning that merely relies on a small volume of profiling in the early stage, but evolves with arrival of workloads. Consequently, parameters will be automatically updated and synchronized among agents. Anomaly Detector can timely pinpoint a performance degradation via LSTM time-series analysis and determine when and which application need to be re-allocated resources. Once abnormal performance counter or load is detected, Resource Inferer conducts a gradient ascend based inference to work out a proper slice of resources, towards dynamically recovering targeted performance. Upon receiving an updated re-allocation, Access Controller re-assigns a specific portion of the node resources to the affected application. Eventually, Isolation Executor enforces resource manipulation and ensures performance isolation across applications. Specifically, we use cgroup cpuset and memory subsystem to control usage of CPU and memory while leveraging Intel-RDT technology to underpin the manipulation of LLC and MBW. For fine-granularity management, we create different groups for LRA and batch jobs when the agent starts. Our prototype integration with Node Manager of Apache YARN shows that throughput of Kafka data-streaming application in Perphon is 2.0x and 1.82x times that of isolation execution schemes in native YARN and pure cgroup cpu subsystem.

摘要翻译：undefined

Notes:

提出了Perpon，一个基于每个节点的运行时代理，它将基于ML的性能预测和资源推理与集中式调度器解耦。主要是基于硬件的性能测量（Intel的RDT）得到CPU、内存、LLC、内存带宽、运行的线程数等数据作为性能预测的源数据。还额外做了模型退化（老化）的解决

## The Curious Case of Container Orchestration and Scheduling in GPU-based Datacenters

Authors: Prashanth Thinakaran; Jashwant Raj; Bikash Sharma; Mahmut T. Kandemir; Chita R. Das

Conference : SoCC '18

Tags: `useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/3267809.3275466>

Abstract: Modern data centers are increasingly being provisioned with compute accelerators such as GPUs, FPGAs and ASIC's to catch up with the workload performance demands and reduce the total cost of ownership (TCO). By 2021, traffic within hyperscale datacenters is expected to quadruple with 94% of workloads moving to cloud-based datacenters according to Cisco's global cloud index. A majority of these workloads include data mining, image processing, speech recognition and gaming which uses GPUs for high throughput computing. This trend is evident as public cloud operators like Amazon and Microsoft have started to offer GPU-based infrastructure services in the recent times. The GPU-bound applications in general, can either be batch or latency-sensitive. Typically the latency-critical applications subscribe to datacenter resources in the form of queries (e.g. inference requests from a DNN model). For example, a wearable health monitoring device aggregates several sensor data through a mobile application. In case of a data anomaly, inference services can be triggered from the mobile device to the cloud, requesting for a deep neural network (DNN) model that fits the symptom. Such inference requests which are GPU bound impose strict Service Level Agreements (SLAs) that is typically set around 150 to 500ms. In contrast to the regular datacenter batch workloads, these user-facing applications are typically hosted as services that occur and scale in short bursts. On the other hand, batch applications are HPC based compute-bound workloads which are throughput oriented. In a typical datacenter, these both applications might co-exist on the same device depends on the orchestration and scheduling policy. With the expected increase in such workloads, this GPU resource management problem is expected to exacerbate. Hence, GPUs/accelerators are on the critical path to ensure the performance and meet the end-to-end latency demands of such queries. State-of-the-art resource orchestrators are agnostic of GPUs and their resource utilization footprints, and thus not equipped to dynamically orchestrate these accelerator-bound containers. On the other hand, job schedulers at the datacenter are heavily optimized and tuned for CPU-based systems. Kubernetes and Mesos by default does uniform task scheduling which statically assigns the GPU resources to the applications. The scheduled tasks access the GPUs via PCIe pass-through which gives the application complete access to the GPU as seen in Figure 1. Hence the resource utilization of the GPU is based on the parallelism of the application which is scheduled to run on it. In case of CPUs, Kubernetes has support for dynamic orchestration with the features such as node affinity, pod affinity, and pod preemption. However, these features cannot be extended for GPUs. This is because, it neither has the support for pod preemption nor the ability to query the real-time GPU metrics such as memory, symmetric multiprocessor (SM) utilization, PCIe bandwidth, etc. Moreover, the containers often overstate their GPU resource requirements such as memory, and this leads to severe resource underutilization which leads to multiple QoS violations because of queuing delays. We identify that by employing CPU-based scheduling policies for GPU-bound workloads would fail to yield high accelerator utilization and lead to poor performance per watt per query. Motivated by this, we propose a GPU-aware resource orchestration layer which enables the resource scheduler to take advantage of the GPUs by knowing their real-time utilization. We further discuss the ideal scheduler properties for a GPU rich datacenter and list the challenges in developing such a production-grade GPU-based datacenter scheduler. Therefore we modify the well-known Google's Kubernetes datacenter-level resource orchestrator by making it GPU-aware by exposing GPU driver APIs. Based on our observations from Alibaba's cluster traces and real hardware GPU cluster experiments, we build Knots, a GPU-aware resource orchestration layer and integrate it with Kubernetes container orchestrator. In addition, we also evaluate three GPU-based scheduling schemes to schedule datacenter representative GPU workload mixes through Kube-Knots. Evaluations on a ten node GPU cluster demonstrate that Knots together with our proposed GPU-aware scheduling scheme improves the cluster-wide GPU utilization while significantly reducing the cluster-wide power consumption across three different workload mixes when compared against Kubernetes's default uniform scheduler.

摘要翻译：undefined

Notes:

不知道为什么，这篇只有个摘要

## The Elasticity and Plasticity in Semi-Containerized Co-locating Cloud Workload: a View from Alibaba Trace

Authors: Qixiao Liu; Zhibin Yu

Conference : SoCC '18

Tags: `QoS`,`scheduler`

Url: <https://dl.acm.org/doi/10.1145/3267809.3267830>

Abstract: Cloud computing with large-scale datacenters provides great convenience and cost-efficiency for end users. However, the resource utilization of cloud datacenters is very low, which wastes a huge amount of infrastructure investment and energy to operate. To improve resource utilization, cloud providers usually co-locate workloads of different types on shared resources. However, resource sharing makes the quality of service (QoS) unguaranteed. In fact, improving resource utilization (IRU) and guaranteeing QoS at the same time in cloud has been a dilemma which we name an IRU-QoS curse. To tackle this issue, characterizing the workloads from real production cloud computing platforms is extremely important. In this work, we analyze a recently released 24-hour trace dataset from a production cluster in Alibaba. We reveal three key findings which are significantly different from those from the Google trace. First, each online service runs in a container while batch jobs run on physical servers. Further, they are concurrently managed by two different schedulers and co-located on same servers, which we call semi-containerized co-location. Second, batch instances largely use the spare resources that containers reserved but not used, which shows the elasticity feature of resource allocation of the Alibaba cluster. Moreover, through resource overprovisioning, overbooking, and overcommitment, the resource allocation of the Alibaba cluster achieves high elasticity. Third, as the high elasticity may hurt the performance of co-located online services, the Alibaba cluster sets bounds of resources used by batch tasks to guarantee the steady performance of both online services and batch tasks, which we call plasticity of resource allocation.

摘要翻译：undefined

Notes:

对现有的阿里巴巴的生产集群24小时的trace进行分析，探究当前系统的特点：半容器化——批处理应用不容器化而其他应用容器化，两套调度算法，批处理应用可以使用容器应用申请但尚未使用的资源，提高了弹性。

## DC-DRF: Adaptive Multi-Resource Sharing at Public Cloud Scale

Authors: Ian A. Kash; Greg O'Shea; Stavros Volos

Conference : SoCC '18

Tags: `QoS`

Url: <https://dl.acm.org/doi/10.1145/3267809.3267848>

Abstract: Public cloud datacenters implement a distributed computing environment built for economy at scale, with hundreds of thousands of compute and storage servers and a large population of predominantly small customers often densely packed to a compute server. Several recent contributions have investigated how equitable sharing and differentiated services can be achieved in this multi-resource environment, using the Extended Dominant Resource Fairness (EDRF) algorithm. However, we find that EDRF requires prohibitive execution time when employed at datacenter scale due to its iterative nature and polynomial time complexity; its closed-form expression does not alter its asymptotic complexity. In response, we propose Deadline-Constrained DRF, or DC-DRF, an adaptive approximation of EDRF designed to support centralized multi-resource allocation at datacenter scale in bounded time. The approximation introduces error which can be reduced using a high-performance implementation, drawing on parallelization techniques from the field of High-Performance Computing and vector arithmetic instructions available in modern server processors. We evaluate DC-DRF at scales that exceed those previously reported by several orders of magnitude, calculating resource allocations for one million predominantly small tenants and one hundred thousand resources, in seconds. Our parallel implementation preserves the properties of EDRF up to a small error, and empirical results show that the error introduced by approximation is insignificant for practical purposes.

摘要翻译：undefined

Notes:

改进现有的资源分配算法EDRF（扩展域资源公平，特点是公平共享+差异化服务），使它算法时间复杂度降低能够在大规模集群上使用。

## Henge: Intent-driven Multi-Tenant Stream Processing

Authors: Faria Kalim; Le Xu; Sharanya Bathey; Richa Meherwal; Indranil Gupta

Conference : SoCC '18

Tags: `important`,`QoS`,`scheduler`

Url: <https://dl.acm.org/doi/10.1145/3267809.3267832>

Abstract: We present Henge, a system to support intent-based multi-tenancy in modern distributed stream processing systems. Henge supports multi-tenancy as a first-class citizen: everyone in an organization can now submit their stream processing jobs to a single, shared, consolidated cluster. Secondly, Henge allows each job to specify its own intents (i.e., requirements) as a Service Level Objective (SLO) that captures latency and/or throughput needs. In such an intent-driven multi-tenant cluster, the Henge scheduler adapts continually to meet jobs' respective SLOs in spite of limited cluster resources, and under dynamically varying workloads. SLOs are soft and are based on utility functions. Henge's overall goal is to maximize the total system utility achieved by all jobs in the system. Henge is integrated into Apache Storm and we present experimental results using both production jobs from Yahoo! and real datasets from Twitter.

摘要翻译：undefined

Notes:

一个基于用户需求的多租户集群调度器（已经集成到Apache storm里了）

## WorkloadCompactor: reducing datacenter cost while providing tail latency SLO guarantees

Authors: Timothy Zhu; Michael A. Kozuch; Mor Harchol-Balter

Conference : SoCC '17

Tags: `QoS`

Url: <https://dl.acm.org/doi/10.1145/3127479.3132245>

Abstract: Service providers want to reduce datacenter costs by consolidating workloads onto fewer servers. At the same time, customers have performance goals, such as meeting tail latency Service Level Objectives (SLOs). Consolidating workloads while meeting tail latency goals is challenging, especially since workloads in production environments are often bursty. To limit the congestion when consolidating workloads, customers and service providers often agree upon rate limits. Ideally, rate limits are chosen to maximize the number of workloads that can be co-located while meeting each workload's SLO. In reality, neither the service provider nor customer knows how to choose rate limits. Customers end up selecting rate limits on their own in some ad hoc fashion, and service providers are left to optimize given the chosen rate limits. This paper describes WorkloadCompactor, a new system that uses workload traces to automatically choose rate limits simultaneously with selecting onto which server to place workloads. Our system meets customer tail latency SLOs while minimizing datacenter resource costs. Our experiments show that by optimizing the choice of rate limits, WorkloadCompactor reduces the number of required servers by 30--60% as compared to state-of-the-art approaches.

摘要翻译：undefined

Notes:

利用工作负载的trace数据做资源限制和选择应当运行该工作负载的server，主旨是降低集群的服务器数量来满足相同性能需求

## SLO-aware colocation of data center tasks based on instantaneous processor requirements

Authors: Pawel Janus; Krzysztof Rzadca

Conference : SoCC '17

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/3127479.3132244>

Abstract: In a cloud data center, a single physical machine simultaneously executes dozens of highly heterogeneous tasks. Such colocation results in more efficient utilization of machines, but, when tasks' requirements exceed available resources, some of the tasks might be throttled down or preempted. We analyze version 2.1 of the Google cluster trace that shows short-term (1 second) task CPU usage. Contrary to the assumptions taken by many theoretical studies, we demonstrate that the empirical distributions do not follow any single distribution. However, high percentiles of the total processor usage (summed over at least 10 tasks) can be reasonably estimated by the Gaussian distribution. We use this result for a probabilistic fit test, called the Gaussian Percentile Approximation (GPA), for standard bin-packing algorithms. To check whether a new task will fit into a machine, GPA checks whether the resulting distribution's percentile corresponding to the requested service level objective, SLO is still below the machine's capacity. In our simulation experiments, GPA resulted in colocations exceeding the machines' capacity with a frequency similar to the requested SLO.

摘要翻译：undefined

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

摘要翻译：undefined

Notes:

实现一个租户准入策略。改进当时最好的DNC为SNC，增加了随机性，因为尾部延迟也是概率性的

## Evaluating the impact of fine-scale burstiness on cloud elasticity

Authors: Sadeka Islam; Srikumar Venugopal; Anna Liu

Conference : SoCC '15

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/2806777.2806846>

Abstract: Elasticity is the defining feature of cloud computing. Performance analysts and adaptive system designers rely on representative benchmarks for evaluating elasticity for cloud applications under realistic reproducible workloads. A key feature of web workloads is burstiness or high variability at fine timescales. In this paper, we explore the innate interaction between fine-scale burstiness and elasticity and quantify the impact from the cloud consumer's perspective. We propose a novel methodology to model workloads with fine-scale burstiness so that they can resemble the empirical stylized facts of the arrival process. Through an experimental case study, we extract insights about the implications of fine-scale burstiness for elasticity penalty and adaptive resource scaling. Our findings demonstrate the detrimental effect of fine-scale burstiness on the elasticity of cloud applications.

摘要翻译：undefined

Notes:

研究了某种细粒度的资源利用率突然增加对云的弹性penalty和自适应资源伸缩的影响，对调度器可能有参考意义

## Tarcil: reconciling scheduling speed and quality in large shared clusters

Authors: Christina Delimitrou; Daniel Sanchez; Christos Kozyrakis

Conference : SoCC '15

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/2806777.2806779>

Abstract: Scheduling diverse applications in large, shared clusters is particularly challenging. Recent research on cluster scheduling focuses either on scheduling speed, using sampling to quickly assign resources to tasks, or on scheduling quality, using centralized algorithms that search for the resources that improve both task performance and cluster utilization. We present Tarcil, a distributed scheduler that targets both scheduling speed and quality. Tarcil uses an analytically derived sampling framework that adjusts the sample size based on load, and provides statistical guarantees on the quality of allocated resources. It also implements admission control when sampling is unlikely to find suitable resources. This makes it appropriate for large, shared clusters hosting short- and long-running jobs. We evaluate Tarcil on clusters with hundreds of servers on EC2. For highly-loaded clusters running short jobs, Tarcil improves task execution time by 41% over a distributed, sampling-based scheduler. For more general scenarios, Tarcil achieves near-optimal performance for 4× and 2× more jobs than sampling-based and centralized schedulers respectively.

摘要翻译：undefined

Notes:

Tarcil，一个以调度速度和质量为目标的**分布式调度器**。Tarcil使用分析推导的采样框架，该框架根据负载调整采样样本大小，并对分配资源的质量提供概率意义上的保证。当采样不太可能找到合适的资源时，它还实现工作负载的准入控制。

## PriorityMeister: Tail Latency QoS for Shared Networked Storage

Authors: Timothy Zhu; Alexey Tumanov; Michael A. Kozuch; Mor Harchol-Balter; Gregory R. Ganger

Conference : SOCC '14

Tags: `useless(probably)`,`scheduler`

Url: <https://dl.acm.org/doi/10.1145/2670979.2671008>

Abstract: Meeting service level objectives (SLOs) for tail latency is an important and challenging open problem in cloud computing infrastructures. The challenges are exacerbated by burstiness in the workloads. This paper describes PriorityMeister -- a system that employs a combination of per-workload priorities and rate limits to provide tail latency QoS for shared networked storage, even with bursty workloads. PriorityMeister automatically and proactively configures workload priorities and rate limits across multiple stages (e.g., a shared storage stage followed by a shared network stage) to meet end-to-end tail latency SLOs. In real system experiments and under production trace workloads, PriorityMeister outperforms most recent reactive request scheduling approaches, with more workloads satisfying latency SLOs at higher latency percentiles. PriorityMeister is also robust to mis-estimation of underlying storage device performance and contains the effect of misbehaving workloads.

摘要翻译：undefined

Notes:

应该是网络请求的优先级调度，不确定是否与我们的内容相关

## What Bugs Live in the Cloud? A Study of 3000+ Issues in Cloud Systems

Authors: Haryadi S. Gunawi; Mingzhe Hao; Tanakorn Leesatapornwongsa; Tiratat Patana-anake; Thanh Do; Jeffry Adityatama; Kurnia J. Eliazar; Agung Laksono; Jeffrey F. Lukman; Vincentius Martin; Anang D. Satria

Conference : SOCC '14

Tags: `useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/2670979.2670986>

Abstract: We conduct a comprehensive study of development and deployment issues of six popular and important cloud systems (Hadoop MapReduce, HDFS, HBase, Cassandra, ZooKeeper and Flume). From the bug repositories, we review in total 21,399 submitted issues within a three-year period (2011-2014). Among these issues, we perform a deep analysis of 3655 "vital" issues (i.e., real issues affecting deployments) with a set of detailed classifications. We name the product of our one-year study Cloud Bug Study database (CbsDB) \[9], with which we derive numerous interesting insights unique to cloud systems. To the best of our knowledge, our work is the largest bug study for cloud systems to date.

摘要翻译：undefined

Notes:

云服务系统的典型bug分析，文章分析了2011-2014年的典型的云服务系统代码仓库中的issue（当时的主流是MapReduce、ZooKeeper等），可能没什么参考意义了

## Long-term SLOs for reclaimed cloud computing resources

Authors: Marcus Carvalho; Walfredo Cirne; Francisco Brasileiro; John Wilkes

Conference : SOCC '14

Tags: `useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/2670979.2670999>

Abstract: The elasticity promised by cloud computing does not come for free. Providers need to reserve resources to allow users to scale on demand, and cope with workload variations, which results in low utilization. The current response to this low utilization is to re-sell unused resources with no Service Level Objectives (SLOs) for availability. In this paper, we show how to make some of these reclaimable resources more valuable by providing strong, long-term availability SLOs for them. These SLOs are based on forecasts of how many resources will remain unused during multi-month periods, so users can do capacity planning for their long-running services. By using confidence levels for the predictions, we give service providers control over the risk of violating the availability SLOs, and allow them trade increased risk for more resources to make available. We evaluated our approach using 45 months of workload data from 6 production clusters at Google, and show that 6--17% of the resources can be re-offered with a long-term availability of 98.9% or better. A conservative analysis shows that doing so may increase the profitability of selling reclaimed resources by 22--60%.

摘要翻译：undefined

Notes:

让没有SLO要求的资源能够被利用起来，让云提供商资源利用率更上一层楼，让他们赚更多钱（应该没什么用）

## Small is better: avoiding latency traps in virtualized data centers

Authors: Yunjing Xu; Michael Bailey; Brian Noble; Farnam Jahanian

Conference : SOCC '13

Tags: `QoS`,`useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/2523616.2523620>

Abstract: Public clouds have become a popular platform for building Internet-scale applications. Using virtualization, public cloud services grant customers full control of guest operating systems and applications, while service providers still retain the management of their host infrastructure. Because applications built with public clouds are often highly sensitive to response time, infrastructure builders strive to reduce the latency of their data center's internal network. However, most existing solutions require modification to the software stack controlled by guests. We introduce a new host-centric solution for improving latency in virtualized cloud environments. In this approach, we extend a classic scheduling principle---Shortest Remaining Time First---from the virtualization layer, through the host network stack, to the network switches. Experimental and simulation results show that our solution can reduce median latency of small flows by 40%, with improvements in the tail of almost 90%, while reducing throughput of large flows by less than 3%.

摘要翻译：undefined

Notes:

网络协议栈和网络交换机的通信传输的调度策略，采用最短剩余时间优先策略

可能没啥用，主要是网络的

## Pico replication: a high availability framework for middleboxes

Authors: Shriram Rajagopalan; Dan Williams; Hani Jamjoom

Conference : SOCC '13

Tags: `useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/2523616.2523635>

Abstract: Middleboxes are being rearchitected to be service oriented, composable, extensible, and elastic. Yet system-level support for high availability (HA) continues to introduce significant performance overhead. In this paper, we propose Pico Replication (PR), a system-level framework for middleboxes that exploits their flow-centric structure to achieve low overhead, fully customizable HA. Unlike generic (virtual machine level) techniques, PR operates at the flow level. Individual flows can be checkpointed at very high frequencies while the middlebox continues to process other flows. Furthermore, each flow can have its own checkpoint frequency, output buffer and target for backup, enabling rich and diverse policies that balance---per-flow---performance and utilization. PR leverages OpenFlow to provide near instant flow-level failure recovery, by dynamically rerouting a flow's packets to its replication target. We have implemented PR and a flow-based HA policy. In controlled experiments, PR sustains checkpoint frequencies of 1000Hz, an order of magnitude improvement over current VM replication solutions. As a result, PR drastically reduces the overhead on end-to-end latency from 280% to 15.5% and throughput overhead from 99.5% to 3.2%.

摘要翻译：undefined

Notes:

高可用相关的，不确定是否有用

## PoWER: prediction of workload for energy efficient relocation of virtual machines

Authors: Kashifuddin Qazi; Yang Li; Andrew Sohn

Conference : SOCC '13

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/2523616.2525938>

Abstract: Virtual Machines (VM) offer data center owners the option to lease computational resources like CPU cycles, Memory, Disk space and Network bandwidth to end-users. An important consideration in this scenario is the optimal usage of the resources (CPU cycles, Memory, Block I/O and Network Bandwidth) of the physical machines that make up the cloud or 'machine-farms'. At any given time, the machines should not be overloaded (to ensure certain QoS requirements are met) and at the same time a minimum number of machines should be running (to conserve energy). The loads on individual VMs residing on these machines is, in fact, not absolutely random. Certain patterns can be found that can help the data center owners arrange the VMs on the physical machines such that both of the above conditions are met (minimum number of machines running without any being overloaded). In this work we propose a framework, PoWER that tries to intelligently predict the behavior of the cluster based on its history and then accordingly distributes VMs in the cluster and turns off unused Physical Machines, thus saving energy. Central to our framework are concepts of Chaos Theory that make our framework indifferent to the type of loads and inherent cycles in them as opposed to other current prediction algorithms. We also test this framework on our testbed cluster and analyze its performance. We demonstrate that PoWER performs better than another FFT-based time series method in predicting VM loads and freeing resources on Physical Machines for our test loads.

摘要翻译：undefined

Notes:

将数据中心的每个节点上运行的虚拟机的负载不是随机的，利用这种规律可以实现更好的调度，PoWER是以<span class="highlight" data-annotation="%7B%22attachmentURI%22%3A%22http%3A%2F%2Fzotero.org%2Fusers%2F14190829%2Fitems%2F8GAAACRK%22%2C%22pageLabel%22%3A%221%22%2C%22position%22%3A%7B%22pageIndex%22%3A0%2C%22rects%22%3A%5B%5B201.006%2C421.516%2C295.058%2C432.545%5D%2C%5B72.024%2C410.116%2C276.104%2C421.145%5D%5D%7D%2C%22citationItem%22%3A%7B%22uris%22%3A%5B%22http%3A%2F%2Fzotero.org%2Fusers%2F14190829%2Fitems%2F9NLBXRQB%22%5D%2C%22locator%22%3A%221%22%7D%7D" ztype="zhighlight"><a href="zotero://open-pdf/library/items/8GAAACRK?page=1">“minimum number of machines running without any being overloaded”</a></span>为目标的调度框架，核心理论是**Chaos Theory，**使其时间复杂度与循环无关

## Natjam: design and evaluation of eviction policies for supporting priorities and deadlines in mapreduce clusters

Authors: Brian Cho; Muntasir Rahman; Tej Chajed; Indranil Gupta; Cristina Abad; Nathan Roberts; Philbert Lin

Conference : SOCC '13

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/2523616.2523624>

Abstract: This paper presents Natjam, a system that supports arbitrary job priorities, hard real-time scheduling, and efficient preemption for Mapreduce clusters that are resource-constrained. Our contributions include: i) exploration and evaluation of smart eviction policies for jobs and for tasks, based on resource usage, task runtime, and job deadlines; and ii) a work-conserving task preemption mechanism for Mapreduce. We incorporated Natjam into the Hadoop YARN scheduler framework (in Hadoop 0.23). We present experiments from deployments on a test cluster, Emulab and a Yahoo! Inc. commercial cluster, using both synthetic workloads as well as Hadoop cluster traces from Yahoo!. Our results reveal that Natjam incurs overheads as low as 7%, and is preferable to existing approaches.

摘要翻译：undefined

Notes:

有优先级和deadline限制的硬实时、高效抢占替换策略（专门为MapReduce设计的）

## Zeta: scheduling interactive services with partial execution

Authors: Yuxiong He; Sameh Elnikety; James Larus; Chenyu Yan

Conference : SoCC '12

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/2391229.2391241>

Abstract: This paper presents a scheduling model for a class of interactive services in which requests are time bounded and lower result quality can be traded for shorter execution time. These applications include web search engines, finance servers, and other interactive, on-line services. We develop an efficient scheduling algorithm, Zeta, that allocates processor time among service requests to maximize the quality and minimize the variance of the response. Zeta exploits the concavity of the request quality profile to distribute processing time among outstanding requests. By executing some requests partially (and obtaining much or most benefit of a full execution), Zeta frees resources for other requests, which might have timed out and produced no results. Compared to scheduling algorithms that consider only deadline or quality profile information, Zeta improves overall response quality and reduces response quality variance, yielding significant improvement in the high-percentile response quality. We implemented and deployed Zeta in the Microsoft Bing web search engine and evaluated its performance in a production environment with realistic workloads. Measurements show that at the same response quality and latency as the production system, Zeta increases system capacity by 29% by improving both average and high percentile response quality. We also implemented Zeta in a finance server that computes option prices. In this application, Zeta improves average response quality by 28% and the 99-percentile quality by 80%. Using a simulation, we also compared Zeta to the offline optimal schedule and other scheduling algorithms. Although Zeta is only close to optimal, it provides better performance than prior algorithms under a wide variety of operating conditions.

摘要翻译：undefined

Notes:

同时考虑了响应时间deadline和应用程序运行质量的调度器（相比于当年其他的实现，考虑了多个指标的调度）

## Finding Correctness Bugs in eBPF Verifier with Structured and Sanitized Program

Authors: Hao Sun; Yiru Xu; Jianzhong Liu; Yuheng Shen; Nan Guan; Yu Jiang

Conference : EuroSys '24

Tags: `eBPF`

Url: <https://dl.acm.org/doi/10.1145/3627703.3629562>

Abstract: eBPF is an inspiring technique in Linux that allows user space processes to extend the kernel by dynamically injecting programs. However, it poses security issues, since the untrusted user code is now executed in the kernel space. eBPF utilizes a verifier to validate the safety of the provided programs, thus its correctness is of paramount importance as attackers may exploit vulnerabilities within it to inject malicious programs. Bug-finding tools like kernel fuzzers currently can detect memory bugs in eBPF system calls, but they experience difficulties in finding correctness bugs in the verifier, e.g., incorrect validations that allow the loading of unsafe programs. Because, unlike detecting memory bugs, where sanitizers can capture such errors once observed, automatically uncovering correctness bugs is very difficult, without an effective test oracle that determines if the verifier behaves correctly for given programs. In this paper, we propose an effective approach to automatically detect the verifier's correctness bugs. Our core observation is that since the verifier aims to ensure that eBPF programs do not affect the security of the kernel, any illegal behaviors in verified programs are indicators of correctness bugs in the verifier. Indeed, we can convert the detection of logical errors in the verifier to traditional bug finding in eBPF programs. Based on such insight, we devise two indicators for correctness bugs and propose corresponding sanitation mechanisms to capture them, both of which naturally form an effective test oracle. We implemented our idea in a tool, namely BVF, which generates structured eBPF programs to pass the verifier, and subsequently, it finds correctness bugs by detecting runtime errors in verified programs with the indicators. Experiments show that although the verifier has received extensive scrutiny and has been intensively tested by tools like Syzkaller and Buzzer, BVF still found 11 previously unknown vulnerabilities in eBPF, of which six are correctness bugs of critical severity in the verifier.

摘要翻译： eBPF是Linux中一种鼓舞人心的技术，它允许用户空间进程通过动态注入程序来扩展内核。然而，它带来了安全问题，因为不受信任的用户代码现在在内核空间中执行。eBPF利用验证器来验证所提供程序的安全性，因此其正确性至关重要，因为攻击者可能会利用其中的漏洞注入恶意程序。像内核模糊器这样的错误发现工具目前可以检测eBPF系统调用中的内存错误，但它们在验证器中发现正确性错误时会遇到困难，例如，允许加载不安全程序的错误验证。因为，与检测内存错误不同，在检测内存错误时，杀毒程序可以在观察到此类错误后捕获这些错误，如果没有有效的测试预言机来确定验证器对给定程序的行为是否正确，自动发现正确性错误是非常困难的。在本文中，我们提出了一种有效的方法来自动

Notes:

自动监测eBPF的verifier是否有正确性bug的工具。由于eBPF验证器需要保证eBPF程序不会影响内核的安全，故任何verfier本身的超出eBPF验证器要求的非法行为都是有正确性bug的。

## Enoki: High Velocity Linux Kernel Scheduler Development

Authors: Samantha Miller; Anirudh Kumar; Tanay Vakharia; Ang Chen; Danyang Zhuo; Thomas Anderson

Conference : EuroSys '24

Tags: `important`,`scheduler`

Url: <https://dl.acm.org/doi/10.1145/3627703.3629569>

Abstract: Kernel task scheduling is important for application performance, adaptability to new hardware, and complex user requirements. However, developing, testing, and debugging new scheduling algorithms in Linux, the most widely used cloud operating system, is slow and difficult. We developed Enoki, a framework for high velocity development of Linux kernel schedulers. Enoki schedulers are written in safe Rust, and the system supports live upgrade of new scheduling policies into the kernel, userspace debugging, and bidirectional communication with applications. A scheduler implemented with Enoki achieved near identical performance (within 1% on average) to the default Linux scheduler CFS on a wide range of benchmarks. Enoki is also able to support a range of research schedulers, specifically the Shinjuku scheduler, a locality aware scheduler, and the Arachne core arbiter, with good performance.

摘要翻译： 内核任务调度对于应用程序性能、对新硬件的适应性和复杂的用户需求非常重要。然而，在使用最广泛的云操作系统Linux中开发、测试和调试新的调度算法是缓慢而困难的。我们开发了Enoki，一个用于Linux内核调度器高速开发的框架。Enoki调度器是用安全的Rust编写的，系统支持将新的调度策略实时升级到内核、用户空间调试以及与应用程序的双向通信。使用Enoki实现的调度器在各种基准测试上实现了与默认Linux调度器CFS几乎相同的性能（平均在1%以内）。Enoki还能够支持一系列具有良好性能的研究调度器，特别是新宿调度器、位置感知调度器和Arachne核心仲裁器。

Notes:

高速开发Linux内核调度器的框架（Rust），可以作为实现调度器算法的参考，看能否利用文中说的方法提高调度器开发速度

## Understanding and Optimizing Workloads for Unified Resource Management in Large Cloud Platforms

Authors: Chengzhi Lu; Huanle Xu; Kejiang Ye; Guoyao Xu; Liping Zhang; Guodong Yang; Chengzhong Xu

Conference : EuroSys '23

Tags: `important`,`scheduler`

Url: <https://dl.acm.org/doi/10.1145/3552326.3587437>

Abstract: To fully utilize computing resources, cloud providers such as Google and Alibaba choose to co-locate online services with batch processing applications in their data centers. By implementing unified resource management policies, different types of complex computing jobs request resources in a consistent way, which can help data centers achieve global optimal scheduling and provide computing power with higher quality. To understand this new scheduling paradigm, in this paper, we first present an in-depth study of Alibaba's unified scheduling workloads. Our study focuses on the characterization of resource utilization, the application running performance, and scheduling scalability. We observe that although computing resources are significantly over-committed under unified scheduling, the resource utilization in Alibaba data centers is still low. In addition, existing resource usage predictors tend to make severe overestimations. At the same time, tasks within the same application behave fairly consistently, and the running performance of tasks can be well-profiled with respect to resource contention on the corresponding physical host. Based on these observations, in this paper, we design Optum, a unified data center scheduler for improving the overall resource utilization while ensuring good performance for each application. Optum formulates an optimization problem to schedule unified task requests, aiming to balance the trade-off between utilization and resource contention. Optum also implements efficient heuristics to solve the optimization problem in a scalable manner. Large-scale experiments demonstrate that Optum can save up to 15% of resources without performance degradation compared to state-of-the-art unified scheduling schemes.

摘要翻译： 为了充分利用计算资源，谷歌和阿里巴巴等云提供商选择在其数据中心将在线服务与批处理应用程序放在一起。通过实施统一的资源管理策略，不同类型的复杂计算作业以一致的方式请求资源，可以帮助数据中心实现全局最优调度，并提供更高质量的计算能力。为了理解这种新的调度范式，本文首先对阿里巴巴的统一调度工作负载进行了深入研究。我们的研究重点是资源利用率、应用程序运行性能和调度可扩展性的特征。我们观察到，尽管在统一调度的情况下，计算资源明显超额投入，但阿里巴巴数据中心的资源利用率仍然很低。此外，现有的资源使用预测因素往往会做出严重的高估。同时，同一应用程序中的任务行为

Notes:

## OLPart: Online Learning based Resource Partitioning for Colocating Multiple Latency-Critical Jobs on Commodity Computers

Authors: Ruobing Chen; Haosen Shi; Yusen Li; Xiaoguang Liu; Gang Wang

Conference : EuroSys '23

Tags: `QoS`,`scheduler`

Url: <https://doi.org/10.1145/3552326.3567490>

Abstract: Colocating multiple jobs on the same server has been a commonly used approach for improving resource utilization in cloud environments. However, performance interference due to the contention over shared resources makes resource partitioning an important research problem. Partitioning multiple resources coordinately is particularly challenging when multiple latency-critical (LC) jobs are colocated with best-effort (BE) jobs, since the QoS needs to be protected for all the LC jobs. So far, this problem is not well-addressed in the literatures. We propose an online learning based solution, named OL-Part, for partitioning resources among multiple colocated LC jobs and BE jobs. OLPart is designed based on our observation that runtime performance counters can approximately indicate resource sensitivities of jobs. Based on this finding, OLPart leverages contextual multi-armed bandit (CMAB) to design the partitioning solution, which employs the performance counters to enable an intelligent exploration of the search space. Applying CMAB to the resource partitioning problem faces several critical challenges. OLPart proposes several techniques to overcome these challenges. OLPart does not require prior knowledge of jobs and incurs very small overhead. Evaluations demonstrate that OLPart is optimally efficient and robust, which outperforms state-of-the-art solutions with significant margins. OLPart is publicly available at <https://github.com/crbnk/OpenOLPart>.

摘要翻译： 将多个作业集中在同一服务器上是提高云环境中资源利用率的常用方法。然而，由于共享资源的争用而导致的性能干扰使得资源划分成为一个重要的研究问题。当多个延迟关键（LC）作业与尽力而为（BE）作业共存时，协调地划分多个资源尤其具有挑战性，因为需要为所有LC作业保护QoS。到目前为止，这一问题在文献中还没有得到很好的解决。我们提出了一种基于在线学习的解决方案，名为OL Part，用于在多个共存的LC作业和BE作业之间划分资源。OLPart是基于我们的观察而设计的，即运行时性能计数器可以近似地指示作业的资源敏感性。基于这一发现，OLPart利用上下文多武装土匪（CMAB）来设计分区解决方案，该解决方案使用性能计数器来实现智能的

Notes:

用在线学习做的任务资源隔离：将多个看重延迟的任务和尽力而为的任务打包到一起（基于运行时性能计数器来表示任务的资源敏感程度，由此做打包）

## VMSH: hypervisor-agnostic guest overlays for VMs

Authors: Jörg Thalheim; Peter Okelmann; Harshavardhan Unnibhavi; Redha Gouicem; Pramod Bhatotia

Conference : EuroSys '22

Tags: `light weight VM`

Url: <https://dl.acm.org/doi/10.1145/3492321.3519589>

Abstract: Lightweight virtual machines (VMs) are prominently adopted for improved performance and dependability in cloud environments. To reduce boot up times and resource utilisation, they are usually "pre-baked" with only the minimal kernel and userland strictly required to run an application. This introduces a fundamental trade-off between the advantages of lightweight VMs and available services within a VM, usually leaning towards the former. We propose VMSH, a hypervisor-agnostic abstraction that enables on-demand attachment of services to a running VM---allowing developers to provide minimal, lightweight images without compromising their functionality. The additional applications are made available to the guest via a file system image. To ensure that the newly added services do not affect the original applications in the VM, VMSH uses lightweight isolation mechanisms based on containers. We evaluate VMSH on multiple KVM-based hypervisors and Linux LTS kernels and show that: (i) VMSH adds no overhead for the applications running in the VM, (ii) de-bloating images from the Docker registry can save up to 60% of their size on average, and (iii) VMSH enables cloud providers to offer services to customers, such as recovery shells, without interfering with their VM's execution.

摘要翻译： 轻量级虚拟机（VM）在云环境中被显著采用，以提高性能和可靠性。为了减少启动时间和资源利用率，它们通常是“预先准备好的”，只有运行应用程序所严格要求的最小内核和用户空间。这在轻量级虚拟机的优势和虚拟机内的可用服务之间引入了一种基本的权衡，通常倾向于前者。我们提出了VMSH，这是一种与虚拟机管理程序无关的抽象，它允许按需将服务连接到正在运行的虚拟机上——允许开发人员在不损害其功能的情况下提供最小的轻量级映像。额外的应用程序通过文件系统映像提供给访客。为了确保新添加的服务不会影响VM中的原始应用程序，VMSH使用基于容器的轻量级隔离机制。我们在多个基于KVM的管理程序和Linux LTS内核上评估了VMSH，并表明：（i）VMSH添加了n

Notes:

为了提高轻量级VM的可执行应用功能性而引入的overlay中间层做VM功能扩展，保证不牺牲VM性能的情况下提高其可执行应用功能丰富度。

> 这篇文章实现的VMSH如果开源可用，可以作为我们性能劣化原型监测的实验对照平台之一

## Verified programs can party: optimizing kernel extensions via post-verification merging

Authors: Hsuan-Chi Kuo; Kai-Hsun Chen; Yicheng Lu; Dan Williams; Sibin Mohan; Tianyin Xu

Conference : EuroSys '22

Tags: `eBPF`,`important`

Url: <https://dl.acm.org/doi/10.1145/3492321.3519562>

Abstract: Operating system (OS) extensions are more popular than ever. For example, Linux BPF is marketed as a "superpower" that allows user programs to be downloaded into the kernel, verified to be safe and executed at kernel hook points. So, BPF extensions have high performance and are often placed at performance-critical paths for tracing and filtering. However, although BPF extension programs execute in a shared kernel environment and are already individually verified, they are often executed independently in chains. We observe that the chain pattern has large performance overhead, due to indirect jumps penalized by security mitigations (e.g., Spectre), loops, and memory accesses. In this paper, we argue for a separation of concerns. We propose to decouple the execution of BPF extensions from their verification requirements---BPF extension programs can be collectively optimized, after each BPF extension program is individually verified and loaded into the shared kernel. We present KFuse, a framework that dynamically and automatically merges chains of BPF programs by transforming indirect jumps into direct jumps, unrolling loops, and saving memory accesses, without loss of security or flexibility. KFuse can merge BPF programs that are (1) installed by multiple principals, (2) maintained to be modular and separate, (3) installed at different points of time, and (4) split into smaller, verifiable programs via BPF tail calls. KFuse demonstrates 85% performance improvement of BPF chain execution and 7% of application performance improvement over existing BPF use cases (systemd's Seccomp BPF filters). It achieves more significant benefits for longer chains.

摘要翻译： 操作系统（OS）扩展比以往任何时候都更受欢迎。例如，Linux BPF被宣传为一种“超级能力”，它允许用户程序下载到内核中，验证其安全性并在内核挂钩点执行。因此，BPF扩展具有高性能，通常被放置在性能关键的路径上进行跟踪和筛选。然而，尽管BPF扩展程序在共享内核环境中执行，并且已经单独验证，但它们通常在链中独立执行。我们观察到，由于受到安全缓解措施（例如Spectre）、循环和内存访问的惩罚，链模式具有较大的性能开销。在本文中，我们主张将关注点分离。我们建议将BPF扩展的执行与其验证需求解耦——在每个BPF扩展程序都经过单独验证并加载到共享内核中后，可以对BPF扩展计划进行集体优化。我们介绍KFuse，a f

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

摘要翻译： 现代计算机系统是高度可配置的，其总变异空间有时大于宇宙中原子的数量。在广阔而多变的空间中，理解和推理高度可配置系统的性能行为是具有挑战性的。用于性能建模和分析的现有技术方法依赖于预测性机器学习模型，因此，它们（i）在看不见的环境（例如，不同的硬件、工作负载）中变得不可靠，以及（ii）可能产生错误的解释。为了解决这一问题，我们提出了一种称为Unicorn的新方法，该方法（i）捕捉整个软硬件堆栈中配置选项之间的复杂交互，以及（ii）描述这种交互如何通过因果推理影响性能变化。我们在六个高度可配置的系统上评估了独角兽，包括三个设备上机器学习系统、一个视频编码器、一个数据库管理系统和一个数据分析管道。实验结果

Notes:

这篇文章标了scheduler的标签是因为它对性能瓶颈的成因用推理分析的模型进行了训练，对我们实现一个调度器有帮助

## DeepRest: deep resource estimation for interactive microservices

Authors: Ka-Ho Chow; Umesh Deshpande; Sangeetha Seshadri; Ling Liu

Conference : EuroSys '22

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/3492321.3519564>

Abstract: Interactive microservices expose API endpoints to be invoked by users. For such applications, precisely estimating the resources required to serve specific API traffic is challenging. This is because an API request can interact with different components and consume different resources for each component. The notion of API traffic is vital to application owners since the API endpoints often reflect business logic, e.g., a customer transaction. The existing systems that simply rely on historical resource utilization are not API-aware and thus cannot estimate the resource requirement accurately. This paper presents DeepRest, a deep learning-driven resource estimation system. DeepRest formulates resource estimation as a function of API traffic and learns the causality between user interactions and resource utilization directly in a production environment. Our evaluation shows that DeepRest can estimate resource requirements with over 90% accuracy, even if the API traffic to be estimated has never been observed (e.g., 3× more users than ever or unseen traffic shape). We further apply resource estimation for application sanity checks. DeepRest identifies system anomalies by verifying whether the resource utilization is justifiable by how the application is being used. It can successfully identify two major cyber threats: ransomware and cryptojacking attacks.

摘要翻译： 交互式微服务公开API端点供用户调用。对于这样的应用，精确估计服务特定API流量所需的资源是具有挑战性的。这是因为API请求可以与不同的组件交互，并为每个组件消耗不同的资源。API流量的概念对应用程序所有者至关重要，因为API端点通常反映业务逻辑，例如客户事务。简单依赖历史资源利用率的现有系统不是API软件，因此无法准确估计资源需求。本文介绍了DeepRest，一个深度学习驱动的资源估计系统。DeepRest将资源估计公式化为API流量的函数，并直接在生产环境中学习用户交互和资源利用之间的因果关系。我们的评估表明，DeepRest可以以超过90%的准确度估计资源需求，即使要估计的API流量

Notes:

一个对用户API和资源利用率之间做因果分析的模型，对调度器的实现有帮助

## Performance evolution of mitigating transient execution attacks

Authors: Jonathan Behrens; Adam Belay; M. Frans Kaashoek

Conference : EuroSys '22

Tags: `useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/3492321.3519559>

Abstract: Today's applications pay a performance penalty for mitigations to protect against transient execution attacks such as Meltdown \[32] and Spectre \[25]. Such a reduction in performance directly translates to higher operating costs and degraded user experience. This paper measures the performance impact of these mitigations across a range of processors from multiple vendors and across several security boundaries to identify trends over successive generations of processors and to attribute how much of the overall slowdown is caused by each individual mitigation. We find that overheads for operating system intensive workloads have declined by as much as 10×, down to about 3% on modern CPUs, due to hardware changes that eliminate the need for the most expensive mitigations. Meanwhile, a JavaScript benchmark reveals approximately 20% overhead persists today because mitigations for Spectre V1 and Speculative Store Bypass have not become more efficient. Other workloads like virtual machines and single-process, compute-intensive applications did not show significant slowdowns on any of the processors we measured.

摘要翻译： 今天的应用程序会为抵御瞬态执行攻击（如Meltdown\[32]和Spectre\[25]）的缓解措施付出性能代价。这种性能的降低直接转化为更高的操作成本和降级的用户体验。本文测量了这些缓解措施对来自多个供应商的一系列处理器和多个安全边界的性能影响，以确定连续几代处理器的趋势，并确定每种缓解措施在多大程度上导致了总体放缓。我们发现，由于硬件的变化消除了对最昂贵的缓解措施的需求，操作系统密集型工作负载的开销下降了10倍，在现代CPU上降至约3%。同时，JavaScript基准测试显示，由于Spectre V1和推测性存储旁路的缓解措施没有变得更有效，目前仍有大约20%的开销存在。其他工作负载，如虚拟机和

Notes:

## SmartHarvest: harvesting idle CPUs safely and efficiently in the cloud

Authors: Yawen Wang; Kapil Arya; Marios Kogias; Manohar Vanga; Aditya Bhandari; Neeraja J. Yadwadkar; Siddhartha Sen; Sameh Elnikety; Christos Kozyrakis; Ricardo Bianchini

Conference : EuroSys '21

Tags: `scheduler`

Url: <https://doi.org/10.1145/3447786.3456225>

Abstract: We can increase the efficiency of public cloud datacenters by harvesting allocated but temporarily idling CPU cores from customer virtual machines (VMs) to run batch or analytics workloads. Even small efficiency gains translate into substantial savings, since provisioning and operating a datacenter costs hundreds of millions of dollars per year. The main challenge is to harvest idle cores with little or no impact on customer VMs, which could be running latency-sensitive services and are essentially black-boxes to the cloud provider. We introduce ElasticVM, a new VM type that can run batch workloads cheaply using mainly harvested cores. We also propose SmartHarvest, a system that dynamically manages the number of cores available to ElasticVMs in each fine-grained time window. SmartHarvest uses online learning to predict the core demand of primary, customer VMs and compute the number of cores that can be safely harvested. Our results show that SmartHarvest can harvest a significant amount of CPU resources without increasing the 99th-percentile tail latency of latency-critical primary workloads by more than 10%. Unlike static harvesting techniques that rely on offline profiling, SmartHarvest is robust to different primary workloads, batch workloads, and load changes. Finally, we show that the online learning in SmartHarvest is complementary to systems optimizations for VM management.

摘要翻译：undefined

Notes:

虚拟机调度时对空闲的虚拟CPU“收割”，与调度是两条赛道，说不定有借鉴意义

## OFC: an opportunistic caching system for FaaS platforms

Authors: Djob Mvondo; Mathieu Bacou; Kevin Nguetchouang; Lucien Ngale; Stéphane Pouget; Josiane Kouam; Renaud Lachaize; Jinho Hwang; Tim Wood; Daniel Hagimont; Noël De Palma; Bernabé Batchakui; Alain Tchana

Conference : EuroSys '21

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/3447786.3456239>

Abstract: Cloud applications based on the "Functions as a Service" (FaaS) paradigm have become very popular. Yet, due to their stateless nature, they must frequently interact with an external data store, which limits their performance. To mitigate this issue, we introduce OFC, a transparent, vertically and horizontally elastic in-memory caching system for FaaS platforms, distributed over the worker nodes. OFC provides these benefits cost-effectively by exploiting two common sources of resource waste: (i) most cloud tenants overprovision the memory resources reserved for their functions because their footprint is non-trivially input-dependent and (ii) FaaS providers keep function sandboxes alive for several minutes to avoid cold starts. Using machine learning models adjusted for typical function input data categories (e.g., multimedia formats), OFC estimates the actual memory resources required by each function invocation and hoards the remaining capacity to feed the cache. We build our OFC prototype based on enhancements to the OpenWhisk FaaS platform, the Swift persistent object store, and the RAM-Cloud in-memory store. Using a diverse set of workloads, we show that OFC improves by up to 82 % and 60 % respectively the execution time of single-stage and pipelined functions.

摘要翻译：undefined

Notes:

机器学习对特定输入的FaaS内存使用量估计，以完成cache分配。与调度器相关

## Take it to the limit: peak prediction-driven resource overcommitment in datacenters

Authors: Noman Bashir; Nan Deng; Krzysztof Rzadca; David Irwin; Sree Kodak; Rohit Jnagal

Conference : EuroSys '21

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/3447786.3456259>

Abstract: To increase utilization, datacenter schedulers often overcommit resources where the sum of resources allocated to the tasks on a machine exceeds its physical capacity. Setting the right level of overcommitment is a challenging problem: low overcommitment leads to wasted resources, while high overcommitment leads to task performance degradation. In this paper, we take a first principles approach to designing and evaluating overcommit policies by asking a basic question: assuming complete knowledge of each task's future resource usage, what is the safest overcommit policy that yields the highest utilization? We call this policy the peak oracle. We then devise practical overcommit policies that mimic this peak oracle by predicting future machine resource usage. We simulate our overcommit policies using the recently-released Google cluster trace, and show that they result in higher utilization and less overcommit errors than policies based on per-task allocations. We also deploy these policies to machines inside Google's datacenters serving its internal production workload. We show that our overcommit policies increase these machines' usable CPU capacity by 10-16% compared to no overcommitment.

摘要翻译：undefined

Notes:

overcommitment（暂且翻译为过度分配）策略的全局观测和分配，对调度算法不一定有用，但相关

## Rhythm: component-distinguishable workload deployment in datacenters

Authors: Laiping Zhao; Yanan Yang; Kaixuan Zhang; Xiaobo Zhou; Tie Qiu; Keqiu Li; Yungang Bao

Conference : EuroSys '20

Tags: `scheduler`

Url: <https://doi.org/10.1145/3342195.3387534>

Abstract: Cloud service providers improve resource utilization by co-locating latency-critical (LC) workloads with best-effort batch (BE) jobs in datacenters. However, they usually treat an LC workload as a whole when allocating resources to BE jobs and neglect the different features of components of an LC workload. This kind of coarse-grained co-location method leaves a significant room for improvement in resource utilization. Based on the observation of the inconsistent interference tolerance abilities of different LC components, we propose a new abstraction called Servpod, which is a collection of a LC parts that are deployed on the same physical machine together, and show its merits on building a fine-grained co-location framework. The key idea is to differentiate the BE throughput launched with each LC Servpod, i.e., Servpod with high interference tolerance ability can be deployed along with more BE jobs. Based on Servpods, we present Rhythm, a co-location controller that maximizes the resource utilization while guaranteeing LC service's tail latency requirement. It quantifies the interference tolerance ability of each servpod through the analysis of tail-latency contribution. We evaluate Rhythm using LC services in forms of containerized processes and microservices, and find that it can improve the system throughput by 31.7%, CPU utilization by 26.2%, and memory bandwidth utilization by 34% while guaranteeing the SLA (service level agreement).

摘要翻译：undefined

Notes:

将云服务分为延迟关键型应用和批处理应用，对二者的部署做区分

## GrandSLAm: Guaranteeing SLAs for Jobs in Microservices Execution Frameworks

Authors: Ram Srivatsa Kannan; Lavanya Subramanian; Ashwin Raju; Jeongseob Ahn; Jason Mars; Lingjia Tang

Conference : EuroSys '19

Tags: `important`,`QoS`,`scheduler`

Url: <https://doi.org/10.1145/3302424.3303958>

Abstract: The microservice architecture has dramatically reduced user effort in adopting and maintaining servers by providing a catalog of functions as services that can be used as building blocks to construct applications. This has enabled datacenter operators to look at managing datacenter hosting microservices quite differently from traditional infrastructures. Such a paradigm shift calls for a need to rethink resource management strategies employed in such execution environments. We observe that the visibility enabled by a microservices execution framework can be exploited to achieve high throughput and resource utilization while still meeting Service Level Agreements, especially in multi-tenant execution scenarios. In this study, we present GrandSLAm, a microservice execution framework that improves utilization of datacenters hosting microservices. GrandSLAm estimates time of completion of requests propagating through individual microservice stages within an application. It then leverages this estimate to drive a runtime system that dynamically batches and reorders requests at each microservice in a manner where individual jobs meet their respective target latency while achieving high throughput. GrandSLAm significantly increases throughput by up to 3x compared to the our baseline, without violating SLAs for a wide range of real-world AI and ML applications.

摘要翻译：undefined

Notes:

微服务执行框架，估测每一个阶段的请求完成时间，利用估测的时间进行批处理和重排序使得每个任务满足它们的指标要求

## RTVirt: enabling time-sensitive computing on virtualized systems through cross-layer CPU scheduling

Authors: Ming Zhao; Jorge Cabrera

Conference : EuroSys '18

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/3190508.3190527>

Abstract: Virtualization enables flexible application delivery and efficient resource consolidation, and is pervasively used to build various virtualized systems including public and private cloud computing systems. Many applications can benefit from computing on virtualized systems, including those that are time sensitive, but it is still challenging for existing virtualized systems to deliver application-desired timeliness. In particular, the lack of awareness between VM host- and guest-level schedulers presents a serious hurdle to achieving strong timeliness guarantees on virtualized systems. This paper presents RTVirt, a new solution to time-sensitive computing on virtualized systems through cross-layer scheduling. It allows the two levels of schedulers on a virtualized system to communicate key scheduling information and coordinate on the scheduling decisions. It enables optimal multiprocessor schedulers to support virtualized time-sensitive applications with strong timeliness guarantees and efficient resource utilization. RTVirt is prototyped on a widely used virtualization framework (Xen) and evaluated with diverse workloads. The results show that it can meet application deadlines (99%) or tail latency requirements (99.9th percentile) nearly perfectly; it can handle large numbers of applications and dynamic changes in their timeliness requirements; and it substantially outperforms the existing solutions in both timeliness and resource utilization.

摘要翻译：undefined

Notes:

GuestOS的调度器和Host调度器之间怎么做信息传递，怎么更好地满足实时性要求。（我们的多层调度可能有可以参考的方面）

## Tableau: a high-throughput and predictable VM scheduler for high-density workloads

Authors: Manohar Vanga; Arpan Gujarati; Björn B. Brandenburg

Conference : EuroSys '18

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/3190508.3190557>

Abstract: In the increasingly competitive public-cloud marketplace, improving the efficiency of data centers is a major concern. One way to improve efficiency is to consolidate as many VMs onto as few physical cores as possible, provided that performance expectations are not violated. However, as a prerequisite for increased VM densities, the hypervisor's VM scheduler must allocate processor time efficiently and in a timely fashion. As we show in this paper, contemporary VM schedulers leave substantial room for improvements in both regards when facing challenging high-VM-density workloads that frequently trigger the VM scheduler. As root causes, we identify (i) high runtime overheads and (ii) unpredictable scheduling heuristics. To better support high VM densities, we propose Tableau, a VM scheduler that guarantees a minimum processor share and a maximum bound on scheduling delay for every VM in the system. Tableau combines a low-overhead, core-local, table-driven dispatcher with a fast on-demand table-generation procedure (triggered on VM creation/teardown) that employs scheduling techniques typically used in hard real-time systems. In an evaluation of Tableau and three current Xen schedulers on a 16-core Intel Xeon machine, Tableau is shown to improve tail latency (e.g., a 17X reduction in maximum ping latency compared to Credit) and throughput (e.g., 1.6X peak web server throughput compared to RTDS when serving 1 KiB files with a 100 ms SLA).

摘要翻译：undefined

Notes:

hypervisor的调度算法

## Welcome to zombieland: practical and energy-efficient memory disaggregation in a datacenter

Authors: Vlad Nitu; Boris Teabe; Alain Tchana; Canturk Isci; Daniel Hagimont

Conference : EuroSys '18

Tags: `useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/3190508.3190537>

Abstract: In this paper, we propose an effortless way for disaggregating the CPU-memory couple, two of the most important resources in cloud computing. Instead of redesigning each resource board, the disaggregation is done at the power supply domain level. In other words, CPU and memory still share the same board, but their power supply domains are separated. Besides this disaggregation, we make the two following contributions: (1) the prototyping of a new ACPI sleep state (called zombie and noted Sz) which allows to suspend a server (thus save energy) while making its memory remotely accessible; and (2) the prototyping of a rack-level system software which allows the transparent utilization of the entire rack resources (avoiding resource waste). We experimentally evaluate the effectiveness of our solution and show that it can improve the energy efficiency of state-of-the-art consolidation techniques by up to 86%, with minimal additional complexity.

摘要翻译：undefined

Notes:

做了服务器的CPU、内存的电源分配的隔离，硬件设计了一个zombie状态（本机关闭CPU和内存，但远端可以访问其内存）

## TetriSched: global rescheduling with adaptive plan-ahead in dynamic heterogeneous clusters

Authors: Alexey Tumanov; Timothy Zhu; Jun Woo Park; Michael A. Kozuch; Mor Harchol-Balter; Gregory R. Ganger

Conference : EuroSys '16

Tags: `important`,`scheduler`

Url: <https://doi.org/10.1145/2901318.2901355>

Abstract: TetriSched is a scheduler that works in tandem with a calendaring reservation system to continuously re-evaluate the immediate-term scheduling plan for all pending jobs (including those with reservations and best-effort jobs) on each scheduling cycle. TetriSched leverages information supplied by the reservation system about jobs' deadlines and estimated runtimes to plan ahead in deciding whether to wait for a busy preferred resource type (e.g., machine with a GPU) or fall back to less preferred placement options. Plan-ahead affords significant flexibility in handling mis-estimates in job runtimes specified at reservation time. Integrated with the main reservation system in Hadoop YARN, TetriSched is experimentally shown to achieve significantly higher SLO attainment and cluster utilization than the best-configured YARN reservation and CapacityScheduler stack deployed on a real 256 node cluster.

摘要翻译：undefined

Notes:

对数据中心的全局调度器，使用了提前预约的配置来提高应用的调度参数

## PSLO: enforcing the Xth percentile latency and throughput SLOs for consolidated VM storage

Authors: Ning Li; Hong Jiang; Dan Feng; Zhan Shi

Conference : EuroSys '16

Tags: `scheduler`

Url: <https://dl.acm.org/doi/10.1145/2901318.2901330>

Abstract: It is desirable but challenging to simultaneously support latency SLO at a pre-defined percentile, i.e., the Xth percentile latency SLO, and throughput SLO for consolidated VM storage. Ensuring the Xth percentile latency contributes to accurately differentiating service levels in the metric of the application-level latency SLO compliance, especially for the application built on multiple VMs. However, the Xth percentile latency SLO and throughput SLO enforcement are the opposite sides of the same coin due to the conflicting requirements for the level of IO concurrency. To address this challenge, this paper proposes PSLO, a framework supporting the Xth percentile latency and throughput SLOs under consolidated VM environment by precisely coordinating the level of IO concurrency and arrival rate for each VM issue queue. It is noted that PSLO can take full advantage of the available IO capacity allowed by SLO constraints to improve throughput or reduce latency with the best effort. We design and implement a PSLO prototype in the real VM consolidation environment created by Xen. Our extensive trace-driven prototype evaluation shows that our system is able to optimize the Xth percentile latency and throughput for consolidated VMs under SLO constraints.

摘要翻译：undefined

Notes:

## Reconciling high server utilization and sub-millisecond quality-of-service

Authors: Jacob Leverich; Christos Kozyrakis

Conference : EuroSys '14

Tags: `QoS`,`important`,`scheduler`

Url: <https://doi.org/10.1145/2592798.2592821>

Abstract: The simplest strategy to guarantee good quality of service (QoS) for a latency-sensitive workload with sub-millisecond latency in a shared cluster environment is to never run other workloads concurrently with it on the same server. Unfortunately, this inevitably leads to low server utilization, reducing both the capability and cost effectiveness of the cluster. In this paper, we analyze the challenges of maintaining high QoS for low-latency workloads when sharing servers with other workloads. We show that workload co-location leads to QoS violations due to increases in queuing delay, scheduling delay, and thread load imbalance. We present techniques that address these vulnerabilities, ranging from provisioning the latency-critical service in an interference aware manner, to replacing the Linux CFS scheduler with a scheduler that provides good latency guarantees and fairness for co-located workloads. Ultimately, we demonstrate that some latency-critical workloads can be aggressively co-located with other workloads, achieve good QoS, and that such co-location can improve a datacenter's effective throughput per TCO-\$ by up to 52%.

摘要翻译：undefined

Notes:

## CPI2: CPU performance isolation for shared compute clusters

Authors: Xiao Zhang; Eric Tune; Robert Hagmann; Rohit Jnagal; Vrigo Gokhale; John Wilkes

Conference : EuroSys '13

Tags: `isolation`,`scheduler`

Url: <https://doi.org/10.1145/2465351.2465388>

Abstract: Performance isolation is a key challenge in cloud computing. Unfortunately, Linux has few defenses against performance interference in shared resources such as processor caches and memory buses, so applications in a cloud can experience unpredictable performance caused by other programs' behavior. Our solution, CPI2, uses cycles-per-instruction (CPI) data obtained by hardware performance counters to identify problems, select the likely perpetrators, and then optionally throttle them so that the victims can return to their expected behavior. It automatically learns normal and anomalous behaviors by aggregating data from multiple tasks in the same job. We have rolled out CPI2 to all of Google's shared compute clusters. The paper presents the analysis that lead us to that outcome, including both case studies and a large-scale evaluation of its ability to solve real production issues.

摘要翻译：undefined

Notes:

利用CPI信息对异常应用做节流，来保证云服务的运行稳定性(QoS)

## A Comparative Analysis of Linux Mandatory Access Control Policy Enforcement Mechanisms

Authors: Brennon Brimhall; Justin Garrard; Christopher De La Garza; Joel Coffman

Conference : EUROSEC '23

Tags: `eBPF`,`eBPF performance`

Url: <https://dl.acm.org/doi/10.1145/3578357.3589454>

Abstract: Unix---and by extension, Linux---traditionally uses a discretionary access control (DAC) paradigm. DAC mechanisms are decentralized by design, which makes it difficult to audit the security of a computer system. Furthermore, Unix systems have the concept of a root user who can bypass any DAC policies in place. These issues led to the development of mandatory access control (MAC) mechanisms, such as AppArmor, Security-Enhanced Linux (SELinux), and eBPF. We compare and contrast the performance differences between two popular MAC mechanisms for the Linux kernel: SELinux and Berkeley Packet Filter (BPF)/kernel runtime security implementation (KRSI). We demonstrate that BPF policies offer superior performance, have greater expressive power, and are easier to implement than comparable SELinux policies. Our results suggest that BPF/KRSI is the leading MAC mechanism for Linux systems.

摘要翻译： Unix——以及Linux——传统上使用自由访问控制（DAC）模式。DAC机制在设计上是分散的，这使得审计计算机系统的安全性变得困难。此外，Unix系统具有根用户的概念，该用户可以绕过任何DAC策略。这些问题导致了强制性访问控制（MAC）机制的发展，如AppArmor、安全增强型Linux（SELinux）和eBPF。我们比较和对比了两种流行的Linux内核MAC机制：SELinux和Berkeley数据包过滤器（BPF）/内核运行时安全实现（KRSI）之间的性能差异。我们证明了BPF策略提供了卓越的性能，具有更大的表达能力，并且比类似的SELinux策略更容易实现。我们的结果表明，BPF/KRSI是Linux系统的主要MAC机制。

Notes:

这篇论文对eBPF的性能做出了评估，可以作为我们引言的引用论文

## Look Ma, no constants: practical constant blinding in GraalVM

Authors: Felix Berlakovich; Matthias Neugschwandtner; Gergö Barany

Conference : EuroSec '22

Tags: `JIT编译随机化`

Url: <https://doi.org/10.1145/3517208.3523751>

Abstract: With the advent of JIT compilers, code-injection attacks have seen a revival in the form of JIT spraying. JIT spraying enables an attacker to inject gadgets into executable memory, effectively sidestepping W⊕X and ASLR. In response to JIT spraying, constant blinding has emerged as a conceptually straightforward and performance friendly defense. Unfortunately, increasingly sophisticated attacks have pinpointed the shortcomings of existing constant blinding implementations. In this paper we present our constant blinding implementation in the GraalVM compiler, enabling constant blinding across a wide range of languages. Our implementation takes insights from the last decade of research on the security of constant blinding into account. We discuss important design decisions and trade-offs as well as the practical implementation issues encountered when implementing constant blinding for GraalVM. We evaluate the performance impact of our implementation with different configurations and demonstrate its effectiveness by fuzzing for unblinded constants.

摘要翻译： 随着JIT编译器的出现，代码注入攻击以JIT喷射的形式死灰复燃。JIT喷射使攻击者能够将小工具注入可执行内存，有效地避开WõX和ASLR。作为对JIT喷涂的回应，持续致盲已经成为一种概念上简单且性能友好的防御方式。不幸的是，越来越复杂的攻击已经指出了现有的不断盲目实现的缺点。在本文中，我们在GraalVM编译器中介绍了我们的恒定盲实现，它可以在各种语言中实现恒定盲。我们的实施考虑了过去十年对持续致盲安全性的研究。我们讨论了重要的设计决策和权衡，以及在为GraalVM实现恒定盲法时遇到的实际实现问题。我们评估了使用不同配置和demon实现的性能影响

Notes:

## syslrn: learning what to monitor for efficient anomaly detection

Authors: Davide Sanvito; Giuseppe Siracusano; Sharan Santhanam; Roberto Gonzalez; Roberto Bifulco

Conference : EuroMLSys '22

Tags: `important`

Url: <https://doi.org/10.1145/3517207.3526979>

Abstract: While monitoring system behavior to detect anomalies and failures is important, existing methods based on log-analysis can only be as good as the information contained in the logs, and other approaches that look at the OS-level software state introduce high overheads. We tackle the problem with syslrn, a system that first builds an understanding of a target system offline, and then tailors the online monitoring instrumentation based on the learned identifiers of normal behavior. While our syslrn prototype is still preliminary and lacks many features, we show in a case study for the monitoring of OpenStack failures that it can outperform state-of-the-art log-analysis systems with little overhead.

摘要翻译： 虽然监测系统行为以检测异常和故障很重要，但基于日志分析的现有方法只能与日志中包含的信息一样好，而其他查看操作系统级软件状态的方法会带来高昂的开销。我们使用syslrn来解决这个问题，该系统首先离线构建对目标系统的理解，然后根据学习到的正常行为标识符来定制在线监控工具。虽然我们的syslrn原型仍处于初步阶段，缺乏许多功能，但我们在一个用于监控OpenStack故障的案例研究中表明，它可以在几乎没有开销的情况下优于最先进的日志分析系统。

Notes:

监控系统先进行静态分析，只对静态分析得到的非常规路径进行动态监控，保证了监控系统同时拥有高性能和最好的错误处理能力

## An Evaluation of Service Mesh Frameworks for Edge Systems

Authors: Yehia Elkhatib; Jose Povedano Poyato

Conference : EdgeSys '23

Tags: `I/O performance`,`useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/3578354.3592867>

Abstract: Service Mesh Technologies (SMTs) are increasingly popular in simplifying the networking between microservices. They allow one to declaratively and programmatically define service-to-service policies and interactions, and take all sorts of network management logic (e.g., traffic splitting, request tracing, security, reliability) out of the application. This simplifies the development of microservice architectures, which are widely used in cloud and edge applications. However, the suitability for different SMTs for use in edge applications is unclear. Thus, this work compares the two most popular SMTs (Istio and Linkerd) in terms of performance and overhead for resource-constrained devices. Through extensive experimentation and comparing with a baseline of standard networking in a Kubernetes cluster, we identify that Linkerd offers a more edge-friendly SMT option in contrast to Istio. Overall, Istio's communications are ≈10% slower than Linkerd at an increased 1.2--1.4x more memory and ≈1.2x more CPU utilization.

摘要翻译： 服务网格技术（SMT）在简化微服务之间的网络方面越来越受欢迎。它们允许以声明和编程的方式定义服务到服务的策略和交互，并将各种网络管理逻辑（例如，流量分割、请求跟踪、安全性和可靠性）从应用程序中移除。这简化了微服务架构的开发，微服务架构广泛用于云和边缘应用程序。然而，不同SMT在边缘应用中的适用性尚不清楚。因此，这项工作在资源受限设备的性能和开销方面比较了两种最流行的SMT（Istio和Linkerd）。通过广泛的实验，并与Kubernetes集群中的标准网络基线进行比较，我们发现Linkerd提供了一个与Istio相比更边缘友好的SMT选项。总体而言，Istio的通信速度比Linkerd慢约10%，增加了1.2-1.4倍的内存和≈

Notes:

做了Linux上各种I/O接口的性能评估，其I/O性能的结论可能对调度器有用？

## ComB: a flexible, application-oriented benchmark for edge computing

Authors: Simon Bäurle; Nitinder Mohan

Conference : EdgeSys '22

Tags: `useless(probably)`

Url: <https://dl.acm.org/doi/10.1145/3517206.3526269>

Abstract: Edge computing is an attractive platform where applications, previously hosted in the cloud, shift parts of their workload on resources closer to the users. The field is still in its nascent stages with significant ongoing innovation in small form-factor hardware designed to operate at the edge. However, the increased hardware heterogeneity at the edge makes it difficult for application developers to determine if their workloads will operate as desired. Simultaneously, edge providers have to make expensive deployment choices for the "correct" hardware that will remain suitable for the near future. We present ComB, an application-oriented benchmarking suite for edge that assists early adopters in evaluating the suitability of an edge deployment. ComB is flexible, extensible, and incorporates a microservice-based video analytics pipeline as default workload to measure underlying hardware's compute and networking capabilities accurately. Our evaluation on a heterogeneous testbed shows that ComB enables both providers and developers to understand better the runtime capabilities of different hardware configurations for supporting operations of applications designed for the edge.

摘要翻译： 边缘计算是一个有吸引力的平台，以前托管在云中的应用程序可以将部分工作负载转移到更靠近用户的资源上。该领域仍处于初级阶段，设计用于边缘操作的小型硬件正在进行重大创新。然而，边缘硬件异构性的增加使得应用程序开发人员很难确定他们的工作负载是否会按预期运行。同时，边缘提供商必须为在不久的将来仍然适用的“正确”硬件做出昂贵的部署选择。我们介绍了ComB，这是一个面向应用程序的边缘基准测试套件，可帮助早期采用者评估边缘部署的适用性。ComB具有灵活性、可扩展性，并将基于微服务的视频分析管道作为默认工作负载，以准确测量底层硬件的计算和网络能力。我们在异构试验台上的评估表明

Notes:

## eCaaS: A Management Framework of Edge Container as a Service for Business Workload

Authors: Lianjie Cao; Anu Merican; Diman Zad Tootaghaj; Faraz Ahmed; Puneet Sharma; Vinay Saxena

Conference : EdgeSys '21

Tags: `useless(probably)`

Url: <https://doi.org/10.1145/3434770.3459741>

Abstract: Enterprises are containerizing their business applications and extending those applications from cloud to edge to achieve better flexibility, agility, and performance for their business workload. Unlike data centers, edge sites including infrastructure and orchestration systems are often heterogeneous and highly customized depending on the resource availability, business requirements of the use case, and technical requirements of the application. However, in many business use cases, the lack of IT professionals with proper domain expertise makes it very challenging to create, manage, and support heterogeneous containerized edge sites at a large scale. In this work, we present the eCaaS framework that provides automated lifecycle management of containerized edge sites and applications. With eCaaS, users can create customized edge sites with only high-level business intents which are analyzed and translated to deployment templates with low-level specifications. The edge site deployment templates are then automatically executed to build, deploy, and configure the containerized edge sites and applications. To support more customization options in the future, eCaaS decouples user intents, deployment rules, and deployment specifications and formulates deployment template generation as an SMT problem to achieve better scalability and extensibility. For creating an edge site with five nodes, eCaaS takes less than one second to generate the deployment template and less than ten minutes to complete the entire deployment.

摘要翻译：undefined

Notes:

## Snowflakes at the Edge: A Study of Variability among NVIDIA Jetson AGX Xavier Boards

Authors: Hazem A. Abdelhafez; Hassan Halawa; Karthik Pattabiraman; Matei Ripeanu

Conference : EdgeSys '21

Tags: `useless(probably)`

Url: <https://doi.org/10.1145/3434770.3459729>

Abstract: While applications deployed at the edge often rely on performance stability (or, at a minimum, on a predictable level of performance), variability at the edge remains a real problem \[4]. This study uncovers a surprising source of variability: intrinsic variability (in performance and power consumption) among edge platforms that are nominally identical. We focus on a popular platform designed for edge applications, the NVIDIA Jetson AGX, and aim to answer the following high-level questions through rigorous statistical analysis: (i) are the edge devices in our study statistically different from each other in terms of applications' runtime performance and power draw (although they are sold under the same product model and family)?, (ii) if the differences between these edge devices are statistically significant, what is the magnitude of these differences?, and (iii) do these differences matter from the application's perspective?

摘要翻译：undefined

Notes:

## ExEC: Elastic Extensible Edge Cloud

Authors: Aleksandr Zavodovski; Nitinder Mohan; Suzan Bayhan; Walter Wong; Jussi Kangasharju

Conference : EdgeSys '19

Tags: `useless(probably)`

Url: <https://doi.org/10.1145/3301418.3313941>

Abstract: Edge computing (EC) extends the centralized cloud computing paradigm by bringing computation into close proximity to the end-users, to the edge of the network, and is a key enabler for applications requiring low latency such as augmented reality or content delivery. To make EC pervasive, the following challenges must be tackled: how to satisfy the growing demand for edge computing facilities, how to discover the nearby edge servers, and how to securely access them? In this paper, we present ExEC, an open framework where edge providers can offer their capacity and be discovered by application providers and end-users. ExEC aims at the unification of interaction between edge and cloud providers so that cloud providers can utilize services of third-party edge providers, and any willing entity can easily become an edge provider. In ExEC, the unfolding of initially cloud-deployed application towards edge happens without administrative intervention, since ExEC discovers available edge providers on the fly and monitors incoming end-user traffic, determining the near-optimal placement of edge services. ExEC is a set of loosely coupled components and common practices, allowing for custom implementations needed to embrace the diverse needs of specific EC scenarios. ExEC leverages only existing protocols and requires no modifications to the deployed infrastructure. Using real-world topology data and experiments on cloud platforms, we demonstrate the feasibility of ExEC and present results on its expected performance.

摘要翻译：undefined

Notes:

是原云服务应用迁移到边缘的自动化组件工具，提供给客户最优边缘服务器，边缘服务器是在线发现的，无须停机增加边缘服务器数据

## QoS-based Cloud Application Management: Approach and Architecture

Authors: Vladimir Podolskiy; Hans Michael Gerndt; Shajulin Benedict

Conference : Crosscloud'17

Tags: `QoS`

Url: <https://dl.acm.org/doi/10.1145/3069383.3069390>

Abstract: The management of cloud infrastructures became a lot more difficult in course of last years due to the growing demand for high quality of cloud services. The lack of the ability to adapt the existing services to the dynamically changing demand from users' side yields problems of the quality of the provided services. In the poster, we present a novel decentralized architecture and approach for automatic cloud resources management under QoS requirements and budget constraints. The proposed architecture is aimed at dynamically adapting cloud application deployment on different levels of cloud infrastructure in order to meet QoS requirements and to reduce cost of cloud services.

摘要翻译：undefined

Notes:

所提出的体系结构旨在动态调整云应用程序在不同级别的云基础设施上的部署，以满足QoS要求并降低云服务的成本。（还得往下看，摘要写得不是很清楚）

## Performance Characterization of Modern Storage Stacks: POSIX I/O, libaio, SPDK, and io\_uring

Authors: Zebin Ren; Animesh Trivedi

Conference : CHEOPS '23

Tags: `I/O performance`

Url: <https://dl.acm.org/doi/10.1145/3578353.3589545>

Abstract: Linux storage stack offers a variety of storage I/O stacks and APIs such as POSIX I/O, asynchronous I/O (libaio), high-performance asynchronous I/O (emerging io\_uring) or SPDK, the last of which completely bypasses the kernel. Despite their availability, there has not been a systematic study of their performance and overheads. In order to aid our understanding, in this work we systematically characterize performance, scalability and microarchitectural properties of popular Linux I/O APIs on high-performance storage hardware (Intel Optane SSDs). Our characterization reveals that: (1) at low I/O loads, all APIs perform competitively with each other, with polling helping the performance by 1.7X, but consuming 2.3X CPU instructions; (2) at high-loads and scale, io\_uring is more than an order of magnitude slower than SPDK; (3) at high-loads and scale, the benchmarking tool (fio) itself becomes a bottleneck; (4) state-of-practice Linux block I/O schedulers (BFQ, mq-deadline, and Kyber) introduce significant (up to 50%) overheads, and their use of global locks hinder their scalability. All artifacts from this work are available at <https://github.com/atlarge-research/Performance-Characterization-Storage-Stacks>.

摘要翻译： Linux存储堆栈提供了各种存储I/O堆栈和API，如POSIX I/O、异步I/O（libaio）、高性能异步I/O（新兴io\_uring）或SPDK，最后一种完全绕过内核。尽管它们可用，但尚未对其性能和管理费用进行系统研究。为了帮助我们理解，在这项工作中，我们系统地描述了高性能存储硬件（Intel Optane SSD）上流行的Linux I/O API的性能、可扩展性和微体系结构特性。我们的表征表明：（1）在低I/O负载下，所有API的性能都具有竞争力，轮询的性能提高了1.7倍，但消耗了2.3倍的CPU指令；（2） 在高负载和高规模下，io\_uring比SPDK慢一个数量级以上；（3） 在高负载和高规模的情况下，基准测试工具（fio）本身就成为了一个瓶颈；（4） 实践状态Linux块I/O调度器（BFQ、mq截止日期和Kyber）简介

Notes:

做了Linux上各种存储、I/O接口的性能评估，其I/O性能的结论可能对调度器有用？
