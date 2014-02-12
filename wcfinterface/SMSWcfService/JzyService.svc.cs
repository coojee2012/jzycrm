using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

using System.Data;
using System.Data.SqlClient;

using System.IO;

using System.ServiceModel.Channels;

using System.Reflection;
namespace SMSWcfService
{
    // 注意: 使用“重构”菜单上的“重命名”命令，可以同时更改代码、svc 和配置文件中的类名“IJzyService”。
    public class JzyService : IJzyService
    {

        #region 数据库连接相应的类和对象定义
        /// <summary>
        /// 私有域 用与 TheSqlDataAdapterSelectext 属性
        /// </summary>
        private String sqlText;//
        /// <summary>
        /// 私有域 用于事务处理
        /// </summary>
        private SqlTransaction SqlTrans;
        /// <summary>
        /// 数据库执行对象  域
        /// </summary>
        protected System.Data.SqlClient.SqlCommand sqlCommand;//
        /// <summary>
        /// 数据库连接对象  域
        /// </summary>
        public System.Data.SqlClient.SqlConnection sqlConnection;//
        /// <summary>
        /// 数据库连接字符串 域
        /// </summary>
        private String connectionString;//
        /// <summary>
        /// 数据适配器 
        /// </summary>
        protected System.Data.SqlClient.SqlDataAdapter sqlDataAdapter;//
        /// <summary>
        /// 数据集
        /// </summary>
        protected System.Data.DataSet dataSet;//
        #endregion

        public CustomInfo getCustom(string tel) {
            CustomInfo cinfo = new CustomInfo();
            if (string.IsNullOrEmpty(tel))
                return cinfo;
            string sql = "select a.card_id,a.card_type,b.type_name,b.discount,a.vip_name,a.vip_sex,a.oper_id,c.oper_name,a.social_id,a.vip_add,a.vip_email,a.vip_tel,a.company,a.duty,a.mobile from t_rm_vip_info a ";
            sql += " left join t_rm_vip_type b on b.type_id=a.card_type ";
            sql += " left join t_sys_operator c on a.oper_id = c.oper_id where 1=1  ";
            sql += " and a.vip_tel='"+tel+"' or a.mobile='"+tel+"'";
            DataTable dt = Query(sql);

            if (dt == null)
                return cinfo;

            
            foreach (DataRow row in dt.Rows)
            {
                cinfo.Vip_name = row["vip_name"].ToString() ;
                cinfo.Vip_sex = row["vip_sex"].ToString();
                cinfo.Vip_tel = row["vip_tel"].ToString();
                cinfo.Mobile = row["mobile"].ToString();
                cinfo.Card_id = row["card_id"].ToString();
                cinfo.Card_type = row["card_type"].ToString();
                cinfo.CardName = row["type_name"].ToString();
                cinfo.Company = row["company"].ToString();
                cinfo.Discount = row["discount"].ToString();
                cinfo.Duty = row["duty"].ToString();
                cinfo.Email = row["vip_email"].ToString();                             
                cinfo.Vip_add = row["vip_add"].ToString();
                cinfo.Idcard = "";
                cinfo.Jbr = row["social_id"].ToString();
            
            }
            return cinfo;
        }

        public CustomInfo getCustomById(string cardid)
        {
            CustomInfo cinfo = new CustomInfo();
            if (string.IsNullOrEmpty(cardid))
                return cinfo;
            string sql = "select a.card_id,a.card_type,b.type_name,b.discount,a.vip_name,a.vip_sex,a.oper_id,c.oper_name,a.social_id,a.vip_add,a.vip_email,a.vip_tel,a.company,a.duty,a.mobile from t_rm_vip_info a ";
            sql += " left join t_rm_vip_type b on b.type_id=a.card_type ";
            sql += " left join t_sys_operator c on a.oper_id = c.oper_id where 1=1  ";
            sql += " and a.card_id='"+cardid+"'";
            DataTable dt = Query(sql);
            if (dt == null)
                return cinfo;
            foreach (DataRow row in dt.Rows)
            {
                cinfo.Vip_name = row["vip_name"].ToString() ;
                cinfo.Vip_sex = row["vip_sex"].ToString();
                cinfo.Vip_tel = row["vip_tel"].ToString();
                cinfo.Mobile = row["mobile"].ToString();
                cinfo.Card_id = row["card_id"].ToString();
                cinfo.Card_type = row["card_type"].ToString();
                cinfo.CardName = row["type_name"].ToString();
                cinfo.Company = row["company"].ToString();
                cinfo.Discount = row["discount"].ToString();
                cinfo.Duty = row["duty"].ToString();
                cinfo.Email = row["vip_email"].ToString();                             
                cinfo.Vip_add = row["vip_add"].ToString();
                cinfo.Idcard = "";
                cinfo.Jbr = row["social_id"].ToString();
            
            }
            return cinfo; 
        }

        public List<CustomInfo> getCustoms(string cunit, string cardnum, string jbr) {
            List<CustomInfo> customs = new List<CustomInfo>();
            string sql =  "select top 10  a.card_id,a.card_type,b.type_name,b.discount,a.vip_name,a.vip_sex,a.oper_id,c.oper_name,a.social_id,a.vip_add,a.vip_email,a.vip_tel,a.company,a.duty,a.mobile from t_rm_vip_info a ";
                   sql += " left join t_rm_vip_type b on b.type_id=a.card_type ";
                   sql += " left join t_sys_operator c on a.oper_id = c.oper_id where 1=1  ";
            if (!string.IsNullOrEmpty(cunit)) {
                sql += " and a.vip_name like '%" + SafePramas(cunit) + "%' ";
            }
            if (!string.IsNullOrEmpty(cardnum))
            {
                sql += " and a.card_id like '%" + SafePramas(cardnum) + "%' ";
            }
            if (!string.IsNullOrEmpty(jbr))
            {
                sql += " and a.social_id like '%" + SafePramas(jbr) + "%' ";
            }
            DataTable dt = Query(sql);
            if (dt != null)
            {
                foreach (DataRow row in dt.Rows)
                {
                    CustomInfo cinfo = new CustomInfo();
                    cinfo.Vip_name = row["vip_name"].ToString();
                    cinfo.Vip_sex = row["vip_sex"].ToString();
                    cinfo.Vip_tel = row["vip_tel"].ToString();
                    cinfo.Mobile = row["mobile"].ToString();
                    cinfo.Card_id = row["card_id"].ToString();
                    cinfo.Card_type = row["card_type"].ToString();
                    cinfo.CardName = row["type_name"].ToString();
                    cinfo.Company = row["company"].ToString();
                    cinfo.Discount = row["discount"].ToString();
                    cinfo.Duty = row["duty"].ToString();
                    cinfo.Email = row["vip_email"].ToString();
                    cinfo.Vip_add = row["vip_add"].ToString();
                    cinfo.Idcard = "";
                    cinfo.Jbr = row["social_id"].ToString();
                    customs.Add(cinfo);

                }
            }
            return customs;
        }

        public List<shopItemInfo> getShopItems(string itemname, string price, string rembercode, string tiaocode)
        {
            List<shopItemInfo> shopitems = new List<shopItemInfo>();
            string sql  = "select top 10 a.item_no,a.item_subno, a.item_name,a.item_subname,a.item_clsno,b.item_clsname,a.unit_no,a.price,a.sale_price,a.en_dis,a.change_price,a.main_supcust,a.item_rem,c.stock_qty from t_bd_item_info a";
                   sql += " left join t_bd_item_cls b  on a.item_clsno = b.item_clsno";//获取商品类别
                   sql += " left join t_im_branch_stock c on c.item_no = a.item_no where 1=1 ";//获取库存
                   if (!string.IsNullOrEmpty(itemname)) {
                       sql += " and a.item_name like '%" + SafePramas(itemname) + "%'";                   
                   }
                   if (!string.IsNullOrEmpty(price))
                   {
                       sql += " and a.price like '%" + SafePramas(price) + "%'";
                   }
                   if (!string.IsNullOrEmpty(rembercode))
                   {
                       sql += " and a.item_rem like '%" + SafePramas(rembercode) + "%'";
                   }
             DataTable dt = Query(sql);
             if (dt != null)
             {
                 foreach (DataRow row in dt.Rows)
                 {
                     shopItemInfo shopitem = new shopItemInfo();
                     shopitem.ItemName = row["item_name"].ToString();
                     shopitem.ItemNo = row["item_no"].ToString();
                     shopitem.ItemSubno = row["item_subno"].ToString();
                     shopitem.Price = row["price"].ToString();
                     shopitem.SalePrice = row["sale_price"].ToString();

                     shopitem.Stors = row["stock_qty"].ToString();
                     shopitem.SupcustName = "";
                     shopitem.SupcustTel = "";
                     shopitem.UnitNo = row["unit_no"].ToString();
                     shopitem.EnDis = row["en_dis"].ToString() == "1" ? "是" : "否";
                     shopitem.Itemrem = row["item_rem"].ToString();
                     shopitems.Add(shopitem);

                 }
             }

            return shopitems;
        
        }
        /// <summary>
        /// 查询通话记录列表
        /// </summary>
        /// <param name="keywords"></param>
        /// <param name="dostate"></param>
        /// <param name="timefrom"></param>
        /// <param name="timeto"></param>
        /// <returns></returns>
        public List<CallRecords> getCalls(string keywords ,string card_id, string dostate,string timefrom,string timeto) {
            List<CallRecords> calls = new List<CallRecords>();
            string sql = "select top 10 a.*,b.vip_name,b.social_id from callrecords a left join t_rm_vip_info b on b.card_id = a.cid where 1=1 ";
            if (!string.IsNullOrEmpty(card_id)) {
                sql += " and a.cid = '" + card_id + "'";
            }
            if (!string.IsNullOrEmpty(keywords)) {
                sql += " and (a.content like '%" + keywords + "%' or a.donesth like '%" + keywords + "%'";
                if(string.IsNullOrEmpty(card_id)){
                    sql += " or b.vip_name like '%" + keywords + "%'";
                }
                sql += ")";
            }
            if (!string.IsNullOrEmpty(dostate) && (dostate == "0" || dostate == "1" || dostate == "2"))
            {
                sql += " and a.dostate = " + dostate;
            }
            if (!string.IsNullOrEmpty(timefrom)) {
                sql += " and a.recordtime > '" + timefrom+"'";
            }
            if (!string.IsNullOrEmpty(timeto))
            {
                sql += " and a.recordtime < '" + timeto + "'";
            }
            sql += " order by a.recordtime desc ";

            DataTable dt = Query(sql);
            if (dt != null)
            {
                foreach (DataRow row in dt.Rows)
                {
                    CallRecords callinfo = new CallRecords();
                    callinfo.Id = int.Parse(row["id"].ToString());
                    callinfo.Unid = row["unid"].ToString();
                    callinfo.Cid = row["cid"].ToString();
                    callinfo.Phone = row["phone"].ToString();
                    callinfo.Vip_name = row["vip_name"].ToString();
                    callinfo.Jbr = row["social_id"].ToString();
                    callinfo.Content = row["content"].ToString();
                    callinfo.DoState = int.Parse(row["dostate"].ToString());
                    callinfo.DoneSth = row["donesth"].ToString();
                    callinfo.AgentName = row["agentname"].ToString();
                    callinfo.Exten = row["exten"].ToString();
                    callinfo.RecordTime = row["recordtime"].ToString();
                    callinfo.UpdateTime = row["updatetime"].ToString();

                    calls.Add(callinfo);

                }
            }

            return calls;

        }
        public CallRecords findCalls(int id) {
            CallRecords callinfo = new CallRecords();
            string sql = "select a.*,b.vip_name from callrecords a left join t_rm_vip_info b on b.card_id = a.cid where 1=1 ";


            sql += " and a.id = " + id.ToString() + "";
            
          

            DataTable dt = Query(sql);
            if (dt != null)
            {
                foreach (DataRow row in dt.Rows)
                {
                    
                    callinfo.Id = int.Parse(row["id"].ToString());
                    callinfo.Unid = row["unid"].ToString();
                    callinfo.Cid = row["cid"].ToString();
                    callinfo.Phone = row["phone"].ToString();
                    callinfo.Vip_name = row["vip_name"].ToString();
                    callinfo.Content = row["content"].ToString();
                    callinfo.DoState = int.Parse(row["dostate"].ToString());
                    callinfo.DoneSth = row["donesth"].ToString();
                    callinfo.AgentName = row["agentname"].ToString();
                    callinfo.Exten = row["exten"].ToString();
                    callinfo.RecordTime = row["recordtime"].ToString();
                    callinfo.UpdateTime = row["updatetime"].ToString();
                  

                   

                }
            }
            return callinfo;
        }
        //更新客户档案信息
        public boolReturn updateCustom(string Vip_name, string Card_id, string Vip_sex, string Card_type, string Vip_tel, string Mobile, string Company, string Vip_add)
        {
            if (string.IsNullOrEmpty(Card_id))
            {
                boolReturn br = new boolReturn();
                br.Code = -1;
                br.Message = "会员卡号不对！没有找到该条客户档案记录！";
                return br;
            }
            else
            {
                string str = "update t_rm_vip_info set vip_name='" + SafePramas(Vip_name);


                if (!string.IsNullOrEmpty(Vip_sex))
                    str += "',vip_sex='" + SafePramas(Vip_sex);
                str += "',card_type=" + SafePramas(Card_type);
                if (!string.IsNullOrEmpty(Vip_tel))
                    str += ",vip_tel='" + SafePramas(Vip_tel);
                if (!string.IsNullOrEmpty(Mobile))
                    str += "',mobile='" + SafePramas(Mobile);
                if (!string.IsNullOrEmpty(Company))
                    str += "',company='" + SafePramas(Company);
                if (!string.IsNullOrEmpty(Vip_add))
                    str += "',vip_add='" + SafePramas(Vip_add);

                str += "' where card_id='" + SafePramas(Card_id) + "'";
                return NoneQuery(str);
            }
        }
        //更新客户档案信息
        public boolReturn insertCustom(string Vip_name, string Card_id, string Vip_sex,string Card_type,  string Vip_tel, string Mobile, string Company, string Vip_add)
        {
            if (string.IsNullOrEmpty(Card_id))
            {
                boolReturn br = new boolReturn();
                br.Code = -1;
                br.Message = "请输入会员卡号，确保其唯一性！";
                return br;
            }
            else
            {
                string str = "insert into t_rm_vip_info (vip_name,card_id,vip_sex,card_type,card_status,oper_id,oper_date,vip_tel,mobile,company,vip_add) values('" + SafePramas(Vip_name);

                str += "','" + SafePramas(Card_id);

                str += "','" + SafePramas(Vip_sex);
                str += "'," + SafePramas(Card_type);

                str += ",0,'2001',GETDATE(),'" + SafePramas(Vip_tel);

                str += "','" + SafePramas(Mobile);

                str += "','" + SafePramas(Company);

                str += "','" + SafePramas(Vip_add);

                str += "')";
                return NoneQuery(str);
            }
        }
        //插入通话记录
        public boolReturn insertCalls(string Unid, string Cid,string Phone, string Content, int DoState, string DoneSth,string AgentName,string Exten) {
            if (string.IsNullOrEmpty(Unid) || string.IsNullOrEmpty(Cid))
            {
                boolReturn br = new boolReturn();
                br.Code = -1;
                br.Message = "无效的会员卡号和通话编号！";
                return br;
            }
            else
            {
                string str = "insert into callrecords (unid,cid,phone,content,dostate,donesth,agentname,exten,recordtime,updatetime) values('" + SafePramas(Unid);

                str += "','" + SafePramas(Cid);
str += "','" + SafePramas(Phone);
                str += "','" + SafePramas(Content);
                str += "'," + DoState;
                str += ",'" + SafePramas(DoneSth);
                str += "','" + SafePramas(AgentName);
                str += "','" + SafePramas(Exten);
                str += "',GETDATE(),GETDATE()";
                str += ")";
                return NoneQuery(str);
            }
        }
        //更新通话记录
        public boolReturn updateCalls(string Unid,string Cid,string Content, int DoState, string DoneSth) {


            string str = "update callrecords set updatetime=GETDATE() " ;


            if (!string.IsNullOrEmpty(Content))
                str += ",content='" + SafePramas(Content)+"'";

            str += ",dostate=" + DoState;

            if (!string.IsNullOrEmpty(DoneSth))
                str += ",donesth='" + SafePramas(DoneSth)+"'";


            str += " where unid='" + Unid + "' and cid='" + Cid + "'";
                return NoneQuery(str);
            
        }

        //获取已购商品信息
        public List<YGous> getYgItems(string keywords, string card_id,  string timefrom, string timeto)
        {
            List<YGous> calls = new List<YGous>();
            string sql = " select top 10 a.flow_no,a.oper_date,b.sale_qnty,b.sale_money,c.item_no,c.item_name,c.item_rem from t_rm_payflow a ";
  sql+=" left join t_rm_saleflow b on a.flow_no = b.flow_no";
  sql+=" left join t_bd_item_info c on c.item_no=b.item_no";
  sql += " where 1=1";
  if (!string.IsNullOrEmpty(card_id))
  {
      sql += " and a.vip_no = '" + card_id + "'";
  }
  if (!string.IsNullOrEmpty(keywords))
  {
      sql += " and (c.item_name like '%" + keywords + "%' or c.item_rem like '%" + keywords + "%'";
    
      sql += ")";
  }
 
  if (!string.IsNullOrEmpty(timefrom))
  {
      sql += " and a.oper_date > '" + timefrom + "'";
  }
  if (!string.IsNullOrEmpty(timeto))
  {
      sql += " and a.oper_date < '" + timeto + "'";
  }
  sql += " order by a.oper_date desc  ";

  DataTable dt = Query(sql);
  if (dt != null)
  {
      foreach (DataRow row in dt.Rows)
      {
          YGous callinfo = new YGous();
          callinfo.Flow_no = row["flow_no"].ToString();
          callinfo.Item_name = row["item_name"].ToString();
          callinfo.Oper_date = row["oper_date"].ToString();
          callinfo.Sale_money = row["sale_money"].ToString();
          callinfo.Sale_qnty = row["sale_qnty"].ToString();
          callinfo.Item_no = row["item_no"].ToString();
          callinfo.Item_rem = row["item_rem"].ToString();
          

          calls.Add(callinfo);

      }
  }
  return calls;

        }
        #region 连接到数据库
        private void connectDB()
        {
            try
            {
                //string pwd = DataAccess.EncAndDec.Decrypt("KJLCYyh2D0/4A4X+NGtOgg==", "SICHUANEXPERT", System.Text.Encoding.Default);
                string pwd = "123";
                string connetstring = "data source=127.0.0.1\\SQLEXPRESS;persist security info=True;initial catalog=hbpos7;user id=sa;password=" + pwd;
                connetstring = System.Configuration.ConfigurationManager.AppSettings["DBConnection"];
                if (sqlConnection == null)
                {
                    sqlConnection = new SqlConnection();
                }
               
                sqlConnection.ConnectionString = connetstring;

                if (sqlConnection.State == ConnectionState.Closed)
                {
                    sqlConnection.Open();//
                }
                if (sqlCommand == null)
                {
                    sqlCommand = new SqlCommand();
                }
                sqlCommand.Connection = sqlConnection;
            }
            catch (Exception ex)
            {
                throw new Exception("连接数据库发生异常：" + ex.Message);
            }
        }
        #endregion
        #region 执行数据库查询
        private DataTable Query(string qstr)
        {
            DataTable dt = new DataTable();
            try
            {
                connectDB();
                sqlCommand.CommandType = CommandType.Text;
                sqlCommand.CommandText = qstr;

                sqlDataAdapter= new SqlDataAdapter();
                sqlDataAdapter.SelectCommand = sqlCommand;
                sqlDataAdapter.Fill(dt);
                return dt;
            }
            catch (Exception ex)
            {
                dt = null;
                return dt;
            }
            finally
            {
                if (sqlConnection != null && sqlConnection.State == ConnectionState.Open)
                {
                    sqlConnection.Close();//
                }
            }
        }
        #endregion


        #region 无返回列表结果查询
        private boolReturn NoneQuery(string str) {
            boolReturn br = new boolReturn ();
            try
            {
                connectDB();
                sqlCommand.CommandType = CommandType.Text;
                sqlCommand.CommandText = str;
                br.Code = sqlCommand.ExecuteNonQuery();
                br.Message = "执行成功!" + str;
                return br;
                
            }
            catch (Exception ex)
            {
                br.Code = -1;
                br.Message = ex.Message;
                return br;
            }
            finally
            {
                if (sqlConnection != null && sqlConnection.State == ConnectionState.Open)
                {
                    sqlConnection.Close();//
                }
            }
           
        }
        #endregion

        #region sql参数安全
        private string SafePramas(string str) {
            if (str == null)
                return "";
            else
            {
                str.Replace('\'', '’');
                str.Replace('"', '”');
                str.Replace('%', '%');
                str.Replace('!', '！');
                str.Replace('@', '@');
                str.Replace(';', '；');
                return str;
            }
        }
        #endregion

    }
}
