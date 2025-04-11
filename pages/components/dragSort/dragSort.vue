<template>
  <view class="container">
    <view class="menu-title">菜单列表</view>
    <view class="grid-container">
      <view
        class="grid-item"
        v-for="(item, index) in menuList"
        :key="index"
        :class="{ 'active': currentIndex === index }"
        :style="getPositionStyle(index)"
        @touchstart="handleTouchStart($event, index)"
        @touchmove.stop.prevent="handleTouchMove($event)"
        @touchend="handleTouchEnd"
      >
        <view class="item-content">
          <view class="item-icon">
            <uni-icons :type="item.icon || 'star'" size="24"></uni-icons>
          </view>
          <view class="item-name">{{ item.name }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'MenuGrid',
  data() {
    return {
      // 菜单项列表
      menuList: [
        { name: '首页', icon: 'home' },
        { name: '消息', icon: 'chat' },
        { name: '联系人', icon: 'contact' },
        { name: '日历', icon: 'calendar' },
        { name: '设置', icon: 'gear' },
        { name: '相册', icon: 'image' },
        { name: '文件', icon: 'folder' },
        { name: '位置', icon: 'location' },
        { name: '收藏', icon: 'star-filled' },
        { name: '视频', icon: 'videocam' },
        { name: '音乐', icon: 'sound' },
        { name: '订单', icon: 'paperplane' }
      ],
      // 网格配置
      columns: 4,     // 每行显示的列数
      itemSize: 80,   // 每个项目的大小 (单位px)
      itemGap: 15,    // 项目之间的间隔
      // 拖拽状态
      currentIndex: -1, // 当前拖拽的项目索引
      startX: 0,       // 触摸开始X坐标
      startY: 0,       // 触摸开始Y坐标
      moveOffsetX: 0,  // X轴移动的距离
      moveOffsetY: 0,  // Y轴移动的距离
      positions: [],   // 所有项目的位置
      isDragging: false // 是否正在拖拽
    }
  },
  mounted() {
    this.initPositions();
  },
  methods: {
    // 初始化所有项目的位置
    initPositions() {
      this.positions = [];
      const { itemSize, itemGap, columns } = this;

      this.menuList.forEach((_, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;

        // 计算项目位置
        this.positions.push({
          x: col * (itemSize + itemGap),
          y: row * (itemSize + itemGap),
          zIndex: 1
        });
      });
    },

    // 获取项目定位样式
    getPositionStyle(index) {
      if (!this.positions[index]) return '';

      const position = this.positions[index];
      const { itemSize } = this;

      return {
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        width: `${itemSize}px`,
        height: `${itemSize}px`,
        zIndex: position.zIndex || 1
      };
    },

    // 处理触摸开始
    handleTouchStart(event, index) {
      if (this.isDragging) return;

      const touch = event.touches[0];
      this.currentIndex = index;
      this.startX = touch.clientX;
      this.startY = touch.clientY;
      this.moveOffsetX = 0;
      this.moveOffsetY = 0;
      this.isDragging = true;

      // 提升当前项的层级
      this.positions[index].zIndex = 10;

      // 震动反馈
      uni.vibrateShort();
    },

    // 处理触摸移动
    handleTouchMove(event) {
      if (this.currentIndex === -1 || !this.isDragging) return;

      const touch = event.touches[0];
      // 计算移动距离
      const deltaX = touch.clientX - this.startX;
      const deltaY = touch.clientY - this.startY;

      this.moveOffsetX += deltaX;
      this.moveOffsetY += deltaY;

      // 更新拖拽项的位置
      this.positions[this.currentIndex].x += deltaX;
      this.positions[this.currentIndex].y += deltaY;

      // 更新开始位置，用于下一次移动计算
      this.startX = touch.clientX;
      this.startY = touch.clientY;

      // 检查是否需要交换位置
      this.checkForSwap();
    },

    // 处理触摸结束
    handleTouchEnd() {
      if (this.currentIndex === -1) return;

      // 重置拖拽项的层级
      if (this.positions[this.currentIndex]) {
        this.positions[this.currentIndex].zIndex = 1;
      }

      // 将所有项吸附到网格
      this.snapAllItemsToGrid();

      // 重置拖拽状态
      this.isDragging = false;
      this.currentIndex = -1;
      this.moveOffsetX = 0;
      this.moveOffsetY = 0;

      // 触发排序完成事件
      this.$emit('sort-complete', [...this.menuList]);
    },

    // 将所有项吸附到网格
    snapAllItemsToGrid() {
      const { itemSize, itemGap, columns } = this;

      this.menuList.forEach((_, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;

        this.positions[index] = {
          x: col * (itemSize + itemGap),
          y: row * (itemSize + itemGap),
          zIndex: 1
        };
      });
    },

    // 检查是否需要交换位置
    checkForSwap() {
      if (this.currentIndex === -1) return;

      const currentPos = this.positions[this.currentIndex];
      const { itemSize, itemGap } = this;
      let closestIndex = -1;
      let minDistance = Number.MAX_VALUE;

      // 找出与当前拖拽项距离最近的项
      this.positions.forEach((pos, index) => {
        if (index !== this.currentIndex) {
          // 计算中心点之间的距离
          const centerX1 = currentPos.x + itemSize / 2;
          const centerY1 = currentPos.y + itemSize / 2;
          const centerX2 = pos.x + itemSize / 2;
          const centerY2 = pos.y + itemSize / 2;

          const distance = Math.sqrt(
            Math.pow(centerX1 - centerX2, 2) +
            Math.pow(centerY1 - centerY2, 2)
          );

          // 只考虑距离小于阈值的项
          const threshold = (itemSize + itemGap) * 0.6;
          if (distance < threshold && distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        }
      });

      // 如果找到了足够近的项，交换位置
      if (closestIndex !== -1) {
        this.swapItems(this.currentIndex, closestIndex);
      }
    },

    // 交换两个项目
    swapItems(fromIndex, toIndex) {
      // 交换菜单列表中的项
      const temp = { ...this.menuList[fromIndex] };
      this.$set(this.menuList, fromIndex, { ...this.menuList[toIndex] });
      this.$set(this.menuList, toIndex, temp);

      // 交换位置信息
      [this.positions[fromIndex], this.positions[toIndex]] =
      [this.positions[toIndex], this.positions[fromIndex]];

      // 更新当前拖拽的索引
      this.currentIndex = toIndex;
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  background-color: #f7f7f7;
}

.menu-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  text-align: center;
}

.grid-container {
  position: relative;
  width: 100%;
  min-height: 500rpx;
  overflow: hidden;
}

.grid-item {
  position: absolute;
  left: 0;
  top: 0;
  transition: transform 0.3s ease;
  will-change: transform;
}

.grid-item.active {
  transition: none;
  transform: scale(1.05);
  z-index: 10;
}

.item-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.item-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10rpx;
}

.item-name {
  font-size: 24rpx;
  color: #333;
  text-align: center;
}
</style>
