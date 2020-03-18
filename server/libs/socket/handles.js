const TIME = {
  MINS_05 : 5 * 60 * 1000,  // 5分钟
  MINS_15 : 15 * 60 * 1000,  // 15分钟
  MINS_30 : 30 * 60 * 1000,  // 30分钟
  MINS_45 : 45 * 60 * 1000,  // 45分钟
  MINS_60 : 60 * 60 * 1000,  // 60分钟
}

module.exports = socket => {
  return {
    examStart: (msg) => {
      // 没有获取到考试的总时长
      if(!msg || !msg.delay){
        socket.emit('joinFail', { msg: 'attr delay or obj msg not found' });
        return;
      }
      const delay = + msg.delay  // +转换为数字类型
      // 考试时长大于等于15分钟，考试结束前5分钟发送提醒事件
      if (delay >= TIME.MINS_15) {
        setTimeout(() => {
          socket.emit('prompt', { data: { countdown: TIME.MINS_05 } })
        }, delay - TIME.MINS_05)
      }

      // 考试时长大于等于30分钟，考试结束前15分钟发送提醒事件
      if (delay >= TIME.MINS_30) {
        setTimeout(() => {
          socket.emit('prompt', { data: { countdown: TIME.MINS_15 } })
        }, delay - TIME.MINS_15)
      }

      setTimeout(() => {
        socket.emit('examEnd', {})
      }, delay)
    }
  }
}