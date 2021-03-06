import { defineBlocksWithDt } from '../../register';

defineBlocksWithDt(
  `

prefix: learner
style: learner_blocks
help: https://pytorch.org/docs/stable/optim.html

set
设置(var learner: Learner)为{Learner}
Python
$A0 = $A1

get: Learner
(var learner: Learner)
Python
$A0

create
创建学习器(var learner:Learner) 损失:{Loss}优化器:{Optimizer:R}
inline: false
Python
$A0 = $A1, $A2

use
执行学习器(var learner:Learner) 实际值:{Tensor}预测值:{Tensor:R}赋值损失结果到{num:R}
inline: false
Python
loss_f, optimizer = $A0
l = loss_f($A2, $A1)
optimizer.zero_grad()
l.backward()
optimizer.step()
$A3 = l.cpu().item()

onehot_acc: num
计算one-hot正确数量 预测值:{Tensor:R}正确值:{Tensor:R}
inline: false
Python
($A0.argmax(dim=1) == $A1).sum().cpu().item()

prefix: optimizer

new: Optimizer,Function
创建[SGD/Adam/RMSprop]优化器 模型:{Module} 学习率:{num:R}
inline: false
Python
import: from torch import optim
optim.$A0($A1.parameters(), $A2)

prefix: loss

new: Loss,Function
创建[L1损失:L1Loss/平滑L1损失:SmoothL1Loss/均值损失:MSELoss/交叉熵损失:CrossEntropyLoss/二分类交叉熵损失:BCELoss]函数
Python
import: from torch import nn
nn.$A0()

`,
  false,
);
