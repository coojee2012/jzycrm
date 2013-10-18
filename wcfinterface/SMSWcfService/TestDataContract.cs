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
        private int _card_id;//卡号
        [DataMember]
        public int Card_id
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
        private string _vip_name;//姓名
        [DataMember]
        public string Vip_name
        {
            get { return _vip_name; }
            set { _vip_name = value; }

        }
        private int _vip_sex;//性别
        public int Vip_sex
        {
            get { return _vip_sex; }
            set { _vip_sex = value; }

        }
        private string _vip_add;//地址
        public string Vip_add
        {
            get { return _vip_add; }
            set { _vip_add = value; }

        }
        private string _vip_tel;//联系电话
        public string Vip_tel
        {
            get { return _vip_tel; }
            set { _vip_tel = value; }

        }
        private string _discount;//卡折扣
        public string Discount
        {
            get { return _discount; }
            set { _discount = value; }

        }
        private string _idcard;//身份证
        public string Idcard
        {
            get { return _idcard; }
            set { _idcard = value; }

        }
        private string _company;//企业名称
        public string Company
        {
            get { return _company; }
            set { _company = value; }

        }
        private string _email;//邮件
        public string Email
        {
            get { return _email; }
            set { _email = value; }

        }
        private string _duty;//职位
        public string Duty
        {
            get { return _duty; }
            set { _duty = value; }

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
        private decimal _price;
        [DataMember]
        public decimal Price
        {
            get { return _price; }
            set { _price = value; }
        }

        //零售价
        private decimal _sale_price;
        [DataMember]
        public decimal SalePrice
        {
            get { return _sale_price; }
            set { _sale_price = value; }
        }

        //零售价
        private decimal _low_sale_price;
        [DataMember]
        public decimal LowSalePrice
        {
            get { return _low_sale_price; }
            set { _low_sale_price = value; }
        }

        //允许折扣
        private int _en_dis;
        [DataMember]
        public int EnDis
        {
            get { return _en_dis; }
            set { _en_dis = value; }
        }

        //实时库存
        private int _stors;
        [DataMember]
        public int Stors
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


    }
}