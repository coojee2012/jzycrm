var myvalite={};
myvalite.isalphanumber=function isalphanumber(str) 
{ 
var result=str.match(/^[a-zA-Z0-9]+$/); 
if(result==null) return false; 
return true; 
} 

// 判断输入是否是一个数字--(数字包含小数)-- 
myvalite.isnumber=function isnumber(str) 
{ 
return !isNaN(str); 
} 


// 判断输入是否是一个整数 
myvalite.isint=function isint(str) 
{ 
var result=str.match(/^(-|\+)?\d+$/); 
if(result==null) return false; 
return true; 
} 


// 判断输入是否是有效的长日期格式 - "YYYY-MM-DD HH:MM:SS" || "YYYY/MM/DD HH:MM:SS" 
myvalite.isdatetime=function isdatetime(str) 
{ 
var result=str.match(/^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/); 
if(result==null) return false; 
var d= new Date(result[1], result[3]-1, result[4], result[5], result[6], result[7]); 
return (d.getFullYear()==result[1]&&(d.getMonth()+1)==result[3]&&d.getDate()==result[4]&&d.getHours()==result[5]&&d.getMinutes()==result[6]&&d.getSeconds()==result[7]); 
} 


// 检查是否为 YYYY-MM-DD || YYYY/MM/DD 的日期格式 
myvalite.isdate=function isdate(str){ 
var result=str.match(/^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2})$/); 
if(result==null) return false; 
var d=new Date(result[1], result[3]-1, result[4]); 
return (d.getFullYear()==result[1] && d.getMonth()+1==result[3] && d.getDate()==result[4]); 
} 


// 判断输入是否是有效的电子邮件 
myvalite.isemail=function isemail(str) 
{ 
var result=str.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/); 
if(result==null) return false; 
return true; 
} 


// 去除字符串的首尾的空格 
myvalite.trim=function trim(str){ 
return str.replace(/(^\s*)|(\s*$)/g, ""); 
} 


// 返回字符串的实际长度, 一个汉字算2个长度 
myvalite.strlen=function strlen(str){ 
return str.replace(/[^\x00-\xff]/g, "**").length; 
} 


//匹配中国邮政编码(6位) 
myvalite.ispostcode=function ispostcode(str) 
{ 
var result=str.match(/[1-9]\d{5}(?!\d)/); 
if(result==null) return false; 
return true; 
} 
//匹配国内电话号码(0511-4405222 或 021-87888822) 
myvalite.ispostcode=function istell(str) 
{ 
var result=str.match(/\d{3}-\d{8}|\d{4}-\d{7}/); 
if(result==null) return false; 
return true; 
} 

//校验是否为(0-10000)的整数 
myvalite.ispostcode=function isint1(str) 
{ 
var result=str.match(/^[0-9]$|^([1-9])([0-9]){0,3}$|^10000$/); 
if(result==null) return false; 
return true; 
} 


//匹配腾讯QQ号 
myvalite.isqq=function isqq(str) 
{ 
var result=str.match(/[1-9][0-9]{4,}/); 
if(result==null) return false; 
return true; 
} 


//匹配身份证(15位或18位) 
myvalite.isidcard=function isidcard(str) 
{ 
var result=str.match(/\d{15}|\d{18}/); 
if(result==null) return false; 
return true; 
} 

module.exports = myvalite;

