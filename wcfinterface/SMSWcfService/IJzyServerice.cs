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
         /// <summary>
         /// 用于来点弹出
         /// </summary>
         /// <param name="telnum">来电电话号码</param>
         /// <returns>返回用户档案信息</returns>
         [OperationContract]
         [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
         CustomInfo getCustom(string telnum);
         
         [OperationContract]
         [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
         CustomInfo getCustomById(string cardid);

         /// <summary>
         /// 用于查询客户档案
         /// </summary>
         /// <param name="cunit">客户单位名称</param>
         /// <param name="cardnum">客户会员卡号</param>
         /// <param name="jbr">经办人</param>
         /// <returns>客户档案集合</returns>
         [OperationContract]
         [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
         List<CustomInfo> getCustoms(string cunit,string cardnum,string jbr );

         /// <summary>
         /// 商品档案
         /// </summary>
         /// <param name="itemname">商品名称</param>
         /// <param name="price">价格</param>
         /// <param name="rembercode">助记码</param>
         /// <param name="tiaocode">条形码</param>
         /// <returns>商品集合</returns>
         [OperationContract]
         [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
         List<shopItemInfo> getShopItems(string itemname, string price, string rembercode, string tiaocode);

         /// <summary>
         /// 保存新的客户档案
         /// </summary>
         /// <param name="Vip_name"></param>
         /// <param name="Card_id"></param>
         /// <param name="Vip_sex"></param>
         /// <param name="Vip_tel"></param>
         /// <param name="Mobile"></param>
         /// <param name="Company"></param>
         /// <param name="Vip_add"></param>
         /// <returns></returns>
         [OperationContract]
         [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
         boolReturn insertCustom(string Vip_name, string Card_id, string Vip_sex,string Card_type, string Vip_tel, string Mobile, string Company, string Vip_add);
         /// <summary>
         /// 更新客户档案信息
         /// </summary>
         /// <param name="Vip_name"></param>
         /// <param name="Card_id"></param>
         /// <param name="Vip_sex"></param>
         /// <param name="Vip_tel"></param>
         /// <param name="Mobile"></param>
         /// <param name="Company"></param>
         /// <param name="Vip_add"></param>
         /// <returns></returns>
         [OperationContract]
         [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
         boolReturn updateCustom(string Vip_name, string Card_id, string Vip_sex, string Card_type, string Vip_tel, string Mobile, string Company, string Vip_add);
         
         [OperationContract]
         [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
         boolReturn insertCalls(string Unid, string Cid, string Content, int DoState, string DoneSth,string AgentName,string Exten);

         [OperationContract]
         [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
         boolReturn updateCalls(int Id, string Content, int DoState, string DoneSth);

    }
}