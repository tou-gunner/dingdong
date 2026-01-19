import dayjs from "@/plugin/dayjs/dayjs.min.js";

// 生成可配送时间段范围
export function generateTimeList(isToday, startTime, endTime) {
	// 当前时间实例
	const nowDate = dayjs();

	// 营业时间开始日期
	let startDate = nowDate.hour(startTime[0]).minute(startTime[1]).second(0);

	// 营业时间结束日期
	const endDate = nowDate.hour(endTime[0]).minute(endTime[1]).second(0);

	if (isToday) {
		if (nowDate.isAfter(startDate)) {
			// 如果当前时间已经超过开始时间，则重置开始时间为当前时间的下一个配送时间段
			if (nowDate.minute() < 30) {
				startDate = nowDate.minute(30).second(0);
			} else {
				startDate = nowDate.hour(nowDate.hour() + 1).minute(0).second(0);
			}
		}
	}

	const timeRange = [];

	// 时间范围是否在营业时间范围内
	let timeIsInRange = startDate.isBefore(endDate);


	while (timeIsInRange) {
		// 时间范围开始时间
		const timeRangeStart = startDate.format("HH:mm");
		
		const startMinute = startDate.minute();

		if (startMinute !== 0 || startMinute !== 30) {
			// 如果开始时间不是整点或30分，则需要调整时间范围
			if (startMinute < 30) {
				startDate = startDate.minute(0);
			} else {
				startDate = startDate.minute(30);
			}
		}

		// 递增 30 分钟，获取时间范围结束时间
		startDate = startDate.add(30, "minute");

		let timeRangeEnd = startDate.format("HH:mm");

		if (startDate.isSame(endDate)) {
			// 如果时间范围中开始时间等于结束时间，则结束循环
			timeIsInRange = false;
		} else if (startDate.isAfter(endDate)) {
			// 如果大于结束时间，则结束循环，并将结束时间作为时间范围结束时间
			timeIsInRange = false;
			timeRangeEnd = endDate.format("HH:mm");
		}

		timeRange.push(`${timeRangeStart}-${timeRangeEnd}`);
	}


	return timeRange;
}

export function initDeliveryTime(
	actIndex,
	actStationIndex,
	deliverySettings,
	deliveryStationList,
	deliveryTimeData
) {
	// 设置此门店的此提货点支持的配送天数
	const dayNumber = deliverySettings[actIndex].deliverySettings.selectable_days
	// 设置配送选项数据
	const timeData = {
		leftIndex: deliveryTimeData[actIndex].actDayIndex,
		rightIndex: deliveryTimeData[actIndex].actTimeIndex,
		timeText: deliveryTimeData[actIndex].deliveryTimeText
	}
	// 设置此提货点的开始与结束时间
	const startTimeStr = deliveryStationList[actIndex][actStationIndex[actIndex]].business_time_start;
	const endTimeStr = deliveryStationList[actIndex][actStationIndex[actIndex]].business_time_end;

	// 获取此提货点支持的周内星期数， number[]
	const deliveryDays = deliveryStationList[actIndex][actStationIndex[actIndex]].business_date;
	if (!!(startTimeStr && endTimeStr)) {
		var startTime = startTimeStr.split(':').map(item => {
			return Number(item)
		})
		var endTime = endTimeStr.split(':').map(item => {
			return Number(item)
		})
	}
	// 计算每天的日期以及星期
	const dayListData = dayList()
	// 计算时间段
	
	const isToday = dayListData.length && dayListData[0].date === dayjs().format('YYYY-MM-DD');
	const timeListData = generateTimeList(isToday, startTime, endTime)
	const timeStr = dayListData[0].text + ' ' + timeListData[0]
	// 设置同城配送的时间数据

	const data = {
		date: dayListData[timeData.leftIndex].date,
		week: dayListData[timeData.leftIndex].text.slice(-3, -1),
		time: timeListData[timeData.rightIndex]
	}
	return [timeStr, data, dayListData, timeListData]
	// 计算每天的日期以及星期
	function dayList() {
		const list = [];
		let date = dayjs();
		const endDate = date.hour(endTime[0]).minute(endTime[1]).second(0);

		let nextDeliveryTime = null;

		if (date.minute() >= 30) {
			// 如果当前时间在 30 分钟以后，则配送时间为下一个小时
			nextDeliveryTime = date.hour(date.hour() + 1).minute(0).second(0);
		} else {
			// 如果当前时间在 30 分钟以前，则配送时间为当前小时
			nextDeliveryTime = date.hour(date.hour()).minute(30).second(0);
		}

		// 今天是否还可以配送
		const currentDayAllowDelivery = nextDeliveryTime.isBefore(endDate);

		const weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
		for (var i = 0; i < dayNumber; i++) {
			const dayNum = date.day() === 0 ? 7 : date.day();
			// 获取当前日期是星期几
			// 周一 ~ 周日 对应的索引为 1 ~ 7
			if (deliveryDays.includes(dayNum)) {
				if (i == 0) {
					if (currentDayAllowDelivery) {
						list.push({
							text: `今天(${weeks[date.day()]})`,
							date: date.format('YYYY-MM-DD')
						})
					}
				} else if (i == 1) {
					list.push({
						text: `明天(${weeks[date.day()]})`,
						date: date.format('YYYY-MM-DD')
					})
				} else {
					list.push({
						text: date.format(`MM月DD日`),
						date: date.format('YYYY-MM-DD')
					})
				}
			}
			date = date.add(1, 'day');
		}
		return list
	}
}
