var content_of_evaluate = require("../template/evaluate.js");
var cotent_of_order_page = require("../template/order_page.js");
var content_of_merchant_page = require("../template/merchant.js");
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
    trolley_hidden: cotent_of_order_page.templates.trolley_hidden
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
    order_menu_tmp[info.category_select][info.index].order_num++;

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
    order_menu_tmp[info.category_select][info.index].order_num--;

    this.setData(
      {
        dish_detail: info,
        account_num: cost,
        order_menu: order_menu_tmp
      }
    )
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
    dish_detail_tmp.category_select = this.data.category_select;
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
    let client_evaluate_tmp = this.data.client_evaluate.concat(this.data.client_evaluate_new);
    this.setData(
      {
        client_evaluate: client_evaluate_tmp
      }
    )

  },

  onLoad: function (options) {
    
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