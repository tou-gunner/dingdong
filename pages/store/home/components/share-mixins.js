import { getUserInfo } from '@/api/user.js';

export default {
  /**
 * 用户点击右上角分享
 */
  // #ifdef MP
  onShareAppMessage() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    let that = this;
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];
    return {
      title: that.store.mer_name || '',
      imageUrl: that.store.mer_avatar || '',
      path: page.$page.fullPath + '&spid=' + that.uid,
    }
  },
  onShareTimeline() {
    let that = this;
    return {
      title: that.store.mer_name || '',
      query: {
        id: that.id,
        spid: that.uid
      },
      imageUrl: that.store.mer_avatar || ''
    }
  },
  // #endif
  methods: {
    ShareInfo() {
      //#ifdef H5
      let data = this.store;
      let href = location.href;
      if (this.$wechat.isWeixin()) {
        getUserInfo().then(res => {
          href =
            href.indexOf("?") === -1 ?
              href + "?spid=" + res.data.uid :
              href + "&spid=" + res.data.uid;
          let configAppMessage = {
            desc: data.mer_info,
            title: data.mer_name,
            link: href,
            imgUrl: data.mer_avatar
          };
          this.$wechat.wechatEvevt([
            "updateAppMessageShareData",
            "updateTimelineShareData",
            "onMenuShareAppMessage",
            "onMenuShareTimeline"
          ], configAppMessage).then(res => { }).catch(err => {
            console.log(err);
          })
        });
      }
      //#endif
    },
  }
}