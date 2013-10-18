using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.ServiceModel.Channels;

namespace SMSWcfService
{
    public class JsonContentTypeMapper:WebContentTypeMapper
    {
         /// <summary>
     /// JsonContentTypeMapper
     /// 用在配置中<webMessageEncoding webContentTypeMapperType="Microsoft.Ajax.Samples.JsonContentTypeMapper, JsonContentTypeMapper, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null">
     /// </summary>
 
         public override WebContentFormat GetMessageFormatForContentType(string contentType)
         {
             if (contentType == "text/javascript")
             {
                 return WebContentFormat.Json;
             }
             else
             {
                 return WebContentFormat.Default;
             }
         }

    }
}