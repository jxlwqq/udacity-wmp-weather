const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

Page({

  /**
   * 页面的初始数据
   */
  data: {
    now: {},
    forecast: [],
    today: {},
    locationCity: '北京市',
    locationAuthType: UNPROMPTED,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.qqmapsdk = new QQMapWX({
      key: '3UHBZ-Y7AR6-Z75SA-MJCV7-FPMHS-O2BAQ'
    })

    wx.getSetting({
      success: res => {
        let auth = res.authSetting['scope.userLocation']
        this.setData({
          locationAuthType: auth ? AUTHORIZED : (auth===false) ? UNAUTHORIZED : UNPROMPTED,
        })
        if (auth) {
          this.getLocationCity()
        }
      }
    })
    this.getNowWeather()
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getNowWeather(wx.stopPullDownRefresh)
  },

  onTapDayWeather: function() {
    wx.navigateTo({
      url: '/pages/list/list?city=上海市',
    })
  },

  onTapLocation: function() {
    this.getLocationCity()
  },

  getNowWeather(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '上海市'
      },
      success: res => {
        let result = res.data.result
        let weather = result.now.weather

        this.setNow(result)

        this.setForecast(result)

        this.setToday(result)

        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather]
        })
      },

      complete: () => {
        callback && callback()
      }
    })
  },

  getLocationCity() {
      wx.getLocation({
        success: res => {
          this.qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: res => {
              this.setData({
                locationCity: res.result.address_component.city,
                locationAuthType: AUTHORIZED,
              })
            }
          })
        },
        fail: res => {
          this.setData({
            locationAuthType: UNAUTHORIZED,
          })
        }
      })
  },

  setNow(result) {
    let temp = result.now.temp
    let weather = result.now.weather
    this.setData({
      now: {
        temp: result.now.temp,
        weather: weatherMap[weather],
        bg: '/images/' + weather + '-bg.png'
      }
    })
  },

  setForecast(result) {
    let forecast = []
    let nowHour = new Date().getHours()
    result.forecast.forEach(function(item, key) {
      forecast.push({
        time: key == 0 ? '现在' : ((item.id) * 3 + nowHour) % 24 + ' 时',
        icon: '/images/' + item.weather + '-icon.png',
        temp: item.temp
      })
    })
    this.setData({
      forecast: forecast
    })
  },

  setToday(result) {
    let date = new Date()
    let todayDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 今天'
    this.setData({
      today: {
        maxTemp: result.today.maxTemp,
        minTemp: result.today.minTemp,
        date: todayDate
      }
    })
  }
})