<template>
  <view class="language-switcher">
    <!-- Popup Mode -->
    <view v-if="mode === 'popup'" class="lang-current" @click="showPicker = true">
      <text class="lang-label">{{ $t('common.language') }}</text>
      <text class="lang-value">{{ currentLocaleName }}</text>
      <text class="iconfont icon-ic_rightarrow"></text>
    </view>
    
    <!-- Inline Mode -->
    <view v-else class="lang-inline">
      <view 
        v-for="locale in locales" 
        :key="locale.code"
        class="lang-item"
        :class="{ active: currentLocale === locale.code }"
        @click="changeLanguage(locale.code)"
      >
        {{ locale.name }}
      </view>
    </view>

    <!-- Language Picker Popup -->
    <uni-popup ref="popup" type="bottom" @change="onPopupChange">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ $t('common.language') }}</text>
          <view class="popup-close" @click="closePicker">
            <text class="iconfont icon-guanbi"></text>
          </view>
        </view>
        <view class="popup-body">
          <view 
            v-for="locale in locales" 
            :key="locale.code"
            class="lang-option"
            :class="{ active: currentLocale === locale.code }"
            @click="changeLanguage(locale.code)"
          >
            <text class="option-name">{{ locale.name }}</text>
            <text v-if="currentLocale === locale.code" class="iconfont icon-xuanzhong1 check-icon"></text>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { setLocale, getLocales, getLocaleName } from '@/locales'

export default {
  name: 'LanguageSwitcher',
  props: {
    // 'popup' for settings page, 'inline' for simple toggle
    mode: {
      type: String,
      default: 'popup'
    }
  },
  data() {
    return {
      locales: getLocales(),
      showPicker: false
    }
  },
  computed: {
    currentLocale() {
      return this.$i18n.locale
    },
    currentLocaleName() {
      return getLocaleName(this.$i18n.locale)
    }
  },
  watch: {
    showPicker(val) {
      if (val) {
        this.$refs.popup.open()
      } else {
        this.$refs.popup.close()
      }
    }
  },
  methods: {
    changeLanguage(code) {
      if (code !== this.currentLocale) {
        if (setLocale(code)) {
          uni.showToast({
            title: this.$t('common.languageChanged'),
            icon: 'success',
            duration: 1500
          })
          
          // Emit event for parent components
          this.$emit('change', code)
          
          // Close picker if in popup mode
          if (this.mode === 'popup') {
            this.closePicker()
          }
        }
      } else if (this.mode === 'popup') {
        this.closePicker()
      }
    },
    closePicker() {
      this.showPicker = false
    },
    onPopupChange(e) {
      this.showPicker = e.show
    }
  }
}
</script>

<style lang="scss" scoped>
.language-switcher {
  .lang-current {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    background: #fff;
    
    .lang-label {
      font-size: 28rpx;
      color: #333;
    }
    
    .lang-value {
      flex: 1;
      text-align: right;
      font-size: 28rpx;
      color: #999;
      margin-right: 10rpx;
    }
    
    .iconfont {
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .lang-inline {
    display: flex;
    gap: 20rpx;
    flex-wrap: wrap;
    
    .lang-item {
      padding: 16rpx 32rpx;
      border-radius: 8rpx;
      background: #f5f5f5;
      font-size: 26rpx;
      color: #666;
      transition: all 0.2s;
      
      &.active {
        background: var(--view-theme, #e93323);
        color: #fff;
      }
    }
  }
}

.popup-content {
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  overflow: hidden;
  
  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    border-bottom: 1rpx solid #eee;
    
    .popup-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
    
    .popup-close {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .iconfont {
        font-size: 32rpx;
        color: #999;
      }
    }
  }
  
  .popup-body {
    padding: 20rpx 0;
    max-height: 60vh;
    overflow-y: auto;
    
    .lang-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30rpx;
      transition: background 0.2s;
      
      &:active {
        background: #f5f5f5;
      }
      
      &.active {
        .option-name {
          color: var(--view-theme, #e93323);
          font-weight: 500;
        }
      }
      
      .option-name {
        font-size: 30rpx;
        color: #333;
      }
      
      .check-icon {
        font-size: 36rpx;
        color: var(--view-theme, #e93323);
      }
    }
  }
}
</style>
