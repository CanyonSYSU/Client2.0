var content_of_evaluate = require("../template/evaluate.js");
var cotent_of_order_page = require("../template/order_page.js");
var content_of_merchant_page = require("../template/merchant.js");
var Util = require('../../utils/util');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper_title : [
      {text: "点菜", id: 1},
      {text: "评价", id: 2},
      {text: "订单", id: 3},
      {text: "商家", id: 3 },
    ],
    currentPage: 0,
    evaluate_tags: content_of_evaluate.templates.evaluate_tag,
    client_evaluate: content_of_evaluate.templates.client_evaluate,
    client_evaluate_index: content_of_evaluate.templates.client_evaluate_index,
    client_evaluate_page_count: content_of_evaluate.templates.client_evaluate_page_count,
    client_evaluate_new: content_of_evaluate.templates.client_evaluate_new,
    categorys: cotent_of_order_page.templates.categorys,
    category_select: cotent_of_order_page.templates.category_select,
    order_menu: cotent_of_order_page.templates.order_menu,
    account_num: cotent_of_order_page.templates.account_num,
    dish_detail: cotent_of_order_page.templates.dish_detail,
    trolley_list: cotent_of_order_page.templates.trolley_list,
    gray_backgroud_hidden: cotent_of_order_page.templates.gray_backgroud_hidden,
    trolley_hidden: cotent_of_order_page.templates.trolley_hidden,
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

    this.order_dish_to_trolley(this.data.category_select, e.currentTarget.dataset.index);

    this.setData(
      {
        order_menu: info,
        account_num: cost
      }
    )
  },
  /*顶部点击跳转*/ 
  swiper_click: function (e) {
    this.setData({
      currentPage: e.currentTarget.dataset.index
    })
  },
  //点击屏幕从购物车页面回到点菜界面
  back_order_page: function (e) {
    if (!this.trolley_hidden) {
      this.setData({
        trolley_hidden: true,
        gray_backgroud_hidden: true
      })
    }
  },

  order_reduce: function (e) {
    var info = this.data.order_menu;
    info[this.data.category_select][e.currentTarget.dataset.index].order_num--;
    var cost = this.data.account_num;
    cost -= info[this.data.category_select][e.currentTarget.dataset.index].price;
    this.reduce_dish_to_trolley(this.data.category_select, e.currentTarget.dataset.index);
    this.setData(
      {
        order_menu: info,
        account_num: cost
      }
    )
  },
  
  detail_order_add: function(e) {
    var info = this.data.dish_detail;
    info.order_num++;
    var cost = this.data.account_num;
    cost += info.price;

    var order_menu_tmp = this.data.order_menu;
    order_menu_tmp[info.category][info.index].order_num++;

    this.order_dish_to_trolley(info.category, info.index);

    this.setData(
      {
        dish_detail: info,
        account_num: cost,
        order_menu: order_menu_tmp
      }
    )
  },

  close_detail : function(e){
    var info = this.data.dish_detail;
    info.hidden = true;
    this.setData(
      {
        dish_detail : info,
        gray_backgroud_hidden: true
      }
    )
  },

  detail_order_reduce: function (e) {
    var info = this.data.dish_detail;
    info.order_num--;
    var cost = this.data.account_num;
    cost -= info.price;

    var order_menu_tmp = this.data.order_menu;
    order_menu_tmp[info.category][info.index].order_num--;

    this.reduce_dish_to_trolley(info.category, info.index);

    this.setData(
      {
        dish_detail: info,
        account_num: cost,
        order_menu: order_menu_tmp
      }
    )
  },
  // 跳转评价
  to_indent_evaluate: function (e) {
    wx.navigateTo({
      url: '../indent_evaluate/indent_evaluate?formId'
    })
  },

  //结算跳转
  to_pay : function (e) {
    this.submit_order()
    if (this.data.account_num > 0) {
      wx.setStorageSync('trolley_list', this.data.trolley_list)
      wx.setStorageSync('account_num', this.data.account_num)
      wx.navigateTo({
        url: '../order_form/order_form'
      })
    }
  },

  order_dish_to_trolley : function (category, index) {
    var order_menu_tmp = this.data.order_menu;
    var trolley_list_tmp = this.data.trolley_list;
    for (let i = 0; i < trolley_list_tmp.length; i ++) {
      if (order_menu_tmp[category][index].name == trolley_list_tmp[i].name) {
        trolley_list_tmp[i].order_num ++;
        this.setData(
          {
            trolley_list: trolley_list_tmp
          }
        )
        return;
      }
    }
    let trolley_item = {
    };
    trolley_item.name = order_menu_tmp[category][index].name;
    trolley_item.price = order_menu_tmp[category][index].price;
    trolley_item.order_num = 1;
    trolley_item.category = category;
    trolley_item.index = index;
    trolley_item.src = order_menu_tmp[category][index].src;
    trolley_list_tmp.push(trolley_item);

    this.setData(
      {
        trolley_list: trolley_list_tmp
      }
    )
  },

  reduce_dish_to_trolley: function (category, index) {
    var order_menu_tmp = this.data.order_menu;
    var trolley_list_tmp = this.data.trolley_list;
    for (let i = 0; i < trolley_list_tmp.length; i++) {
      if (order_menu_tmp[category][index].name == trolley_list_tmp[i].name) {
        trolley_list_tmp[i].order_num--;
        if (trolley_list_tmp[i].order_num == 0) {
          trolley_list_tmp.splice(i, 1);
        }
        this.setData(
          {
            trolley_list: trolley_list_tmp
          }
        )
        return;
      }
    }
  },

  trolley_list_order_add: function (e) {
    var trolley_list_tmp = this.data.trolley_list;
    var info = trolley_list_tmp[e.currentTarget.dataset.index];
    info.order_num++;
    var cost = this.data.account_num;
    cost += info.price;

    var order_menu_tmp = this.data.order_menu;
    order_menu_tmp[info.category][info.index].order_num++;

    this.setData(
      {
        trolley_list: trolley_list_tmp,
        account_num: cost,
        order_menu: order_menu_tmp
      }
    )
  },

  trolley_list_order_reduce: function (e) {
    var trolley_list_tmp = this.data.trolley_list;
    var info = trolley_list_tmp[e.currentTarget.dataset.index];
    info.order_num--;
    if (info.order_num <= 0) {
      trolley_list_tmp.splice(e.currentTarget.dataset.index, 1);
      if (trolley_list_tmp.length == 0) {
        this.trolley_open_close();
      }
    }
    var cost = this.data.account_num;
    cost -= info.price;

    var order_menu_tmp = this.data.order_menu;
    order_menu_tmp[info.category][info.index].order_num--;



    this.setData(
      {
        trolley_list: trolley_list_tmp,
        account_num: cost,
        order_menu: order_menu_tmp
      }
    )
  },

  open_detail_fuc : function (e) {
    var info = this.data.order_menu[this.data.category_select][e.currentTarget.dataset.index];
    var dish_detail_tmp = this.data.dish_detail;
    dish_detail_tmp.hidden = false;
    dish_detail_tmp.img_src = info.src;
    dish_detail_tmp.src = info.src;
    dish_detail_tmp.detail = info.detail;
    dish_detail_tmp.order_num = info.order_num;
    dish_detail_tmp.price = info.price;
    dish_detail_tmp.category = this.data.category_select;
    dish_detail_tmp.index = e.currentTarget.dataset.index;

    this.setData(
      {
        dish_detail: dish_detail_tmp,
        gray_backgroud_hidden : false
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

  trolley_open_close : function () {
    if (this.data.account_num == 0) return;
    let gray_backgroud_hidden_new = !this.data.gray_backgroud_hidden;
    let trolley_hidden_new = !this.data.trolley_hidden;
    this.setData (
      {
        gray_backgroud_hidden: gray_backgroud_hidden_new,
        trolley_hidden: trolley_hidden_new,
      }
    )
    
  },

  clear_trolley : function (e) {
    let order_menu_tmp = this.data.order_menu;
    let trolley_list_tmp = this.data.trolley_list;
    for (let i = 0; i < this.data.trolley_list.length; i ++) {
      order_menu_tmp[trolley_list_tmp[i].category][trolley_list_tmp[i].index].order_num = 0;
    }
     
    this.setData(
      {
        account_num : 0,
        gray_backgroud_hidden : true,
        trolley_hidden : true,
        trolley_list : new Array(),
        order_menu: order_menu_tmp,
      }
    )
  },

  evaluate_scroll_to_lower : function () {
    console.log('get new comment 306')
    this.get_merchant_new_comments()
  },

  onLoad: function (options) {
    this.get_categorys()
    this.get_order_menu()
    this.get_merchant_comment_score();
    this.get_merchant_comment_tags();
    this.get_merchant_comments();
    this.get_merchant_information();
    this.get_indent_list();
  },
  //获取种类
  get_categorys() {
    var that = this;
    wx.request({
      // url: "https://private-ab6e0-canyonsysu1.apiary-mock.com/v1/comments/scores",
      // url: "https://kangblog.top/v1/comments/scores",
      url: "http://192.168.43.147:7070/v1/menufood/categorys",
      success: function (res) {
        console.log(res.data)
        that.setData({
          categorys: res.data
        })
      }
    })
  },
  //获取菜单
  get_order_menu() {
    var that = this;
    wx.request({
      // url: "https://private-ab6e0-canyonsysu1.apiary-mock.com/v1/comments/scores",
      // url: "https://kangblog.top/v1/comments/scores",
      url: "http://192.168.43.147:7070/v1/menufood/tag",
      success: function (res) {
        try {
          for (let i = 0; i < res.data.length; i++) {
            for (let j = 0; j < res.data[i].length; j ++) {
              res.data[i][j].order_num = 0
            }
          }
        } catch (err) {
          console.log(err)
        }
        console.log(res.data)
        that.setData({
          order_menu: res.data
        })
      }
    })
  },
  //获取商家总评分
  get_merchant_comment_score () {
    var that = this;
    wx.request({
       // url: "https://private-ab6e0-canyonsysu1.apiary-mock.com/v1/comments/scores",
      // url: "https://kangblog.top/v1/comments/scores",
      url: "http://192.168.43.147:7070/v1/comments/scores",
      success: function (res) {
        console.log(res.data)
        that.setData({
          merchant_comment_score: res.data
        })
      }
    }) 
  },
  //获取评价标签和数量
  get_merchant_comment_tags() {
    var that = this;
    wx.request({
      // url: "https://private-ab6e0-canyonsysu1.apiary-mock.com/v1/comments/tags",
      // url: "https://kangblog.top/v1/tags?tag=",
      url: "http://192.168.43.147:7070/v1/comment/tags?tag=",
      success: function (res) {
        console.log(res.data)
        that.setData({
          evaluate_tags: res.data
        })
      }
    })
  },
  //获取新评论
  get_merchant_new_comments() {
    var that = this;
    let begin = this.data.client_evaluate.length
    wx.request({
       // url: "https://private-ab6e0-canyonsysu1.apiary-mock.com/v1/comments/tags",
      // url: "https://kangblog.top/v1/tags?tag=",
      url: "http://192.168.43.147:7070/v1/comment/offset?begin=" + begin + "&offset=10",
      success: function (res) {
        console.log(res)
        if (res.data.status === -1) {
          return
        }
        let client_evaluate_tmp = that.data.client_evaluate.concat(res.data);
        that.setData({
          client_evaluate: client_evaluate_tmp
        })
      }
    })
  },
  //获取评论
  get_merchant_comments() {
    var that = this;
    let begin = this.data.client_evaluate.length
    wx.request({
       // url: "https://private-ab6e0-canyonsysu1.apiary-mock.com/v1/comments/tags",
      // url: "https://kangblog.top/v1/tags?tag=",
      url: "http://192.168.43.147:7070/v1/comment/offset?begin=" + '0' + "&offset=10",
      success: function (res) {
        console.log(res)
        if (res.data.status === -1) {
          return
        }
        let client_evaluate_tmp = that.data.client_evaluate.concat(res.data);
        that.setData({
          client_evaluate: client_evaluate_tmp
        })
      }
    })
  },
  // 获取订单
  get_indent_list() {
    var that = this;
    let begin = this.data.client_evaluate.length
    wx.request({
      url: "http://192.168.43.147:7070/v1/orderphone?phone=" + app.globalData.openId,
      success: function (res) {
        console.log(res)
        if (res.data.status === -1) {
          return
        }
        that.setData({
          indent_list: res.data
        })
      }
    })
  },
  //获取商家信息
  get_merchant_information() {
    var that = this;
    wx.request({
      //url: "https://private-ab6e0-canyonsysu1.apiary-mock.com/v1/resturants/name",
      // url: "https://private-ab6e0-canyonsysu1.apiary-mock.com/v1/resturants/name",
      url: "http://192.168.43.147:7070/v1/restaurants?name",
      success: function (res) {
        console.log(res.data)
        that.setData({
          merchant_information: res.data[0]
        })
      }
    })
  },
  // 提交订单
  submit_order() {
    let that = this;
    console.log(this.data.trolley_list)
    wx.request({
      url: "http://192.168.43.147:7070/v1/orders",
      header: {
        // "Content-Type": "application/x-www-form-urlencoded"
        "Content-Type": "application/json"
      },
      method: "POST",
      /*data: Util.json2Form({ 
        "table_id": 1,
        "order_num": that.data.trolley_list.length,
        "total": that.data.account_num,
        "order_contain": that.data.trolley_list,
        "openId": app.globalData.openId,
        "order_time": Util.formatTime(new Date())
       }),*/
      data: {
        "table_id": 1,
        "order_num": that.data.trolley_list.length,
        "total": that.data.account_num,
        "order_contain": that.data.trolley_list,
        "openId": app.globalData.openId,
        "order_time": Util.formatTime(new Date())
      },
      success: function (res) {
        that.clear_trolley()
        that.setData({
        });
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //this.evaluate_IntersectionObserver();
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