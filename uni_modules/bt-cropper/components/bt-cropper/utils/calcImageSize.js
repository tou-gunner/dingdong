// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016-2026 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import ratio from "./ratio.js"
export default function(imageInfo, container = {
	width: 9,
	height: 16
}) {
	const containerRatio = ratio(container.width, container.height)
	const imageRatio = ratio(imageInfo.width, imageInfo.height)
	if (containerRatio > imageRatio) {
		const width = container.height * imageRatio
		const height = container.height
		return {
			width,
			height,
			left: (container.width - width) / 2,
			top: 0,
		}
	} else {
		const width = container.width
		const height = container.width / imageRatio
		return {
			width,
			height,
			left: 0,
			top: (container.height - height) / 2
		}
	}
}
