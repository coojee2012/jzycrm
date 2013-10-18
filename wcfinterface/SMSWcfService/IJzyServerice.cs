using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace SMSWcfService
{
     [ServiceContract]
    public interface IJzyService
    {
         [OperationContract]
         [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
         CunstomInfo getCustom(string telnum);

    }
}