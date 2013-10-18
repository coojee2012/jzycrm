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
    public class CunstomInfo {
        public CunstomInfo() { }
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

}