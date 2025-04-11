<template>
	<view class="container">
		<view class="header">
			<image class="logo" src="/static/logo.png"></image>
			<text class="title">组件库导航</text>
		</view>
		
		<view class="component-list">
			<view 
				class="component-item" 
				v-for="(item, index) in componentList" 
				:key="index"
				@click="navigateTo(item.path)"
			>
				<view class="item-content">
					<text class="item-icon">{{item.icon}}</text>
					<view class="item-info">
						<text class="item-name">{{item.name}}</text>
						<text class="item-desc">{{item.description}}</text>
					</view>
				</view>
				<text class="item-arrow">›</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const componentList = ref([
	{
		name: '拖拽实现案例',
		icon: '🔄',
		description: '兼容h5，小程序端的拖拽实现例子',
		path: '/pages/components/dragSort/dragSort'
	},
	{
		name: '表单组件',
		icon: '📝',
		description: '输入框、选择器、开关等表单控件',
		path: '/pages/components/form/index'
	},
	{
		name: '数据组件',
		icon: '📊',
		description: '表格、列表、图表等数据展示组件',
		path: '/pages/components/data/index'
	},
	{
		name: '反馈组件',
		icon: '💬',
		description: '对话框、提示、加载等交互反馈',
		path: '/pages/components/feedback/index'
	},
	{
		name: '导航组件',
		icon: '🧭',
		description: '标签页、菜单、面包屑等导航组件',
		path: '/pages/components/navigation/index'
	},
	{
		name: '媒体组件',
		icon: '🎥',
		description: '图片、视频、音频等媒体组件',
		path: '/pages/components/media/index'
	}
])

const navigateTo = (path) => {
	uni.navigateTo({
		url: path
	})
}
</script>

<style>
.container {
	padding: 30rpx;
	background-color: #f5f5f5;
	min-height: 100vh;
}

.header {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx 0;
	margin-bottom: 40rpx;
}

.logo {
	height: 120rpx;
	width: 120rpx;
	margin-bottom: 20rpx;
}

.title {
	font-size: 48rpx;
	font-weight: bold;
	color: #333;
}

.component-list {
	background-color: #fff;
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.1);
}

.component-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 40rpx;
	border-bottom: 2rpx solid #f5f5f5;
}

.component-item:last-child {
	border-bottom: none;
}

.item-content {
	display: flex;
	align-items: center;
	flex: 1;
}

.item-icon {
	font-size: 48rpx;
	margin-right: 30rpx;
}

.item-info {
	flex: 1;
}

.item-name {
	font-size: 32rpx;
	color: #333;
	font-weight: 500;
	margin-bottom: 8rpx;
	display: block;
}

.item-desc {
	font-size: 24rpx;
	color: #999;
	display: block;
}

.item-arrow {
	font-size: 40rpx;
	color: #999;
	margin-left: 20rpx;
}

.component-item:active {
	background-color: #f8f8f8;
}
</style>
