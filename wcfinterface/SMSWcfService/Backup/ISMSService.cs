using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;



namespace SMSWcfService
{
    // 注意: 使用“重构”菜单上的“重命名”命令，可以同时更改代码和配置文件中的接口名“IService1”。
    [ServiceContract]
    public interface ISMSService
    {

        [OperationContract]
        string SendSMS(string phone, string msg);

        // [OperationContract]
        // CompositeType GetDataUsingDataContract(CompositeType composite);

        // TODO: 在此添加您的服务操作

        [OperationContract]
        string GetCustomerIP();

        /// <summary>
        /// GetJsonResult
        /// </summary>
        /// <param name="name"></param>
        /// <param name="address"></param>
        /// <param name="phone"></param>
        /// <remarks>
        /// 为实现Json序列化，添加属性
        /// [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        /// </remarks>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        JsonResult GetJsonResult(string name, string address, string phone);

        [OperationContract]
        [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        List<JsonResult> GetJsons(string name, string address, string phone);

        [OperationContract]
        TestDataContract test(string name);
        [OperationContract]
        [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        List<T> GetList<T>(string querystring);
    }




    // 使用下面示例中说明的数据约定将复合类型添加到服务操作。
    [DataContract]
    public class CompositeType
    {
        bool boolValue = true;
        string stringValue = "Hello ";

        [DataMember]
        public bool BoolValue
        {
            get { return boolValue; }
            set { boolValue = value; }
        }

        [DataMember]
        public string StringValue
        {
            get { return stringValue; }
            set { stringValue = value; }
        }
    }

    [DataContract]
    public class JsonResult
    {
        /// <summary>
        /// Construct
        /// </summary>
        public JsonResult(string name, string address, string phone)
        {
            _name = string.Format("{0}", name);
            _address = string.Format("{0}", address);
            _phoneNumber = string.Format("{0}", phone);
        }

        private string _name;
        /// <summary>
        /// Name
        /// </summary>
        [DataMember]
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }
        private string _address;
        /// <summary>
        /// Address
        /// </summary>
        [DataMember]
        public string Address
        {
            get { return _address; }
            set { _address = value; }
        }
        private string _phoneNumber;
        /// <summary>
        /// PhoneNumber
        /// </summary>
        [DataMember]
        public string PhoneNumber
        {
            get { return _phoneNumber; }
            set { _phoneNumber = value; }
        }
    }

    [DataContract]
    public class JsonResults {
        public JsonResults(List<JsonResult> jsons) {
            _jsons = jsons;
        }
        private List<JsonResult> _jsons;
        /// <summary>
        /// Name
        /// </summary>
        [DataMember]
        public List<JsonResult> Jsons
        {
            get { return _jsons; }
            set { _jsons = value; }
        }
    }
}
