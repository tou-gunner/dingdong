// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016-2026 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import calcRightAndBottom from "./calcRightAndBottom"
const defaultPosition = {
	left: 0,
	top: 0,
	width: 0,
	height: 0
}
const defaultTransfrom = {
	imgTranslateX: 0,
	imgTranslateY: 0,
	imgScale: 1
}
// 先默认变换原点在中间
export default function(imagePosition = defaultPosition, transfrom = defaultTransfrom) {
	const width = imagePosition.width * transfrom.imgScale
	const height = imagePosition.height * transfrom.imgScale
	return calcRightAndBottom({
		left: (imagePosition.left + transfrom.imgTranslateX) - (width - imagePosition.width) / 2,
		top: (imagePosition.top + transfrom.imgTranslateY) - (height - imagePosition.height) / 2,
		width,
		height
	})
}
