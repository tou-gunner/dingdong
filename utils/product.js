// 获取商品营销类型
export const getProductPromotionType = product => {
  const productType = product.product_type;
  if (productType === 1) {
    return "秒杀";
  } else if (productType === 2) {
    return "预售";
  } else if (productType === 3) {
    return "助力";
  } else if (productType === 4) {
    return "拼团";
  }

  return null;
}


const TAG_CONFIG = [
  {
    label: "自营",
    style: {
      borderColor: "var(--view-theme)",
      backgroundColor: "var(--view-theme)",
      color: "#fff",
    },
    predicate: product => {
      return product?.merchant?.is_trader === 1;
    }
  },
  {
    getLabel: product => {
      return product?.merchant?.type_name;
    },
    style: {
      borderColor: "var(--view-theme)",
      backgroundColor: "var(--view-theme)",
      color: "#fff",
    },
    predicate: product => {
      return product?.merchant?.type_name;
    }
  },
  {
    label: "领券",
    style: {
      color: "var(--view-theme)",
      borderColor: "var(--view-theme)",
    },
    predicate: product => {
      return !!product?.issetCoupon;
    }
  },
  {
    label: "包邮",
    style: {
      color: "#FF9000",
      borderColor: "#FF9000",
    },
    predicate: product => {
      return product.delivery_free === 1;
    }
  },
  {
    label: "到店",
    style: {
      color: "#7E5FBD",
      borderColor: "#7E5FBD",
    },
    predicate: product => {
      return product.type === 4 && product.reservation_type === 1;
    }
  },
  {
    label: "上门",
    style: {
      color: "#7E5FBD",
      borderColor: "#7E5FBD",
    },
    predicate: product => {
      return product.type === 4 && product.reservation_type === 2;
    }
  },
  {
    label: "上门+到店",
    style: {
      color: "#7E5FBD",
      borderColor: "#7E5FBD",
    },
    predicate: product => {
      return product.type === 4 && product.reservation_type === 3;
    }
  },
  {
    label: "同城",
    style: {
      color: "var(--view-theme)",
      borderColor: "var(--view-theme)",
    },
    predicate: product => {
      return product.type === 0 && product.delivery_way.includes("3");
    }
  }
];

// 获取商品标签属性
export const getProductTagList = product => {
  product = JSON.parse(JSON.stringify(product));
  product.delivery_way = product.delivery_way.split(",");
  // delivery_way 1 自提 2 快递配置 3 同城配送
  // type 0 普通 1 虚拟 2 云盘 3 卡密 4 预约
  // reservation_type 3 上门 + 到店 2 上门 1 到店

  return TAG_CONFIG
    .filter(item => item.predicate(product))
    .map(item => ({ style: item.style, label: item.getLabel ? item.getLabel(product) : item.label }));
}