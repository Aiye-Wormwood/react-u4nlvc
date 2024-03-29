# Ract.js 入门教程学习笔记
教程:[Ract.js实践教程](https://zh-hans.reactjs.org/tutorial/tutorial.html)

## 学习成果
1.Rect控件,数据流,基本语法,入门. 

2.扩展官网教程Demo的3格棋盘到10格棋盘,布局微调,历史记录从右侧移到下方.
 
3.放弃官网教程Demo的穷举法获胜算法,改为更加通用的,根据落子点周围数据收集结果,判定胜出算法.
 
## 判定胜出算法

### 方法 
胜负判定function calculateWinner(squares,i) {}

squares,当前棋盘落子结果的一维数组. 

i,最后一次落子的数组下标. 

输出结果:胜者的值,X或O,没有胜者null.

### 逻辑
1.一维坐标向二维坐标转换.

2.因为是5子连珠获胜,在二维坐标内,从落子点开始由内向外,从8个方向上,收集4层落子数据.

3.从落子点开始由内向外,某一个方向A上4次判定是否有与最后一次落子值相同的点,得出胜者. 

4.上一步不足4次判定的情况,从落子点开始由内向外,在A方向的同一条直线上的相对方向B上,能继续完成4次判定的,得出胜者. 

5.其它情况,返回null,表示没有胜者.

### 优点
1.落子一次,判定一次,需要保证效率,所以不能穷举,只能以落子点为中心展开判定.

2.尽量少的使用循环,共两次,一次收集,一次判定胜负.

3.收集数据结构{index: 一维坐标 , x: 二维坐标 , y:二维坐标 , d: 二维方向(8个)}简洁.

## 补充
1.数据收集,判定坐标是否超过棋盘.

2.数据收集,判定是否有落子,不落子,不收集.

3.数据收集结果,使用二维数组.

4.判定胜负,依赖数据收集结果,在结果的某个层次中,按方向d查找是否有落子.
