using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace test
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("开始测试");
            ServiceReference.JzyServiceClient sr = new ServiceReference.JzyServiceClient();
            //string aaa = sr.SendSMS("15308098290", "Everyone should take action with a dream and be strong with a reason .");
            sr.getCustom("");
            Console.WriteLine(sr.getCustom(""));
            Console.ReadLine();
        }
    }
}
