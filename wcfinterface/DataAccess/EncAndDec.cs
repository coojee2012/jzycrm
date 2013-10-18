using System;
using System.Text;
using System.Globalization;
using System.Security.Cryptography;

namespace DataAccess
{
    /// <summary>
    /// EncryptDB ��ժҪ˵����
    /// </summary>
    public class EncAndDec
    {
        public EncAndDec()
        {
            //
            // TODO: �ڴ˴���ӹ��캯���߼�
            //
        }

        /// <summary>
        /// ʹ��ȱʡ��Կ�ַ�������
        /// </summary>
        /// <param name="original">����</param>
        /// <returns>����</returns>
        public static string Encrypt(string original)
        {
            if (original.Trim() == "") return "";
            return Encrypt(original, "SICHUANEXPERT");
        }

        /// <summary>
        /// ʹ�ø�����Կ����
        /// </summary>
        /// <param name="original">ԭʼ����</param>
        /// <param name="key">��Կ</param>
        /// <param name="encoding">�ַ����뷽��</param>
        /// <returns>����</returns>
        public static string Encrypt(string original, string key)
        {
            byte[] buff = System.Text.Encoding.Default.GetBytes(original);
            byte[] kb = System.Text.Encoding.Default.GetBytes(key);
            return Convert.ToBase64String(Encrypt(buff, kb));
        }

        /// <summary>
        /// ʹ�ø�����Կ����
        /// </summary>
        /// <param name="original">����</param>
        /// <param name="key">��Կ</param>
        /// <returns>����</returns>
        public static byte[] Encrypt(byte[] original, byte[] key)
        {
            TripleDESCryptoServiceProvider des = new TripleDESCryptoServiceProvider();
            des.Key = MakeMD5(key);
            des.Mode = CipherMode.ECB;

            return des.CreateEncryptor().TransformFinalBlock(original, 0, original.Length);
        }

        /// <summary>
        /// ʹ��ȱʡ��Կ����
        /// </summary>
        /// <param name="original">����</param>
        /// <returns>����</returns>
        public static string Decrypt(string original)
        {
            if (original.Trim() == "") return "";
            return Decrypt(original, "SICHUANEXPERT", System.Text.Encoding.Default);
        }

        /// <summary>
        /// ʹ�ø�����Կ����
        /// </summary>
        /// <param name="encrypted">����</param>
        /// <param name="key">��Կ</param>
        /// <param name="encoding">�ַ����뷽��</param>
        /// <returns>����</returns>
        public static string Decrypt(string encrypted, string key, Encoding encoding)
        {
            byte[] buff = Convert.FromBase64String(encrypted);
            byte[] kb = System.Text.Encoding.Default.GetBytes(key);
            return encoding.GetString(Decrypt(buff, kb));
        }

        /// <summary>
        /// ʹ�ø�����Կ��������
        /// </summary>
        /// <param name="encrypted">����</param>
        /// <param name="key">��Կ</param>
        /// <returns>����</returns>
        public static byte[] Decrypt(byte[] encrypted, byte[] key)
        {
            TripleDESCryptoServiceProvider des = new TripleDESCryptoServiceProvider();
            des.Key = MakeMD5(key);
            des.Mode = CipherMode.ECB;

            return des.CreateDecryptor().TransformFinalBlock(encrypted, 0, encrypted.Length);
        }

        /// <summary>
        /// ����MD5ժҪ
        /// </summary>
        /// <param name="original">����Դ</param>
        /// <returns>ժҪ</returns>
        public static byte[] MakeMD5(byte[] original)
        {
            MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
            byte[] keyhash = hashmd5.ComputeHash(original);
            hashmd5 = null;
            return keyhash;
        }
    }
}