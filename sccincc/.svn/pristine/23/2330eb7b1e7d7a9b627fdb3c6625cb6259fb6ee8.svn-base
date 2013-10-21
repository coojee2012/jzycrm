#!/usr/bin/perl 
use strict;
my $cmdstr=shift;
if(!defined$cmdstr || $cmdstr eq ''){print "对不起，你根本没有给我下达任何指令！";exit;};
$cmdstr=~/(.*)/;$cmdstr=$1;
if($cmdstr eq 'restartnetwork'){
 $cmdstr="service network restart";
 my $reslut=runcmd($cmdstr);
      if($reslut eq 'sucess'){
        print "执行成功！";
        }else{print "执行失败！";}  
}
if($cmdstr eq 'webserver'){
    
    $cmdstr="httpd -k restart";
my $reslut=runcmd($cmdstr);
      if($reslut eq 'sucess'){
           print "执行成功！";
        }else{print "执行失败！";}
}
if($cmdstr eq 'pbxserver'){
    
    $cmdstr="asterisk -rx 'restart now'";
 my $reslut=runcmd($cmdstr);
      if($reslut eq 'sucess'){
        print "执行成功！";
        }else{print "执行失败！";}
}

if($cmdstr eq 'sysreboot'){
    
    $cmdstr="reboot";
   my $reslut=runcmd($cmdstr);
      if($reslut eq 'sucess'){
        print "执行成功！";
        }else{print "执行失败！";}
    
}
sub runcmd{
my $cmdstring=shift;
$<=$>;
$ENV{PATH}='/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin';
eval{system($cmdstring) == 0 or die $!;};if($@){return 'error';}else{return 'sucess';}
}
    
exit;



