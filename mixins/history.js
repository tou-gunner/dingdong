// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016-2026 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import { history } from '@/api/public.js'
export default {
  data() {
    return {
      
    };
  },
  methods: {
    getHistory() {
      if (!this.$util) {
        console.error('$util 未定义，请检查配置');
        return;
      }
			console.log(this.$util.getNowUrl(),'page')
      history({
				page:this.$util.getNowUrl()
			}).then(res=>{
        // 处理成功响应
        console.log('获取历史记录成功', res);
      }).catch(error => {
        // 处理错误响应
        console.error('获取历史记录失败', error);
      });
    },
  }
};
