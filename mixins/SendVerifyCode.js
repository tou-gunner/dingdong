// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016-2026 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
export default {
  data() {
    return {
      disabled: false,
      text: "ຂໍລະຫັດຢືນຢັນ"
    };
  },
  methods: {
    sendCode() {
      if (this.disabled) return;
      this.disabled = true;
      let n = 60;
      this.text = "剩余 " + n + "s";
      const run = setInterval(() => {
        n--;
        if (n >= 0) {
          this.text = "ເຫຼືອ " + n + "s";
        } else {
          clearInterval(run);
          this.disabled = false;
          this.text = "ຂໍໃໝ່";
        }
      }, 1000);

    }
  }
};
