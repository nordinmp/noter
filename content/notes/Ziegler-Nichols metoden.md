---
title: Ziegler-Nichols metoden
tags:
  - metode
  - teknikfag
  - ordbog
---
Man sætter $I$ og $D$ til 0, og så stiger $K_p$ fra 0 indtil den får den ultimative $K_u$
Så bruger man $K_u$ og $T_u$ til at finde alle de andre $P$, $I$ og $D$
den ultimative $K_u$ kan defines som 1/M og M er amplitude ratioen. $K_i = K_p/T_i$ og $K_d = K_pT_d$

|     **Control Type**     |        $K_p$         |       $T_i$        |       $T_d$        |             $K_i$              |         $K_d$          |
| :----------------------: | :------------------: | :----------------: | :----------------: | :----------------------------: | :--------------------: |
|          **P**           |       $0.5K_u$       |         –          |         –          |               –                |           –            |
|          **PI**          |      $0.45K_u$       | $0.8\overline3T_u$ |         –          |         $0.54K_u/T_u$          |           –            |
|          **PD**          |       $0.8K_u$       |         –          |     $0.125T_u$     |               –                |      $0.10K_uT_u$      |
|     **classic PID**      |       $0.6K_u$       |      $0.5T_u$      |     $0.125T_u$     |      $1.2\frac{K_u}{T_u}$      |     $0.075K_uT_u$      |
| **Pessen Integral Rule** |       $0.7K_u$       |      $0.4T_u$      |     $0.15T_u$      |     $1.75\frac{K_u}{T_u}$      |     $0.105K_uT_u$      |
|    **some overshoot**    | $0.3\overline{3}K_u$ |     $0.50T_u$      | $0.3\overline3T_u$ | $0.6\overline6\frac{K_u}{T_u}$ | $0.1\overline1K_uT_u$  |
|     **no overshoot**     |      $0.20K_u$       |     $0.50T_u$      | $0.3\overline3T_u$ |      $0.4\frac{K_u}{T_u}$      | $0.06\overline6K_uT_u$ |

These 3 parameters are used to establish the correction ${\displaystyle u(t)}$ from the error ${\displaystyle e(t)}$ via the equation:


$u(t) = K_p \left( e(t) + \frac{1}{T_i} \int_0^t e(\tau) \, d\tau + T_d \frac{de(t)}{dt} \right)$



which has the following transfer function relationship between error and controller output:

${\displaystyle u(s)=K_{p}\left(1+{\frac {1}{T_{i}s}}+T_{d}s\right)e(s)=K_{p}\left({\frac {T_{d}T_{i}s^{2}+T_{i}s+1}{T_{i}s}}\right)e(s)}$
