var content_of_evaluate = require("../template/evaluate.js");
var cotent_of_order_page = require("../template/order_page.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper_title : [
      {text: "点菜", id: 1},
      {text: "评价", id: 2},
      {text: "商家", id: 3},
    ],
    currentPage: 0,
    howMuch: 12,
    cost: 0,
    pullBar: false
  },

  turnTitle: function (e) {
    if (e.detail.source == "touch") {
      this.setData({
        currentPage: e.detail.current
      })
    }
  },

  order_add: function(e) {
    var info = this.data.order_menu;
    info[this.data.category_select][e.currentTarget.dataset.index].order_num++;
    var cost = this.data.account_num;
    cost += info[this.data.category_select][e.currentTarget.dataset.index].price;
    this.setData(
      {
        order_menu: info,
        account_num: cost
      }
    )
  },

  order_reduce: function (e) {
    var info = this.data.order_menu;
    info[this.data.category_select][e.currentTarget.dataset.index].order_num--;
    var cost = this.data.account_num;
    cost -= info[this.data.category_select][e.currentTarget.dataset.index].price;
    this.setData(
      {
        order_menu: info,
        account_num: cost
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  categoryTap: function (e) {
    var that = this;
    that.setData(
      {
        category_select: e.currentTarget.dataset.index,
      }
    )
  },

  onLoad: function (options) {
    this.setData({
      evaluate_tags: content_of_evaluate.templates.evaluate_tag,
      client_evaluate: content_of_evaluate.templates.client_evaluate,
      categorys: cotent_of_order_page.templates.categorys,
      category_select: cotent_of_order_page.templates.category_select,
      order_menu: cotent_of_order_page.templates.order_menu,
      account_num: cotent_of_order_page.templates.account_num
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})