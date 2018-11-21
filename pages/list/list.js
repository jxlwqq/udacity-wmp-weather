// pages/list/list.js


const dayMap = {
  0: '星期日',
  1: '星期一', 2: '星期二', 3: '星期三', 4: '星期四', 5: '星期五', 6: '星期六',
}

function getDateStr(AddDayCount) {
  let date = new Date();
  date.setDate(date.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var year = date.getFullYear();
  let month = date.getMonth() + 1; //获取当前月份的日期
  var day = date.getDate();
  return year + "-" + month + "-" + day;
}

Page({


  /**
   * 页面的初始数据
   */
  data: {
    locationCity: '北京市',
    futureWeather: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')

    this.setData({
      locationCity: options.city
    })
    this.getFutureWeather()
  },

  onShow: function() {
    console.log('onShow')

  },

  onReady: function () {
    console.log('onReady')

  },

  onHide: function () {
    console.log('onHide')

  },

  onUnload: function () {
    console.log('onUnload')

  },



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getFutureWeather(wx.stopPullDownRefresh)
  },

  getFutureWeather: function(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data: {
        city: this.data.locationCity,
        time: new Date().getTime()
      },
      success: res => {
        let result = res.data.result
        let futureWeather = []
        result.forEach(function (item, key) {
          let date = new Date();
          date.setDate(date.getDate() + key)
          console.log(date.getDay())
          futureWeather.push({ date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(), day: key == 0 ? '今天' : dayMap[date.getDay()], temp: item.minTemp + '° - ' + item.maxTemp + '°', icon: '/images/' + item.weather + '-icon.png' })
        })
        this.setData({
          futureWeather: futureWeather
        })
      },

      complete: () => {
        callback && callback()
      }
    })
  }
})