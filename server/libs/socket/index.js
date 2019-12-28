const handlesBuilder = require('./handles')

module.exports = config => {
  const io = require('socket.io')(config.port)

  io.on('connection', socket => {
    const handles = handlesBuilder(socket)
    
    // 考生进入考试，开始倒计时
    socket.on('examStart', handles.examStart)
  })
}