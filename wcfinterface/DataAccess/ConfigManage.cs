using System;
using System.Configuration;
using System.Runtime.InteropServices;
using System.Text;

namespace DataAccess
{
    /// <summary>
    /// ConfigManage ��ժҪ˵����
    /// </summary>
    public class ConfigManage
    {
        public ConfigManage()
        {
            //
            // TODO: �ڴ˴���ӹ��캯���߼�
            //
        }

        [DllImport("kernel32")]
        public static extern int GetPrivateProfileString(string section, string key, string def, StringBuilder retVal, int size, string filePath);

        [DllImport("kernel32")]
        public static extern long WritePrivateProfileString(string section, string key, string val, string filePath);

        public static string IniReadValue(string filename, string Section, string Key)
        {
            StringBuilder temp = new StringBuilder(255);
            int i = GetPrivateProfileString(Section, Key, "", temp, 255, filename);
            return temp.ToString();
        }
    }
}
