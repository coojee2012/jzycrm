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
            string sql =  "select a.card_id,a.card_type,b.type_name,b.discount,a.vip_name,a.vip_sex,a.oper_id,c.oper_name,a.social_id,a.vip_add,a.vip_email,a.vip_tel,a.company,a.duty,a.mobile from t_rm_vip_info a ";
                   sql += " left join t_rm_vip_type b on b.type_id=a.card_type ";
                   sql += " left join t_sys_operator c on a.oper_id = c.oper_id where 1=1  ";
            if (!string.IsNullOrEmpty(cunit)) {
                sql += " and a.vip_name like '%" + cunit + "%' ";
            }
            if (!string.IsNullOrEmpty(cardnum))
            {
                sql += " and a.card_id like '%" + cardnum + "%' ";
            }
            if (!string.IsNullOrEmpty(jbr))
            {
                sql += " and a.social_id like '%" + jbr + "%' ";
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
            string sql  = "select a.item_no,a.item_subno, a.item_name,a.item_subname,a.item_clsno,b.item_clsname,a.unit_no,a.price,a.sale_price,a.en_dis,a.change_price,a.main_supcust,a.item_rem,c.stock_qty from t_bd_item_info a";
                   sql += " left join t_bd_item_cls b  on a.item_clsno = b.item_clsno";//获取商品类别
                   sql += " left join t_im_branch_stock c on c.item_no = a.item_no where 1=1 ";//获取库存
                   if (!string.IsNullOrEmpty(itemname)) {
                       sql += " and a.item_name like '%" + itemname + "%'";                   
                   }
                   if (!string.IsNullOrEmpty(price))
                   {
                       sql += " and a.price like '%" + price + "%'";
                   }
                   if (!string.IsNullOrEmpty(rembercode))
                   {
                       sql += " and a.a.item_rem like '%" + rembercode + "%'";
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
                 shopitems.Add(shopitem);

             }

            return shopitems;
        
        }


        #region 连接到数据库
        private void connectDB()
        {
            try
            {
                //string pwd = DataAccess.EncAndDec.Decrypt("KJLCYyh2D0/4A4X+NGtOgg==", "SICHUANEXPERT", System.Text.Encoding.Default);
                string pwd = "123";
                string connetstring = "data source=127.0.0.1\\SQLEXPRESS;persist security info=True;initial catalog=hbpos7;user id=sa;password=" + pwd;
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
    }
}
