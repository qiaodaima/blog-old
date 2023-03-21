// 比如今天是 2020年09月13日 23:50:00 时间戳为 Date.parse(new Date(`2020-09-13 23:50:00`))  1600012200000
// 需要展示的时间是 2020年09月14日 01:00:00 时间戳为 Date.parse(new Date(`2020-09-14 01:00:00`))  1600016400000

const today = new Date(1600012200000); // 2020-09-13 23:50:00 单位毫秒
const handleDay = new Date(1600016400000); // 2020-09-14 01:00:00 单位毫秒

// 获取0点时刻
const todayBeginTime = new Date(
    `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
);

// 获取0点时刻
const handleDayBeginTime = new Date(
    `${handleDay.getFullYear()}-${handleDay.getMonth() +
        1}-${handleDay.getDate()}`,
);
const diff = handleDayBeginTime.getTime() - todayBeginTime.getTime();

console.log(diff / (24 * 60 * 60 * 1000)); // 可以看到结果是1   -2前天  -1昨天  0今天  1明天 2后天
