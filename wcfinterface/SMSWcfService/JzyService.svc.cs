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

        public CunstomInfo getCustom(string tel) {
            string sql = "select a.*,b.* from t_rm_vip_info a left join t_rm_vip_type b on b.type_id=a.card_type";
            sql += " where a.vip_tel='13408598180'";
            DataTable dt = Query(sql);
            CunstomInfo cinfo = new CunstomInfo();
            foreach (DataRow row in dt.Rows)
            {
                cinfo.Vip_name = row["vip_name"].ToString() ;
                cinfo.Vip_tel = row["vip_tel"].ToString();
            
            }
            return cinfo;
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
