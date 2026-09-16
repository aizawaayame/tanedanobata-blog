---
title: Actor Role and Remote Role
slug: note-723175ad8be0
published: 2025-04-09
draft: false
description: ''
tags: []
category: UE
lang: zh_CN
kind: note
directory: UE/Network
route: /UE/Network/Actor Role and Remote Role/
---

## Get Role 接口

```cpp 
const ENetRole LocalRole = MyActor->GetLocalRole();
```


获取当前Actor的LocalRole


```cpp
const ENetRole RemoteRole = MyActor->GetRemoteRole();
```


获取当前Actor的RemoteRole


## Actor Role States

| Role                   | Description                                                                      |
| ---------------------- | -------------------------------------------------------------------------------- |
| `ROLE_None`            | 无角色。此 Actor 不会被复制。                                                               |
| `ROLE_SimulatedProxy`  | 此 Actor 的模拟代理。此 Actor 模拟真实状态，但无权更改状态或调用远程函数。                                     |
| `ROLE_AutonomousProxy` | 此 Actor 的自主代理。此 Actor 模拟真实状态，并且有权更改状态和调用远程函数。                                    |
| `ROLE_Authority`       | 对此 Actor 的权威控制。此 Actor 拥有网络连接的真实状态，并且有权更改状态和调用函数。此 Actor 还负责跟踪属性更改并将它们复制到连接的客户端。 |

```cpp
void APawn::PossessedBy(AController* NewController)
{
    //...
    if (APlayerController* PlayerController = Cast<APlayerController>(Controller))
    {
        if (GetNetMode() != NM_Standalone)  
        {  
            SetReplicates(true);  
            SetAutonomousProxy(true);  
        }
    }
    //...
}

void AActor::SetAutonomousProxy(const bool bInAutonomousProxy, const bool bAllowForcePropertyCompare)
{
    if (bReplicates)
    {
        //...
        const TEnumAsByte<enum ENetRole> OldRemoteRole = RemoteRole;  
        RemoteRole = (bInAutonomousProxy ? ROLE_AutonomousProxy : ROLE_SimulatedProxy);
        //...
    }
    //...
}
```


1. 在 `PossessedBy` 函数中这只 `RemoteRole` 。

2. 设置函数为 `Actor::SetAutonomousProxy`, 如果存在主控客户端则设置为 `ROLE_AutonomousProxy`，否则默认为 `ROLE_SimulatedProxy`。


## Actor Role Matrix

| **Local Role  本地角色**   | **Remote Role  远程角色**  | **Server or Client  服务器或客户端** | **Description  描述**                                           |
| ---------------------- | ---------------------- | ----------------------------- | ------------------------------------------------------------- |
| `ROLE_Authority`       | `ROLE_AutonomousProxy` | Server  服务器                   | 此 Actor Pawn 由连接的客户端之一控制。                                     |
| `ROLE_AutonomousProxy` | `ROLE_Authority`       | Client  客户端                   | 此 Actor Pawn 由此连接的客户端控制。                                      |
| `ROLE_SimulatedProxy`  | `ROLE_Authority`       | Client  客户端                   | 此 Actor Pawn 由其他连接的客户端之一控制。<br>未被任何客户端控制的复制 Actor 也可以具有此角色组合。 |
| `ROLE_Authority`       | `ROLE_None`            | Client  客户端                   | 这是一个未复制的 Actor。                                               |
