using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Runtime.Serialization;

namespace SMSWcfService
{
    [DataContract]
    public class TestDataContract
    {
        public TestDataContract(string name) {
            _name = name;
        }
        private string _name;
        [DataMember]
        public string Name
        {
            get {return _name; }
            set {_name = value; }
        }

    }
    /// <summary>
    /// 客户档案
    /// </summary>
    [DataContract]
    public class CustomInfo {
        public CustomInfo() { }
        private string _card_id;//卡号
        [DataMember]
        public string Card_id
        {
            get { return _card_id; }
            set { _card_id = value; }
          
        }
        private string _card_type;//卡类型 t_rm_vip_type typename
        [DataMember]
        public string Card_type
        {
            get { return _card_type; }
            set { _card_type = value; }

        }
        private string _card_name;//卡类型 t_rm_vip_type typename
        [DataMember]
        public string CardName
        {
            get { return _card_name; }
            set { _card_name = value; }

        }

        private string _vip_name;//姓名
        [DataMember]
        public string Vip_name
        {
            get { return _vip_name; }
            set { _vip_name = value; }

        }
        private string _vip_sex;//性别
         [DataMember]
        public string Vip_sex
        {
            get { return _vip_sex; }
            set { _vip_sex = value; }

        }
        
        private string _vip_add;//地址

         [DataMember]
        public string Vip_add
        {
            get { return _vip_add; }
            set { _vip_add = value; }

        }
        private string _vip_tel;//联系电话
         [DataMember]
        public string Vip_tel
        {
            get { return _vip_tel; }
            set { _vip_tel = value; }

        }
        private string _mobile;//联系手机
         [DataMember]
        public string Mobile
        {
            get { return _mobile; }
            set { _mobile = value; }

        }
        private string _discount;//卡折扣
         [DataMember]
        public string Discount
        {
            get { return _discount; }
            set { _discount = value; }

        }
        private string _idcard;//身份证
         [DataMember]
        public string Idcard
        {
            get { return _idcard; }
            set { _idcard = value; }

        }
        private string _company;//企业名称
         [DataMember]
        public string Company
        {
            get { return _company; }
            set { _company = value; }

        }
        private string _email;//邮件
         [DataMember]
        public string Email
        {
            get { return _email; }
            set { _email = value; }

        }
        private string _duty;//职位
         [DataMember]
        public string Duty
        {
            get { return _duty; }
            set { _duty = value; }

        }

        private string _jbr;//职位
         [DataMember]
        public string Jbr
        {
            get { return _jbr; }
            set { _jbr = value; }

        }


    }
    /// <summary>
    /// 商品档案
    /// </summary>
    [DataContract]
    public class shopItemInfo {
        public shopItemInfo() { }
        //货号
        private string _item_no;
        [DataMember]
        public string ItemNo {
            get { return _item_no; }
            set { _item_no = value; }
        }

        //子货号
        private string _item_subno;
        [DataMember]
        public string ItemSubno
        {
            get { return _item_subno; }
            set { _item_subno = value; }
        }

        //商品名称
        private string _item_name;
        [DataMember]
        public string ItemName
        {
            get { return _item_name; }
            set { _item_name = value; }
        }


        //单位
        private string _unit_no;
        [DataMember]
        public string UnitNo
        {
            get { return _unit_no; }
            set { _unit_no = value; }
        }

        //进货价
        private string _price;
        [DataMember]
        public string Price
        {
            get { return _price; }
            set { _price = value; }
        }

        //零售价
        private string _sale_price;
        [DataMember]
        public string SalePrice
        {
            get { return _sale_price; }
            set { _sale_price = value; }
        }

        //零售价
        private string _low_sale_price;
        [DataMember]
        public string LowSalePrice
        {
            get { return _low_sale_price; }
            set { _low_sale_price = value; }
        }

        //允许折扣
        private string _en_dis;
        [DataMember]
        public string EnDis
        {
            get { return _en_dis; }
            set { _en_dis = value; }
        }

        //实时库存
        private string _stors;
        [DataMember]
        public string Stors
        {
            get { return _stors; }
            set { _stors = value; }
        }

        //供应商名称
        private string _supcust_name;
        [DataMember]
        public string SupcustName
        {
            get { return _supcust_name; }
            set { _supcust_name = value; }
        }

        //供应商电话
        private string _supcust_tel;
        [DataMember]
        public string SupcustTel
        {
            get { return _supcust_tel; }
            set { _supcust_tel = value; }
        }

        //助记码
        private string _item_rem;
        [DataMember]
        public string Itemrem
        {
            get { return _item_rem; }
            set { _item_rem = value; }
        }



    }

    [DataContract]
    public class boolReturn {
        public boolReturn() { }
        private string _message;//消息
        [DataMember]
        public string Message
        {
            get { return _message; }
            set { _message = value; }
          
        }
        private int _code;//错误代码
        [DataMember]
        public int Code
        {
            get { return _code; }
            set { _code = value; }

        }
    }
    /// <summary>
    /// 通话记录
    /// </summary>
    [DataContract]
    public class CallRecords {
        public CallRecords() { }
        private int  _id;//记录编号
        [DataMember]
        public int Id
        {
            get { return _id; }
            set { _id = value; }

        }

        private string _unid;//通话编号
        [DataMember]
        public string Unid
        {
            get { return _unid; }
            set { _unid = value; }

        }

        private string _cid;//客户会员卡号
        [DataMember]
        public string Cid
        {
            get { return _cid; }
            set { _cid = value; }

        }

        private string _vipname;//客户姓名
        [DataMember]
        public string Vip_name
        {
            get { return _vipname; }
            set { _vipname = value; }

        }

        private string _content;//通话内容
        [DataMember]
        public string Content
        {
            get { return _content; }
            set { _content = value; }

        }
        private int _dostate;//处理状态
        [DataMember]
        public int DoState
        {
            get { return _dostate; }
            set { _dostate = value; }

        }
        private string _donesth;//处理内容
        [DataMember]
        public string DoneSth
        {
            get { return _donesth; }
            set { _donesth = value; }

        }
        private string _agentname;//服务座席
        [DataMember]
        public string AgentName
        {
            get { return _agentname; }
            set { _agentname = value; }

        }
        private string _exten;//服务分机
        [DataMember]
        public string Exten
        {
            get { return _exten; }
            set { _exten = value; }

        }
        private string _recordtime;//记录时间
        [DataMember]
        public string RecordTime
        {
            get { return _recordtime; }
            set { _recordtime = value; }

        }
        private string _updatetime;//修改时间
        [DataMember]
        public string UpdateTime
        {
            get { return _updatetime; }
            set { _updatetime = value; }

        }

    }

    /// <summary>
    /// 通话记录
    /// </summary>
    [DataContract]
    public class YGous {
        public YGous() { }

        private string _flow_no;//订单编号
        [DataMember]
        public string Flow_no
        {
            get { return _flow_no; }
            set { _flow_no = value; }

        }
        private string _oper_date;//订单编号
        [DataMember]
        public string Oper_date
        {
            get { return _oper_date; }
            set { _oper_date = value; }

        }
        private string _sale_qnty;//订单编号
        [DataMember]
        public string Sale_qnty
        {
            get { return _sale_qnty; }
            set { _sale_qnty = value; }

        }
        private string _sale_money;//订单编号
        [DataMember]
        public string Sale_money
        {
            get { return _sale_money; }
            set { _sale_money = value; }

        }
       
        private string _item_no;//订单编号
        [DataMember]
        public string Item_no
        {
            get { return _item_no; }
            set { _item_no = value; }

        }
        private string _item_name;
        [DataMember]
        public string Item_name
        {
            get { return _item_name; }
            set { _item_name = value; }

        }
        private string _item_rem;
        [DataMember]
        public string Item_rem
        {
            get { return _item_rem; }
            set { _item_rem = value; }

        }

    }

}