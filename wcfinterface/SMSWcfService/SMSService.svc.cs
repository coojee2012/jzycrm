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
    // 注意: 使用“重构”菜单上的“重命名”命令，可以同时更改代码、svc 和配置文件中的类名“Service1”。
    public class SMSService : ISMSService
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



        private string phone_cmpp = "134,135,136,137,138,139,150,151,152,157,158,159,182,187,188"; //移动号段
        private string phone_sgip = "130,131,132,155,156,185,186";   //联通号段

        private string phone_smgpC = "189,133,180,153,181";  //电信C网号段

        /*
        * srv_cmpp：移动特服号
        * act_cmpp：移动节目编号
        * 
        * srv_sgip：联通特服号
        * act_sgip：联通节目编号
        * 
        * srv_smgp：电信P网特服号
        * act_smgp：电信P网节目号
        * 
        * srv_smgpC：电信C网特服号
        * act_smgpC：电信C网节目号
        */
        private int srv_cmpp, srv_sgip, srv_smgp, srv_smgpC, act_cmpp, act_sgip, act_smgp, act_smgpC;
        private string interfaceNumber; //接入号

        private SmsType smsType = SmsType.smgp;

        public string SendSMS(string phone, string msg)
        {
            if (msg.Trim() == "") return "手机号码为空。";
            if (phone.Trim() == "") return "内容为空。";

            
            intsms();

            int srvcode = -1;
            phone = CheckPhone(phone);
            srvcode = GetServiceCode(phone);
            
            string strSql = "proc_Mtsend";
            string prmms = "";
            try {
                checkIP();
                connectDB();
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.Parameters.Add("@s_iPhone", SqlDbType.VarChar, 35);
                sqlCommand.Parameters.Add("@s_iService_Code", SqlDbType.VarChar, 35);
                sqlCommand.Parameters.Add("@s_iContent", SqlDbType.VarChar, 200);
                sqlCommand.Parameters.Add("@i_iPgId", SqlDbType.Int, 4);
                sqlCommand.Parameters.Add("@i_iConnId", SqlDbType.Int, 4);
                sqlCommand.Parameters.Add("@i_iMtTypeId", SqlDbType.Int, 4);
                sqlCommand.Parameters.Add("@s_iLinkId", SqlDbType.VarChar, 20);
                sqlCommand.Parameters.Add("@s_ifeePhone", SqlDbType.VarChar, 35);
                sqlCommand.Parameters.Add("@s_iReserve", SqlDbType.VarChar, 140);
                sqlCommand.Parameters.Add("@s_iMoIdentity", SqlDbType.VarChar, 30);
                sqlCommand.Parameters.Add("@return", SqlDbType.Int, 4);
                
                
                sqlCommand.Parameters[0].Value = phone;
                prmms += " phone=" + phone;
                sqlCommand.Parameters[1].Value = interfaceNumber;//10628733
                prmms += " interfaceNumber=" + interfaceNumber;
                sqlCommand.Parameters[2].Value = msg;
                prmms += " msg=" + msg;
                switch (smsType)
                {
                    case SmsType.cmpp:
                        sqlCommand.Parameters[3].Value = act_cmpp;//2   移动
                        prmms += " smsType=" + act_cmpp;
                        break;
                    case SmsType.sgip:
                        sqlCommand.Parameters[3].Value = act_sgip;//1   联通
                        prmms += " smsType=" + act_sgip;
                        break;
                    case SmsType.smgp:
                        sqlCommand.Parameters[3].Value = act_smgp;//7   电信小灵通
                        prmms += " smsType=" + act_smgp;
                        break;
                    case SmsType.smgpC:
                        sqlCommand.Parameters[3].Value = act_smgpC;//6  电信C网
                        prmms += " smsType=" + act_smgpC;
                        break;
                }

                sqlCommand.Parameters[4].Value = srvcode;//2000 移动，2001 联通，2002 电信C网，2003电信小灵通
                prmms += " srvcode=" + srvcode;

                sqlCommand.Parameters[5].Value = 1;
                sqlCommand.Parameters[6].Value = "";
                sqlCommand.Parameters[7].Value = "";
                sqlCommand.Parameters[8].Value = "";
                sqlCommand.Parameters[9].Value = "";
                sqlCommand.Parameters[10].Direction = ParameterDirection.ReturnValue;
                sqlCommand.CommandText = strSql;
                sqlCommand.ExecuteNonQuery();

                int i_result = (int)sqlCommand.Parameters[10].Direction;
              //  strLog += "手机号码: " + phone + " 发送结果: 成功(" + DateTime.Now.ToString() + ")\r\n";
               // strLog += "===================================================================================";
              //  strRichLog = "手机号码: " + phone + " 发送结果: 成功(" + DateTime.Now.ToString() + ")\r\n";
                if(i_result > 0)
                    return "发送成功。"+prmms;
                if (i_result == -1)
                    return "手机号码为空。" + prmms;
                if (i_result == -2)
                    return "错误的服务号码。" + prmms;
                if (i_result == -3)
                    return "短信内容为空。" + prmms;
                if (i_result == -4)
                    return "节目Id不正确。" + prmms;
                if (i_result == -5)
                    return "连接Id是不存在。" + prmms;
                if (i_result == -6)
                    return "短信下发类型不正确。" + prmms;
                
                if(i_result == -8)
                    return "对应的节目未开通这个连接。" + prmms;

                if (i_result == -9)
                    return "短信下发类型与节目类型不匹配。" + prmms;

                throw new Exception("未知错误代码:" + i_result.ToString() + prmms);

            
            }
            catch(Exception ex) {
                //writeLog(ex.Message);
                return ex.Message;
            }
            finally {
                if (sqlConnection!=null && sqlConnection.State == ConnectionState.Open)
                {
                    sqlConnection.Close();//
                }
            }

        }

        private DataTable Query(string qstr) {
            DataTable dt = new DataTable();
            try
            {
                connectDB();
                sqlCommand.CommandType = CommandType.Text;
                sqlCommand.CommandText = qstr;
                sqlDataAdapter.SelectCommand = sqlCommand;
                sqlDataAdapter.Fill(dt);
                return dt;
            }
            catch (Exception ex) {
                dt = null;
                return dt;
            }
            finally {
                if (sqlConnection != null && sqlConnection.State == ConnectionState.Open)
                {
                    sqlConnection.Close();//
                }
            }
        }

        #region 验证手机号码
        private string CheckPhone(string phone)
        {
            if (phone.Trim().Length == 0) return "";
            //去掉固定电话中的“-”

            phone = phone.Replace("-", "");
            if (phone.Trim().Substring(0, 3) == "013" || phone.Trim().Substring(0, 3) == "015" || phone.Trim().Substring(0, 3) == "018")
            {
                phone = phone.Trim().Substring(1, phone.Trim().Length - 1);
            }
            return phone;
        }
        #endregion

        #region 根据手机号码获取短信通道
        private int GetServiceCode(string phone)
        {
            if (string.IsNullOrEmpty(phone)) return -1;

            string sTemp = phone.Substring(0, 3);
            if (phone_cmpp.IndexOf(sTemp) >= 0)
            {
                smsType = SmsType.cmpp;
                return srv_cmpp;
            }

            if (phone_sgip.IndexOf(sTemp) >= 0)
            {
                smsType = SmsType.sgip;
                return srv_sgip;
            }

            if (phone_smgpC.IndexOf(sTemp) >= 0)
            {
                smsType = SmsType.smgpC;
                return srv_smgpC;
            }

            smsType = SmsType.smgp;
            return srv_smgp;
        }
        #endregion

        #region 初始化短信发送参数
        private void intsms() { 
             srv_cmpp=2000;
             srv_sgip=2001;
             srv_smgp=2003;
             srv_smgpC=2002;
             act_cmpp = 2; 
             act_sgip = 1; 
             act_smgp = 7; 
             act_smgpC = 6;
             interfaceNumber = "10628733";
        }
        #endregion
        #region 短信通道类型
        private enum SmsType
        {
            /// <summary>
            /// 移动
            /// </summary>
            cmpp,
            /// <summary>
            /// 联通

            /// </summary>
            sgip,
            /// <summary>
            /// 电信P网（小灵通）
            /// </summary>
            smgp,
            /// <summary>
            /// 电信C网

            /// </summary>
            smgpC
        }
        #endregion

        #region 连接到数据库
        private void connectDB() {
            try
            {
                string pwd = DataAccess.EncAndDec.Decrypt("KJLCYyh2D0/4A4X+NGtOgg==", "SICHUANEXPERT", System.Text.Encoding.Default);
               // string pwd = "testpwd";
                string connetstring = "data source=10.172.190.98;persist security info=True;initial catalog=sms;user id=sccinsms;password=" + pwd;
                if (sqlConnection == null)
                {
                    sqlConnection = new SqlConnection();
                }
                // sqlConnection = new SqlConnection(connetstring);
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
            catch(Exception ex){
                throw new Exception("连接数据库发生异常：" + ex.Message );
            }
        }
        #endregion

        #region 记录文本日志
        private void writeLog(string content){
          if (!File.Exists("sms.log") == true)
   {
       FileStream fs = new FileStream("sms.log", FileMode.Append);
       StreamWriter sw = new StreamWriter(fs);
       sw.WriteLine(content);
       sw.Close();
       fs.Close();   
            }
            else
            {
                FileStream myFs = new FileStream("sms.log", FileMode.Create);
                StreamWriter mySw = new StreamWriter(myFs);
                mySw.Write(content);
                mySw.Close();
                myFs.Close();
             
}

        }
        #endregion

        private void checkIP() {
            string ip = GetCustomerIP();
            if(string.IsNullOrEmpty(ip.Trim()))
            {
                throw new Exception("限制访问！");
            }

            string ips = "192.168.0.134,192.168.0.133,118.122.120.28";
            string[] ipss = ips.Split(',');
            foreach (string ipv4 in ipss) {
                if (ip == ipv4)
                    return;
            }

            throw new Exception("限制访问！");

        }

        public string GetCustomerIP()
        {


           string value = "111";
           OperationContext context = OperationContext.Current;  
           MessageProperties messageProperties = context.IncomingMessageProperties;  
           RemoteEndpointMessageProperty endpointProperty =  messageProperties [RemoteEndpointMessageProperty.Name]  as RemoteEndpointMessageProperty;  
          // return string.Format("Hello {0}! Your IP address is {1} and your port is {2}", value, endpointProperty.Address, endpointProperty.Port); 
           return endpointProperty.Address;

          
        }

        #region IJsonWCFService Members
        /// <summary>
        /// Implement the interface
        /// </summary>
        /// <param name="name">Name</param>
        /// <param name="address">Address</param>
        /// <param name="phone">PhoneNumber</param>
        /// <returns>JsonResult</returns>
        public JsonResult GetJsonResult(string name, string address, string phone)
        {
            JsonResult result = new JsonResult(name, address, phone);
            return result;
        }
        #endregion

        public List<JsonResult> GetJsons(string name, string address, string phone) {
            List<JsonResult> results = new List<JsonResult>();
            for (int i = 0; i < 10; i++)
            {
                JsonResult result = new JsonResult(name, address, phone);

                results.Add(result);
            }
           
            return results;
            
        
        }

        public TestDataContract test(string name) {
            
            return new TestDataContract(name);
        }

        public List<T> GetList<T>(string querystring)
        {
            DataTable table = Query(querystring); 
            List<T> list = new List<T>();
            T t = default(T);
            PropertyInfo[] propertypes = null;
            string tempName = string.Empty;
            foreach (DataRow row in table.Rows)
            {
                t = Activator.CreateInstance<T>();
                propertypes = t.GetType().GetProperties();
                foreach (PropertyInfo pro in propertypes)
                {
                    tempName = pro.Name;
                    if (table.Columns.Contains(tempName))
                    {
                        object value = row[tempName];
                        if (value.GetType() == typeof(System.DBNull))
                        {
                            value = null;
                        }
                        pro.SetValue(t, value, null);
                    }
                }
                list.Add(t);
            }
            return list;
        }

        



    }
}
