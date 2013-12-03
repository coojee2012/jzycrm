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
                       sql += " and a.a.item_rem like '%" + SafePramas(rembercode) + "%'";
                   }
             DataTable dt = Query(sql);
             foreach (DataRow row in dt.Rows)
             {
                 shopItemInfo shopitem = new shopItemInfo();
                 shopitem.ItemName = row["item_name"].ToString();
                 shopitem.ItemNo = row["item_no"].ToString();
                 shopitem.ItemSubno = row["item_subno"].ToString();
                 shopitem.Price = row["price"].ToString();
                 shopitem.SalePrice = row["sale_price"].ToString();
                
                 shopitem.Stors =row["stock_qty"].ToString();
                 shopitem.SupcustName = "";
                 shopitem.SupcustTel = "";
                 shopitem.UnitNo = row["unit_no"].ToString();
                 shopitem.EnDis = row["en_dis"].ToString()=="1"?"是":"否";
                 shopitem.Itemrem = row["item_rem"].ToString();
                 shopitems.Add(shopitem);

             }

            return shopitems;
        
        }

        //更新客户档案信息
        public boolReturn updateCustom(string Vip_name,string Card_id , string Vip_sex, string Vip_tel,string Mobile, string Company, string Vip_add)
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
                if (!string.IsNullOrEmpty(Vip_tel))
                    str += "',vip_tel='" + SafePramas(Vip_tel);
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
        public boolReturn insertCustom(string Vip_name, string Card_id, string Vip_sex, string Vip_tel, string Mobile, string Company, string Vip_add)
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
                string str = "insert into t_rm_vip_info (vip_name,card_id,vip_sex,vip_tel,mobile,company,vip_add) values('" + SafePramas(Vip_name);

                str += "','" + SafePramas(Card_id);

                str += "','" + SafePramas(Vip_sex);

                str += "','" + SafePramas(Vip_tel);

                str += "','" + SafePramas(Mobile);

                str += "','" + SafePramas(Company);

                str += "','" + SafePramas(Vip_add);

                str += "')";
                return NoneQuery(str);
            }
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
                br.Message = "执行成功";
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
