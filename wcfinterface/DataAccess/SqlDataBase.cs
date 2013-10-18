using System;
using System.Data;
using System.Xml;
using System.Data.SqlClient;
using System.Collections;
using System.Configuration;

namespace DataAccess
{
    public sealed class SqlDbConnection
    {
        private SqlDbConnection() { }

        public static String connectionString = "";

        #region GetConnectionString方法,获取数据库连接字串,提供是否需要解密参数
        public static String GetConnectionString(int connectionType, bool stringIsEncrypt)
        {
            return GetConnectionString(connectionType, "SCZJKConnection", String.Empty, stringIsEncrypt);
        }

        public static String GetConnectionString(int connectionType, String strConfigName, String startPath, bool stringIsEncrypt)
        {
            if (connectionType == 1)
            {
                return GetWebConnectionString(stringIsEncrypt, strConfigName);
            }
            else if (connectionType == 2)
            {
                return GetWinConnectionString(startPath, stringIsEncrypt);
            }

            return connectionString;
        }
        #endregion

        #region GetWebConnectionString方法,获取web连接字串
        private static String GetWebConnectionString(bool stringIsEncrypt, String strConfigName)
        {
            try
            {
                connectionString = ConfigurationManager.AppSettings[strConfigName];
                string[] connString = connectionString.Split(new char[] { ';' });
                string password = string.Empty;
                string temp = string.Empty;
                int i = -1;
                foreach (string s in connString)
                {
                    i = s.ToLower().LastIndexOf("password=");
                    if (i == -1)
                    {
                        temp += s + ";";
                    }
                    else
                    {
                        password = s.Substring(i + 9, s.Length - (i + 9));
                        if (stringIsEncrypt)
                            password = EncAndDec.Decrypt(password);
                        password = "password=" + password;
                    }
                }

                temp += password;

                connectionString = temp;
            }
            catch
            {
                connectionString = "";
            }

            return connectionString;
        }
        #endregion

        #region GetWinConnectionString方法,获取windows连接字串
        private static String GetWinConnectionString(String startPath, bool stringIsEncrypt)
        {
            String server = "", db_name = "", db_uname = "", db_pwd = "";

            try
            {                
                server = ConfigManage.IniReadValue(startPath + "\\Config.ini", "DataBase", "ServerName");
                db_name = ConfigManage.IniReadValue(startPath + "\\Config.ini", "DataBase", "DataBase");
                db_uname = ConfigManage.IniReadValue(startPath + "\\Config.ini", "DataBase", "UserName");
                db_pwd = ConfigManage.IniReadValue(startPath + "\\Config.ini", "DataBase", "PassWord");

                if (stringIsEncrypt)
                    db_pwd = EncAndDec.Decrypt(db_pwd);

                connectionString = "data source=" + server + ";persist security info=True;initial catalog=" + db_name + ";user id =" + db_uname + ";password=" + db_pwd;
            }
            catch
            {
                connectionString = "";
            }

            return connectionString;
        }
        #endregion

        #region MakeInParam方法,构造输入参数
        public static SqlParameter MakeInParam(String ParamName, SqlDbType DbType, int Size, object Value)
        {
            return MakeParam(ParamName, DbType, Size, ParameterDirection.Input, Value);
        }
        #endregion

        #region MakeOutParam方法,构造输出参数

        public static SqlParameter MakeOutParam(String ParamName, SqlDbType DbType, int Size)
        {
            return MakeParam(ParamName, DbType, Size, ParameterDirection.Output, null);
        }
        #endregion

        #region MakeParam方法,构造输入输出参数
        public static SqlParameter MakeParam(String ParamName, SqlDbType DbType, Int32 Size, ParameterDirection Direction, object Value)
        {
            SqlParameter param;

            if (Size > 0)
                param = new SqlParameter(ParamName, DbType, Size);
            else
                param = new SqlParameter(ParamName, DbType);

            param.Direction = Direction;
            if (!(Direction == ParameterDirection.Output && Value == null))
                param.Value = Value;

            return param;
        }
        #endregion
    }

    /// <summary>
    /// SqlDataBase 的摘要说明。
    /// </summary>
    public sealed class SqlDataBase
    {
        private SqlDataBase() { }

        #region 为Command分配参数
        private static void AttachParameters(SqlCommand command, SqlParameter[] commandParameters)
        {
            if (command == null) throw new ArgumentNullException("command");
            if (commandParameters != null)
            {
                foreach (SqlParameter p in commandParameters)
                {
                    if (p != null)
                    {
                        if ((p.Direction == ParameterDirection.InputOutput || p.Direction == ParameterDirection.Input) && (p.Value == null))
                        {
                            p.Value = DBNull.Value;
                        }
                        command.Parameters.Add(p);
                    }
                }
            }
        }
        #endregion

        #region 将行列值分配到参数数组

        /*
        private static void AssignParameterValues(SqlParameter[] commandParameters, DataRow dataRow)
        {
            if ((commandParameters == null) || (dataRow == null))
            {
                return;
            }

            int i = 0;
            foreach (SqlParameter commandParameter in commandParameters)
            {
                if (commandParameter.ParameterName == null || commandParameter.ParameterName.Length <= 1)
                    throw new Exception(
                        String.Format(
                        "Please provide a valid parameter name on the parameter #{0}, the ParameterName property has the following value: '{1}'.",
                        i, commandParameter.ParameterName));
                if (dataRow.Table.Columns.IndexOf(commandParameter.ParameterName.Substring(1)) != -1)
                    commandParameter.Value = dataRow[commandParameter.ParameterName.Substring(1)];
                i++;
            }
        }
         */
        #endregion

        #region 将对象数组的值分配到参数数组
        private static void AssignParameterValues(SqlParameter[] commandParameters, object[] parameterValues)
        {
            if ((commandParameters == null) || (parameterValues == null))
            {
                return;
            }

            if (commandParameters.Length != parameterValues.Length)
            {
                throw new ArgumentException("Parameter count does not match Parameter Value count.");
            }

            for (int i = 0, j = commandParameters.Length; i < j; i++)
            {
                if (parameterValues[i] is IDbDataParameter)
                {
                    IDbDataParameter paramInstance = (IDbDataParameter)parameterValues[i];
                    if (paramInstance.Value == null)
                    {
                        commandParameters[i].Value = DBNull.Value;
                    }
                    else
                    {
                        commandParameters[i].Value = paramInstance.Value;
                    }
                }
                else if (parameterValues[i] == null)
                {
                    commandParameters[i].Value = DBNull.Value;
                }
                else
                {
                    commandParameters[i].Value = parameterValues[i];
                }
            }
        }
        #endregion

        #region 准备一个Command
        private static void PrepareCommand(SqlCommand command, SqlConnection connection, SqlTransaction transaction, CommandType commandType, String commandText, SqlParameter[] commandParameters, out bool mustCloseConnection)
        {
            if (command == null) throw new ArgumentNullException("command");
            if (commandText == null || commandText.Length == 0) throw new ArgumentNullException("commandText");

            if (connection.State != ConnectionState.Open)
            {
                mustCloseConnection = true;
                connection.Open();
            }
            else
            {
                mustCloseConnection = false;
            }

            command.Connection = connection;
            command.CommandText = commandText;

            if (transaction != null)
            {
                if (transaction.Connection == null) throw new ArgumentException("The transaction was rollbacked or commited, please provide an open transaction.", "transaction");
                command.Transaction = transaction;
            }

            command.CommandType = commandType;

            if (commandParameters != null)
            {
                AttachParameters(command, commandParameters);
            }
            return;
        }
        #endregion

        #region ExecuteNonQuery方法,使用数据库连接字串,不带参数
        public static int ExecuteNonQuery(String connectionString, CommandType commandType, String commandText)
        {
            return ExecuteNonQuery(connectionString, commandType, commandText, (SqlParameter[])null);
        }
        #endregion

        #region ExecuteNonQuery方法,使用数据库连接字串,带参数
        public static int ExecuteNonQuery(String connectionString, CommandType commandType, String commandText, params SqlParameter[] commandParameters)
        {
            if (connectionString == null || connectionString.Length == 0) throw new ArgumentNullException("connectionString");

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                return ExecuteNonQuery(connection, commandType, commandText, commandParameters);
            }
        }
        #endregion

        #region ExecuteNonQuery方法,使用数据库连接字串,执行存储过程,带参数
        public static int ExecuteNonQuery(String connectionString, String spName, params object[] parameterValues)
        {
            if (connectionString == null || connectionString.Length == 0) throw new ArgumentNullException("connectionString");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            if ((parameterValues != null) && (parameterValues.Length > 0))
            {
                SqlParameter[] commandParameters = SqlDataBaseParameterCache.GetSpParameterSet(connectionString, spName);

                AssignParameterValues(commandParameters, parameterValues);

                return ExecuteNonQuery(connectionString, CommandType.StoredProcedure, spName, commandParameters);
            }
            else
            {
                return ExecuteNonQuery(connectionString, CommandType.StoredProcedure, spName);
            }
        }
        #endregion

        #region ExecuteNonQuery方法,使用Connection对象,不带参数
        public static int ExecuteNonQuery(SqlConnection connection, CommandType commandType, String commandText)
        {
            return ExecuteNonQuery(connection, commandType, commandText, (SqlParameter[])null);
        }
        #endregion

        #region ExecuteNonQuery方法,使用Connection对象,带参数

        public static int ExecuteNonQuery(SqlConnection connection, CommandType commandType, String commandText, params SqlParameter[] commandParameters)
        {
            if (connection == null) throw new ArgumentNullException("connection");

            SqlCommand cmd = new SqlCommand();
            bool mustCloseConnection = false;
            PrepareCommand(cmd, connection, (SqlTransaction)null, commandType, commandText, commandParameters, out mustCloseConnection);

            int retval = cmd.ExecuteNonQuery();

            cmd.Parameters.Clear();
            if (mustCloseConnection)
                connection.Close();
            return retval;
        }
        #endregion

        #region ExecuteNonQuery方法,使用Connection对象,执行存储过程,带参数

        public static int ExecuteNonQuery(SqlConnection connection, String spName, params object[] parameterValues)
        {
            if (connection == null) throw new ArgumentNullException("connection");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            if ((parameterValues != null) && (parameterValues.Length > 0))
            {
                SqlParameter[] commandParameters = SqlDataBaseParameterCache.GetSpParameterSet(connection, spName);

                AssignParameterValues(commandParameters, parameterValues);

                return ExecuteNonQuery(connection, CommandType.StoredProcedure, spName, commandParameters);
            }
            else
            {
                return ExecuteNonQuery(connection, CommandType.StoredProcedure, spName);
            }
        }
        #endregion

        #region ExecuteNonQuery方法,事务型,不带参数
        public static int ExecuteNonQuery(SqlTransaction transaction, CommandType commandType, String commandText)
        {
            return ExecuteNonQuery(transaction, commandType, commandText, (SqlParameter[])null);
        }
        #endregion

        #region ExecuteNonQuery方法,事务型,带参数
        public static int ExecuteNonQuery(SqlTransaction transaction, CommandType commandType, String commandText, params SqlParameter[] commandParameters)
        {
            if (transaction == null) throw new ArgumentNullException("transaction");
            if (transaction != null && transaction.Connection == null) throw new ArgumentException("The transaction was rollbacked or commited, please provide an open transaction.", "transaction");

            SqlCommand cmd = new SqlCommand();
            bool mustCloseConnection = false;
            PrepareCommand(cmd, transaction.Connection, transaction, commandType, commandText, commandParameters, out mustCloseConnection);

            int retval = cmd.ExecuteNonQuery();

            cmd.Parameters.Clear();
            return retval;
        }
        #endregion

        #region ExecuteNonQuery方法,事务型,执行存储过程,带参数
        public static int ExecuteNonQuery(SqlTransaction transaction, String spName, params object[] parameterValues)
        {
            if (transaction == null) throw new ArgumentNullException("transaction");
            if (transaction != null && transaction.Connection == null) throw new ArgumentException("The transaction was rollbacked or commited, please provide an open transaction.", "transaction");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            if ((parameterValues != null) && (parameterValues.Length > 0))
            {
                SqlParameter[] commandParameters = SqlDataBaseParameterCache.GetSpParameterSet(transaction.Connection, spName);

                AssignParameterValues(commandParameters, parameterValues);

                return ExecuteNonQuery(transaction, CommandType.StoredProcedure, spName, commandParameters);
            }
            else
            {
                return ExecuteNonQuery(transaction, CommandType.StoredProcedure, spName);
            }
        }
        #endregion

        #region ExecuteDataset方法,使用数据库连接字串,不带参数
        public static DataSet ExecuteDataset(String connectionString, CommandType commandType, String commandText)
        {
            return ExecuteDataset(connectionString, commandType, commandText, (SqlParameter[])null);
        }
        #endregion

        #region ExecuteDataset方法,使用数据库连接字串,带参数
        public static DataSet ExecuteDataset(String connectionString, CommandType commandType, String commandText, params SqlParameter[] commandParameters)
        {
            return ExecuteDataset(connectionString, commandType, commandText, 0, 0, commandParameters);
        }
        #endregion

        #region ExecuteDataset方法,使用Conncetion对象,不带参数 只获取当前页数据
        public static DataSet ExecuteDataset(String connectionString, CommandType commandType, String commandText, int startRecord, int maxRecords, params SqlParameter[] commandParameters)
        {
            if (connectionString == null || connectionString.Length == 0) throw new ArgumentNullException("connectionString");

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                return ExecuteDataset(connection, commandType, commandText, startRecord, maxRecords, commandParameters);
            }
        }
        #endregion

        #region ExecuteDataset方法,使用数据库连接字串,执行存储过程,不带参数
        public static DataSet ExecuteDataset(String connectionString, String spName, params object[] parameterValues)
        {
            if (connectionString == null || connectionString.Length == 0) throw new ArgumentNullException("connectionString");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            if ((parameterValues != null) && (parameterValues.Length > 0))
            {
                SqlParameter[] commandParameters = SqlDataBaseParameterCache.GetSpParameterSet(connectionString, spName);

                AssignParameterValues(commandParameters, parameterValues);

                return ExecuteDataset(connectionString, CommandType.StoredProcedure, spName, commandParameters);
            }
            else
            {
                return ExecuteDataset(connectionString, CommandType.StoredProcedure, spName);
            }
        }
        #endregion

        #region ExecuteDataset方法,使用Conncetion对象,不带参数
        public static DataSet ExecuteDataset(SqlConnection connection, CommandType commandType, String commandText)
        {
            return ExecuteDataset(connection, commandType, commandText, (SqlParameter[])null);
        }
        #endregion

        #region ExecuteDataset方法,使用Conncetion对象,带参数

        public static DataSet ExecuteDataset(SqlConnection connection, CommandType commandType, String commandText, params SqlParameter[] commandParameters)
        {
            return ExecuteDataset(connection, commandType, commandText, 0, 0, commandParameters);
        }
        #endregion

        #region ExecuteDataset方法,使用Conncetion对象,不带参数 只获取当前页数据
        public static DataSet ExecuteDataset(SqlConnection connection, CommandType commandType, String commandText, int startRecord, int maxRecords, params SqlParameter[] commandParameters)
        {
            if (connection == null) throw new ArgumentNullException("connection");

            SqlCommand cmd = new SqlCommand();
            bool mustCloseConnection = false;
            PrepareCommand(cmd, connection, (SqlTransaction)null, commandType, commandText, commandParameters, out mustCloseConnection);

            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                DataSet ds = new DataSet();
                if (startRecord == 0 && maxRecords == 0)
                    da.Fill(ds);
                else
                    da.Fill(ds, startRecord, maxRecords, "tmpTable");
                cmd.Parameters.Clear();
                if (mustCloseConnection)
                    connection.Close();
                return ds;
            }
        }
        #endregion

        #region ExecuteDataset方法,使用Conncetion对象,执行存储过程,带参数

        public static DataSet ExecuteDataset(SqlConnection connection, String spName, params object[] parameterValues)
        {
            if (connection == null) throw new ArgumentNullException("connection");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            if ((parameterValues != null) && (parameterValues.Length > 0))
            {
                SqlParameter[] commandParameters = SqlDataBaseParameterCache.GetSpParameterSet(connection, spName);
                AssignParameterValues(commandParameters, parameterValues);
                return ExecuteDataset(connection, CommandType.StoredProcedure, spName, commandParameters);
            }
            else
            {
                return ExecuteDataset(connection, CommandType.StoredProcedure, spName);
            }
        }
        #endregion

        #region ExecuteDataset方法,事务型,不带参数
        public static DataSet ExecuteDataset(SqlTransaction transaction, CommandType commandType, String commandText)
        {
            return ExecuteDataset(transaction, commandType, commandText, (SqlParameter[])null);
        }
        #endregion

        #region ExecuteDataset方法,事务型,带参数
        public static DataSet ExecuteDataset(SqlTransaction transaction, CommandType commandType, String commandText, params SqlParameter[] commandParameters)
        {
            if (transaction == null) throw new ArgumentNullException("transaction");
            if (transaction != null && transaction.Connection == null) throw new ArgumentException("The transaction was rollbacked or commited, please provide an open transaction.", "transaction");

            SqlCommand cmd = new SqlCommand();
            bool mustCloseConnection = false;
            PrepareCommand(cmd, transaction.Connection, transaction, commandType, commandText, commandParameters, out mustCloseConnection);

            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                DataSet ds = new DataSet();
                da.Fill(ds);
                cmd.Parameters.Clear();
                return ds;
            }
        }
        #endregion

        #region ExecuteDataset方法,事务型,执行存储过程,带参数
        public static DataSet ExecuteDataset(SqlTransaction transaction, String spName, params object[] parameterValues)
        {
            if (transaction == null) throw new ArgumentNullException("transaction");
            if (transaction != null && transaction.Connection == null) throw new ArgumentException("The transaction was rollbacked or commited, please provide an open transaction.", "transaction");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            if ((parameterValues != null) && (parameterValues.Length > 0))
            {
                SqlParameter[] commandParameters = SqlDataBaseParameterCache.GetSpParameterSet(transaction.Connection, spName);

                AssignParameterValues(commandParameters, parameterValues);

                return ExecuteDataset(transaction, CommandType.StoredProcedure, spName, commandParameters);
            }
            else
            {
                return ExecuteDataset(transaction, CommandType.StoredProcedure, spName);
            }
        }
        #endregion

        #region 数据连接枚举
        private enum SqlConnectionOwnership
        {
            /// <summary>内在的数据连接,由SqlDataBase拥有和管理</summary>
            Internal,
            /// <summary>外在的数据连接,由调用者拥有和管理</summary>
            External
        }
        #endregion

        #region ExecuteReader方法,使用Connection对象,带参数和数据连接类型
        private static SqlDataReader ExecuteReader(SqlConnection connection, SqlTransaction transaction, CommandType commandType, String commandText, SqlParameter[] commandParameters, SqlConnectionOwnership connectionOwnership)
        {
            if (connection == null) throw new ArgumentNullException("connection");

            bool mustCloseConnection = false;

            SqlCommand cmd = new SqlCommand();
            try
            {
                PrepareCommand(cmd, connection, transaction, commandType, commandText, commandParameters, out mustCloseConnection);

                SqlDataReader dataReader;

                if (connectionOwnership == SqlConnectionOwnership.External)
                {
                    dataReader = cmd.ExecuteReader();
                }
                else
                {
                    dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                }

                bool canClear = true;
                foreach (SqlParameter commandParameter in cmd.Parameters)
                {
                    if (commandParameter.Direction != ParameterDirection.Input)
                        canClear = false;
                }

                if (canClear)
                {
                    cmd.Parameters.Clear();
                }

                return dataReader;
            }
            catch
            {
                if (mustCloseConnection)
                    connection.Close();
                throw;
            }
        }
        #endregion

        #region ExecuteReader方法,使用数据连接字串,不带参数
        public static SqlDataReader ExecuteReader(String connectionString, CommandType commandType, String commandText)
        {
            return ExecuteReader(connectionString, commandType, commandText, (SqlParameter[])null);
        }
        #endregion

        #region ExecuteReader方法,使用数据连接字串,带参数
        public static SqlDataReader ExecuteReader(String connectionString, CommandType commandType, String commandText, params SqlParameter[] commandParameters)
        {
            if (connectionString == null || connectionString.Length == 0) throw new ArgumentNullException("connectionString");
            SqlConnection connection = null;

            try
            {
                connection = new SqlConnection(connectionString);
                connection.Open();

                return ExecuteReader(connection, null, commandType, commandText, commandParameters, SqlConnectionOwnership.Internal);
            }
            catch
            {
                if (connection != null) connection.Close();
                throw;
            }
        }
        #endregion

        #region ExecuteReader方法,使用数据连接字串,执行存储过程,带参数
        public static SqlDataReader ExecuteReader(String connectionString, String spName, params object[] parameterValues)
        {
            if (connectionString == null || connectionString.Length == 0) throw new ArgumentNullException("connectionString");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            if ((parameterValues != null) && (parameterValues.Length > 0))
            {
                SqlParameter[] commandParameters = SqlDataBaseParameterCache.GetSpParameterSet(connectionString, spName);

                AssignParameterValues(commandParameters, parameterValues);

                return ExecuteReader(connectionString, CommandType.StoredProcedure, spName, commandParameters);
            }
            else
            {
                return ExecuteReader(connectionString, CommandType.StoredProcedure, spName);
            }
        }
        #endregion

        #region ExecuteReader方法,使用Connection对象,不带参数
        public static SqlDataReader ExecuteReader(SqlConnection connection, CommandType commandType, String commandText)
        {
            return ExecuteReader(connection, commandType, commandText, (SqlParameter[])null);
        }
        #endregion

        #region ExecuteReader方法,使用Connection对象,带参数
        public static SqlDataReader ExecuteReader(SqlConnection connection, CommandType commandType, String commandText, params SqlParameter[] commandParameters)
        {
            return ExecuteReader(connection, (SqlTransaction)null, commandType, commandText, commandParameters, SqlConnectionOwnership.External);
        }
        #endregion

        #region ExecuteReader方法,使用数据连接字串对象,执行存储过程,带参数
        public static SqlDataReader ExecuteReader(SqlConnection connection, String spName, params object[] parameterValues)
        {
            if (connection == null) throw new ArgumentNullException("connection");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            if ((parameterValues != null) && (parameterValues.Length > 0))
            {
                SqlParameter[] commandParameters = SqlDataBaseParameterCache.GetSpParameterSet(connection, spName);

                AssignParameterValues(commandParameters, parameterValues);

                return ExecuteReader(connection, CommandType.StoredProcedure, spName, commandParameters);
            }
            else
            {
                return ExecuteReader(connection, CommandType.StoredProcedure, spName);
            }
        }
        #endregion

        #region ExecuteReader方法,事务型,不带参数
        public static SqlDataReader ExecuteReader(SqlTransaction transaction, CommandType commandType, String commandText)
        {
            return ExecuteReader(transaction, commandType, commandText, (SqlParameter[])null);
        }
        #endregion

        #region ExecuteReader方法,事务型,带参数
        public static SqlDataReader ExecuteReader(SqlTransaction transaction, CommandType commandType, String commandText, params SqlParameter[] commandParameters)
        {
            if (transaction == null) throw new ArgumentNullException("transaction");
            if (transaction != null && transaction.Connection == null) throw new ArgumentException("The transaction was rollbacked or commited, please provide an open transaction.", "transaction");
            return ExecuteReader(transaction.Connection, transaction, commandType, commandText, commandParameters, SqlConnectionOwnership.External);
        }
        #endregion

        #region ExecuteReader方法,事务型,执行存储过程,带参数
        public static SqlDataReader ExecuteReader(SqlTransaction transaction, String spName, params object[] parameterValues)
        {
            if (transaction == null) throw new ArgumentNullException("transaction");
            if (transaction != null && transaction.Connection == null) throw new ArgumentException("The transaction was rollbacked or commited, please provide an open transaction.", "transaction");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            if ((parameterValues != null) && (parameterValues.Length > 0))
            {
                SqlParameter[] commandParameters = SqlDataBaseParameterCache.GetSpParameterSet(transaction.Connection, spName);

                AssignParameterValues(commandParameters, parameterValues);

                return ExecuteReader(transaction, CommandType.StoredProcedure, spName, commandParameters);
            }
            else
            {
                return ExecuteReader(transaction, CommandType.StoredProcedure, spName);
            }
        }
        #endregion

        #region ExecuteScalar方法,使用数据库连接字串,不带参数
        public static object ExecuteScalar(String connectionString, CommandType commandType, String commandText)
        {
            return ExecuteScalar(connectionString, commandType, commandText, (SqlParameter[])null);
        }
        #endregion

        #region ExecuteScalar方法,使用数据库连接字串,带参数
        public static object ExecuteScalar(String connectionString, CommandType commandType, String commandText, params SqlParameter[] commandParameters)
        {
            if (connectionString == null || connectionString.Length == 0) throw new ArgumentNullException("connectionString");

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                return ExecuteScalar(connection, commandType, commandText, commandParameters);
            }
        }
        #endregion

        #region ExecuteScalar方法,使用数据库连接字串,执行存储过程,带参数
        public static object ExecuteScalar(String connectionString, String spName, params object[] parameterValues)
        {
            if (connectionString == null || connectionString.Length == 0) throw new ArgumentNullException("connectionString");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            if ((parameterValues != null) && (parameterValues.Length > 0))
            {
                SqlParameter[] commandParameters = SqlDataBaseParameterCache.GetSpParameterSet(connectionString, spName);

                AssignParameterValues(commandParameters, parameterValues);

                return ExecuteScalar(connectionString, CommandType.StoredProcedure, spName, commandParameters);
            }
            else
            {
                return ExecuteScalar(connectionString, CommandType.StoredProcedure, spName);
            }
        }
        #endregion

        #region ExecuteScalar方法,使用Connection对象,不带参数
        public static object ExecuteScalar(SqlConnection connection, CommandType commandType, String commandText)
        {
            return ExecuteScalar(connection, commandType, commandText, (SqlParameter[])null);
        }
        #endregion

        #region ExecuteScalar方法,使用Connection对象,带参数
        public static object ExecuteScalar(SqlConnection connection, CommandType commandType, String commandText, params SqlParameter[] commandParameters)
        {
            if (connection == null) throw new ArgumentNullException("connection");

            SqlCommand cmd = new SqlCommand();

            bool mustCloseConnection = false;
            PrepareCommand(cmd, connection, (SqlTransaction)null, commandType, commandText, commandParameters, out mustCloseConnection);

            object retval = cmd.ExecuteScalar();

            cmd.Parameters.Clear();

            if (mustCloseConnection)
                connection.Close();

            return retval;
        }
        #endregion

        #region ExecuteScalar方法,使用Connection对象,执行存储过程,带参数
        public static object ExecuteScalar(SqlConnection connection, String spName, params object[] parameterValues)
        {
            if (connection == null) throw new ArgumentNullException("connection");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            if ((parameterValues != null) && (parameterValues.Length > 0))
            {
                SqlParameter[] commandParameters = SqlDataBaseParameterCache.GetSpParameterSet(connection, spName);

                AssignParameterValues(commandParameters, parameterValues);

                return ExecuteScalar(connection, CommandType.StoredProcedure, spName, commandParameters);
            }
            else
            {
                return ExecuteScalar(connection, CommandType.StoredProcedure, spName);
            }
        }
        #endregion

        #region ExecuteScalar方法,事务型,不带参数
        public static object ExecuteScalar(SqlTransaction transaction, CommandType commandType, String commandText)
        {
            return ExecuteScalar(transaction, commandType, commandText, (SqlParameter[])null);
        }
        #endregion

        #region ExecuteScalar方法,事务型,带参数
        public static object ExecuteScalar(SqlTransaction transaction, CommandType commandType, String commandText, params SqlParameter[] commandParameters)
        {
            if (transaction == null) throw new ArgumentNullException("transaction");
            if (transaction != null && transaction.Connection == null) throw new ArgumentException("The transaction was rollbacked or commited, please provide an open transaction.", "transaction");

            SqlCommand cmd = new SqlCommand();
            bool mustCloseConnection = false;
            PrepareCommand(cmd, transaction.Connection, transaction, commandType, commandText, commandParameters, out mustCloseConnection);

            object retval = cmd.ExecuteScalar();

            cmd.Parameters.Clear();
            return retval;
        }
        #endregion

        #region ExecuteScalar方法,事务型,执行存储过程,带参数
        public static object ExecuteScalar(SqlTransaction transaction, String spName, params object[] parameterValues)
        {
            if (transaction == null) throw new ArgumentNullException("transaction");
            if (transaction != null && transaction.Connection == null) throw new ArgumentException("The transaction was rollbacked or commited, please provide an open transaction.", "transaction");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            if ((parameterValues != null) && (parameterValues.Length > 0))
            {
                SqlParameter[] commandParameters = SqlDataBaseParameterCache.GetSpParameterSet(transaction.Connection, spName);

                AssignParameterValues(commandParameters, parameterValues);

                return ExecuteScalar(transaction, CommandType.StoredProcedure, spName, commandParameters);
            }
            else
            {
                return ExecuteScalar(transaction, CommandType.StoredProcedure, spName);
            }
        }
        #endregion

        #region ExecuteXmlReader方法,使用Connection对象,不带参数
        public static XmlReader ExecuteXmlReader(SqlConnection connection, CommandType commandType, String commandText)
        {
            return ExecuteXmlReader(connection, commandType, commandText, (SqlParameter[])null);
        }
        #endregion

        #region ExecuteXmlReader方法,使用Connection对象,带参数
        public static XmlReader ExecuteXmlReader(SqlConnection connection, CommandType commandType, String commandText, params SqlParameter[] commandParameters)
        {
            if (connection == null) throw new ArgumentNullException("connection");

            bool mustCloseConnection = false;

            SqlCommand cmd = new SqlCommand();
            try
            {
                PrepareCommand(cmd, connection, (SqlTransaction)null, commandType, commandText, commandParameters, out mustCloseConnection);

                XmlReader retval = cmd.ExecuteXmlReader();

                cmd.Parameters.Clear();

                return retval;
            }
            catch
            {
                if (mustCloseConnection)
                    connection.Close();
                throw;
            }
        }
        #endregion

        #region ExecuteXmlReader方法,使用Connection对象,执行存储过程,带参数
        public static XmlReader ExecuteXmlReader(SqlConnection connection, String spName, params object[] parameterValues)
        {
            if (connection == null) throw new ArgumentNullException("connection");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            if ((parameterValues != null) && (parameterValues.Length > 0))
            {
                SqlParameter[] commandParameters = SqlDataBaseParameterCache.GetSpParameterSet(connection, spName);

                AssignParameterValues(commandParameters, parameterValues);

                return ExecuteXmlReader(connection, CommandType.StoredProcedure, spName, commandParameters);
            }
            else
            {
                return ExecuteXmlReader(connection, CommandType.StoredProcedure, spName);
            }
        }
        #endregion

        #region ExecuteXmlReader方法,事务型,不带参数
        public static XmlReader ExecuteXmlReader(SqlTransaction transaction, CommandType commandType, String commandText)
        {
            return ExecuteXmlReader(transaction, commandType, commandText, (SqlParameter[])null);
        }
        #endregion

        #region ExecuteXmlReader方法,事务型,带参数
        public static XmlReader ExecuteXmlReader(SqlTransaction transaction, CommandType commandType, String commandText, params SqlParameter[] commandParameters)
        {
            if (transaction == null) throw new ArgumentNullException("transaction");
            if (transaction != null && transaction.Connection == null) throw new ArgumentException("The transaction was rollbacked or commited, please provide an open transaction.", "transaction");

            SqlCommand cmd = new SqlCommand();
            bool mustCloseConnection = false;
            PrepareCommand(cmd, transaction.Connection, transaction, commandType, commandText, commandParameters, out mustCloseConnection);

            XmlReader retval = cmd.ExecuteXmlReader();

            cmd.Parameters.Clear();
            return retval;
        }
        #endregion

        #region ExecuteXmlReader方法,事务型,执行存储过程,带参数
        public static XmlReader ExecuteXmlReader(SqlTransaction transaction, String spName, params object[] parameterValues)
        {
            if (transaction == null) throw new ArgumentNullException("transaction");
            if (transaction != null && transaction.Connection == null) throw new ArgumentException("The transaction was rollbacked or commited, please provide an open transaction.", "transaction");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            if ((parameterValues != null) && (parameterValues.Length > 0))
            {
                SqlParameter[] commandParameters = SqlDataBaseParameterCache.GetSpParameterSet(transaction.Connection, spName);

                AssignParameterValues(commandParameters, parameterValues);

                return ExecuteXmlReader(transaction, CommandType.StoredProcedure, spName, commandParameters);
            }
            else
            {
                return ExecuteXmlReader(transaction, CommandType.StoredProcedure, spName);
            }
        }
        #endregion

        #region 大文本数据提交
        #region TableRow_Add方法,新增一条数据

        public static bool TableRow_Add(String connectionString, Hashtable ht, String table_name)
        {
            bool ret = false;
            try
            {
                using (SqlConnection cn = new SqlConnection(connectionString))
                {
                    cn.Open();
                    DataSet ds = new DataSet();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        using (SqlCommandBuilder cb = new SqlCommandBuilder(da))
                        {
                            //建立空结构表
                            da.SelectCommand = new SqlCommand("SELECT * FROM " + table_name + " where 1=2", cn);
                            da.Fill(ds, table_name);

                            //建立新行
                            DataRow dr = ds.Tables[0].NewRow();

                            System.Collections.IDictionaryEnumerator coll = ht.GetEnumerator();
                            //遍历循环
                            while (coll.MoveNext())
                            {
                                if (coll.Value.ToString() == "")
                                {
                                    dr[coll.Key.ToString()] = DBNull.Value;
                                }
                                else
                                {
                                    dr[coll.Key.ToString()] = coll.Value;
                                }
                            }
                            //增加新行
                            ds.Tables[0].Rows.Add(dr);
                            //提交到数据库
                            da.Update(ds, table_name);
                        }
                    }
                }
                ret = true;
            }
            catch
            {
                ret = false;
            }
            return ret;
        }
        #endregion

        #region TableRow_Add方法,新增一条数据,事务型
        public static bool TableRow_Add(SqlTransaction transaction, Hashtable ht, String table_name)
        {
            bool ret = false;
            try
            {
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    using (SqlCommandBuilder cb = new SqlCommandBuilder(da))
                    {
                        DataSet ds = new DataSet();
                        //建立空结构表
                        da.SelectCommand = new SqlCommand("SELECT * FROM " + table_name + " where 1=2", transaction.Connection);
                        da.SelectCommand.Transaction = transaction;
                        da.Fill(ds, table_name);

                        //建立新行
                        DataRow dr = ds.Tables[0].NewRow();

                        System.Collections.IDictionaryEnumerator coll = ht.GetEnumerator();
                        //遍历循环
                        while (coll.MoveNext())
                        {
                            if (coll.Value.ToString() == "")
                            {
                                dr[coll.Key.ToString()] = DBNull.Value;
                            }
                            else
                            {
                                dr[coll.Key.ToString()] = coll.Value;
                            }
                        }
                        //增加新行
                        ds.Tables[0].Rows.Add(dr);
                        //提交到数据库
                        da.Update(ds, table_name);
                    }
                }
                ret = true;
            }
            catch
            {
                ret = false;
            }
            return ret;
        }
        #endregion

        #region TableRow_Edit方法,修改一条数据
        public static bool TableRow_Edit(String connectionString, Hashtable ht_Data, Hashtable ht_condition, String table_name)
        {
            bool ret = false;
            try
            {
                using (SqlConnection cn = new SqlConnection(connectionString))
                {
                    cn.Open();
                    DataSet ds = new DataSet();

                    System.Collections.IDictionaryEnumerator coll = ht_condition.GetEnumerator();
                    String condition = "";
                    while (coll.MoveNext())
                    {
                        if (condition == "")
                        {
                            condition += coll.Key.ToString() + "='" + coll.Value + "'";
                        }
                        else
                        {
                            condition += " and " + coll.Key.ToString() + "='" + coll.Value + "'";
                        }
                    }

                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        using (SqlCommandBuilder cb = new SqlCommandBuilder(da))
                        {
                            //建立空结构表
                            da.SelectCommand = new SqlCommand("select * from " + table_name + " where " + condition, cn);
                            da.Fill(ds, table_name);

                            coll = ht_Data.GetEnumerator();

                            while (coll.MoveNext())
                            {
                                if (coll.Value.ToString() == "")
                                {
                                    ds.Tables[0].Rows[0][coll.Key.ToString()] = DBNull.Value;
                                }
                                else
                                {
                                    ds.Tables[0].Rows[0][coll.Key.ToString()] = coll.Value;
                                }
                            }
                            //提交到数据库
                            da.Update(ds, table_name);
                        }
                    }
                }
                ret = true;
            }
            catch
            {
                ret = false;
            }
            return ret;
        }
        #endregion

        #region TableRow_Edit方法,修改一条数据,事务型
        public static bool TableRow_Edit(SqlTransaction transaction, Hashtable ht_Data, Hashtable ht_condition, String table_name)
        {
            bool ret = false;
            try
            {
                DataSet ds = new DataSet();

                System.Collections.IDictionaryEnumerator coll = ht_condition.GetEnumerator();
                String condition = "";
                while (coll.MoveNext())
                {
                    if (condition == "")
                    {
                        condition += coll.Key.ToString() + "='" + coll.Value + "'";
                    }
                    else
                    {
                        condition += " and " + coll.Key.ToString() + "='" + coll.Value + "'";
                    }
                }

                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    using (SqlCommandBuilder cb = new SqlCommandBuilder(da))
                    {
                        //建立空结构表
                        da.SelectCommand = new SqlCommand("select * from " + table_name + " where " + condition, transaction.Connection);
                        da.SelectCommand.Transaction = transaction;
                        da.Fill(ds, table_name);

                        coll = ht_Data.GetEnumerator();

                        while (coll.MoveNext())
                        {
                            if (coll.Value.ToString() == "")
                            {
                                ds.Tables[0].Rows[0][coll.Key.ToString()] = DBNull.Value;
                            }
                            else
                            {
                                ds.Tables[0].Rows[0][coll.Key.ToString()] = coll.Value;
                            }
                        }
                        //提交到数据库
                        da.Update(ds, table_name);
                    }
                }
                ret = true;
            }
            catch
            {
                ret = false;
            }
            return ret;
        }
        #endregion

        #endregion

        #region 创建SqlCommand对象
        public static SqlCommand CreateCommand(SqlConnection connection, String spName, params String[] sourceColumns)
        {
            if (connection == null) throw new ArgumentNullException("connection");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            SqlCommand cmd = new SqlCommand(spName, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            if ((sourceColumns != null) && (sourceColumns.Length > 0))
            {
                SqlParameter[] commandParameters = SqlDataBaseParameterCache.GetSpParameterSet(connection, spName);

                for (int index = 0; index < sourceColumns.Length; index++)
                    commandParameters[index].SourceColumn = sourceColumns[index];

                AttachParameters(cmd, commandParameters);
            }

            return cmd;
        }
        #endregion

    }

    public sealed class SqlDataBaseParameterCache
    {
        private SqlDataBaseParameterCache() { }

        private static Hashtable paramCache = Hashtable.Synchronized(new Hashtable());

        #region DiscoverSpParameterSet方法,使用Connection对象,为存储过程参数赋值(NULL),提供存储过程是否返回参数结果
        private static SqlParameter[] DiscoverSpParameterSet(SqlConnection connection, String spName, bool includeReturnValueParameter)
        {
            if (connection == null) throw new ArgumentNullException("connection");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            SqlCommand cmd = new SqlCommand(spName, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            connection.Open();
            SqlCommandBuilder.DeriveParameters(cmd);
            connection.Close();

            if (!includeReturnValueParameter)
            {
                cmd.Parameters.RemoveAt(0);
            }

            SqlParameter[] discoveredParameters = new SqlParameter[cmd.Parameters.Count];

            cmd.Parameters.CopyTo(discoveredParameters, 0);

            foreach (SqlParameter discoveredParameter in discoveredParameters)
            {
                discoveredParameter.Value = DBNull.Value;
            }
            return discoveredParameters;
        }
        #endregion

        #region CloneParameters方法,复制一个参数数组副本
        private static SqlParameter[] CloneParameters(SqlParameter[] originalParameters)
        {
            SqlParameter[] clonedParameters = new SqlParameter[originalParameters.Length];

            for (int i = 0, j = originalParameters.Length; i < j; i++)
            {
                clonedParameters[i] = (SqlParameter)((ICloneable)originalParameters[i]).Clone();
            }

            return clonedParameters;
        }
        #endregion

        #region CacheParameterSet方法,将参数数组放入Cache,使用数据库连接字串,带参数
        public static void CacheParameterSet(String connectionString, String commandText, params SqlParameter[] commandParameters)
        {
            if (connectionString == null || connectionString.Length == 0) throw new ArgumentNullException("connectionString");
            if (commandText == null || commandText.Length == 0) throw new ArgumentNullException("commandText");

            String hashKey = connectionString + ":" + commandText;

            paramCache[hashKey] = commandParameters;
        }
        #endregion

        #region GetCachedParameterSet方法,将参数数组放入Cache,使用数据库连接字串,不带参数
        public static SqlParameter[] GetCachedParameterSet(String connectionString, String commandText)
        {
            if (connectionString == null || connectionString.Length == 0) throw new ArgumentNullException("connectionString");
            if (commandText == null || commandText.Length == 0) throw new ArgumentNullException("commandText");

            String hashKey = connectionString + ":" + commandText;

            SqlParameter[] cachedParameters = paramCache[hashKey] as SqlParameter[];
            if (cachedParameters == null)
            {
                return null;
            }
            else
            {
                return CloneParameters(cachedParameters);
            }
        }
        #endregion

        #region GetSpParameterSet方法,从Cache中获取存储过程参数数组,使用数据库连接字串,不带参数
        public static SqlParameter[] GetSpParameterSet(String connectionString, String spName)
        {
            return GetSpParameterSet(connectionString, spName, false);
        }
        #endregion

        #region GetSpParameterSet方法,从Cache中获取存储过程参数数组,使用数据库连接字串,提供存储过程是否返回参数结果
        public static SqlParameter[] GetSpParameterSet(String connectionString, String spName, bool includeReturnValueParameter)
        {
            if (connectionString == null || connectionString.Length == 0) throw new ArgumentNullException("connectionString");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                return GetSpParameterSetInternal(connection, spName, includeReturnValueParameter);
            }
        }
        #endregion

        #region GetSpParameterSet方法,从Cache中获取存储过程参数数组,使用Connection对象
        internal static SqlParameter[] GetSpParameterSet(SqlConnection connection, String spName)
        {
            return GetSpParameterSet(connection, spName, false);
        }
        #endregion

        #region GetSpParameterSet方法,从Cache中获取存储过程参数数组,使用Connection对象,提供存储过程是否返回参数结果
        internal static SqlParameter[] GetSpParameterSet(SqlConnection connection, String spName, bool includeReturnValueParameter)
        {
            if (connection == null) throw new ArgumentNullException("connection");
            using (SqlConnection clonedConnection = (SqlConnection)((ICloneable)connection).Clone())
            {
                return GetSpParameterSetInternal(clonedConnection, spName, includeReturnValueParameter);
            }
        }
        #endregion

        #region GetSpParameterSetInternal方法,获取存储过程参数,使用Connection对象,提供存储过程是否返回参数结果
        private static SqlParameter[] GetSpParameterSetInternal(SqlConnection connection, String spName, bool includeReturnValueParameter)
        {
            if (connection == null) throw new ArgumentNullException("connection");
            if (spName == null || spName.Length == 0) throw new ArgumentNullException("spName");

            String hashKey = connection.ConnectionString + ":" + spName + (includeReturnValueParameter ? ":include ReturnValue Parameter" : "");

            SqlParameter[] cachedParameters;

            cachedParameters = paramCache[hashKey] as SqlParameter[];
            if (cachedParameters == null)
            {
                SqlParameter[] spParameters = DiscoverSpParameterSet(connection, spName, includeReturnValueParameter);
                paramCache[hashKey] = spParameters;
                cachedParameters = spParameters;
            }

            return CloneParameters(cachedParameters);
        }
        #endregion
    }
}