#!/usr/bin/perl -w
use strict;
use FindBin qw($Bin);
use lib "$Bin/../lib/";
use Config::IniFiles;
use Socket;
use Data::Dumper;
use DBI;
use POSIX qw(strftime);

my (%VSION_GENERAL);
#global configure
tie %VSION_GENERAL, 'Config::IniFiles', ( -file => "$Bin/../cyserver.conf" );

# Config;
my $log_life = 180;
my $mysqldump = $VSION_GENERAL{'mysqlbackup'}{'dump'};
my $mysqlbackup_dir=$VSION_GENERAL{'mysqlbackup'}{'backupdir'};

my $db_list=[];
push(@{$db_list},$VSION_GENERAL{'database'}{'dbname'});
my $dbhost=$VSION_GENERAL{'database'}{'dbhost'};
my $dbport=$VSION_GENERAL{'database'}{'dbport'};
my $dbuser=$VSION_GENERAL{'database'}{'dbuser'};
my $dbpasswd=$VSION_GENERAL{'database'}{'dbpasswd'};
my $backupType="";
# AUTO FLASH
$|=1;


# PID
system("echo '$$' > ".$VSION_GENERAL{'general'}{'cyserver_root'}."/logs/mysqltt.pid");

#CONNECT MYSQL SERVER
my $dbh = &connect_mysql(dbname=>$VSION_GENERAL{'database'}{'dbname'},
						dbhost=>$VSION_GENERAL{'database'}{'dbhost'},
						dbport=>$VSION_GENERAL{'database'}{'dbport'},
						dbuser=>$VSION_GENERAL{'database'}{'dbuser'},
						dbpasswd=>$VSION_GENERAL{'database'}{'dbpasswd'},
						dbsock=>$VSION_GENERAL{'database'}{'dbsock'});


while(1){
my ( $sec,$min,$hour,$mday,$mon,$year,$wday,$yday ) = localtime(time());
$mon++;
$year+= 1900;
if(defined$VSION_GENERAL{'mysqlbackup'}{'dayback'} and $VSION_GENERAL{'mysqlbackup'}{'dayback'} eq '1'){
    if($hour eq '3'){
      $backupType="每日备份";
      dump_databases($db_list, $dbuser, $dbpasswd, $dbhost);  
        
    }
    
    
    }

if(defined$VSION_GENERAL{'mysqlbackup'}{'weekback'} and $VSION_GENERAL{'mysqlbackup'}{'weekback'} eq '1'){
    if($wday eq '1' and $hour eq '3'){
      $backupType="每周备份";
      dump_databases($db_list, $dbuser, $dbpasswd, $dbhost);  
        
    }
    
    
    }
if(defined$VSION_GENERAL{'mysqlbackup'}{'mohback'} and $VSION_GENERAL{'mysqlbackup'}{'mohback'} eq '1'){
    if($mday eq '1' and $hour eq '3'){
      $backupType="每月备份";
      dump_databases($db_list, $dbuser, $dbpasswd, $dbhost);  
        
    }
    
    
    }
#test
if(defined$VSION_GENERAL{'mysqlbackup'}{'mohback'} and $VSION_GENERAL{'mysqlbackup'}{'mohback'} eq '1'){
    if($wday eq '5' and $hour eq '11'){
      $backupType="手动备份";
      dump_databases($db_list, $dbuser, $dbpasswd, $dbhost);
      }
}
 print    "秒:".$sec,"分:".$min,"时:".$hour,"日:".$mday,"月:".$mon,"年:".$year,"周:".$wday,"日:".$yday;
 print "\n";
  sleep(60);  
}



sub dump_databases
{      	
        my ($db_list, $user, $pass, $host) = @_;
        
	my $timestamp = strftime "%F-%H.%M", localtime;

	foreach my $db (@{$db_list})
	{
		my $filename = "$timestamp-$host-vsion";
		my $dump_cmd = "$mysqldump -u $user -p$pass -h $host --opt $db > $filename.sql";
		my $tar_cmd = "tar czf $filename.tar.gz $filename.sql";
		my $rm_cmd = "rm $filename.sql";
                my $mv_cmd ="mv $filename.tar.gz $mysqlbackup_dir";
		#print "Backing up $db from $host\n";
                eval{
		system($dump_cmd) == 0 or die "$!";
		system($tar_cmd) == 0 or die "$!";
		system($rm_cmd) == 0 or die "$!";
                system($mv_cmd) == 0 or die "$!";
                };if($@){print "执行备份操作出现错误：$@";}
                else{
                   if(insertdb($filename)) {print "备份成功！请尽快下载到本地备份计算机上！";}
                   else{print "备份已经完成，但更新备份日志出现错误！";}
                }
        #tar czf $db.$DATE.tar.gz $FILE
        }
}

sub connect_mysql
{
my	%info = @_;
my	$dbh = DBI->connect("DBI:mysql:database=$info{'dbname'};host=$info{'dbhost'};port=$info{'dbport'};mysql_socket=$info{'dbsock'}",$info{'dbuser'},
			$info{'dbpasswd'}) or die "Can't Connect Database Server: $!";
return($dbh);
}

sub insertdb{
    my $filename=shift;
    chomp($filename);
    chomp($mysqlbackup_dir);
          use integer;
        my $thistime=nowtime();
        my $fileallname="$mysqlbackup_dir$filename.tar.gz";
        my $filesize=-s $fileallname;
           $filesize=$filesize/1024;
  eval{
  
    my $sql="insert into dbbackup (backupTime,backupName,backupSize,backupPath,backType) values('";
       $sql.=$thistime."','".$filename."','".$filesize."','".$mysqlbackup_dir."','".$backupType."')";
    my $sth=$dbh->prepare($sql) or die $DBI::errstr;
           $sth->execute() or die $DBI::errstr;
           $sth->finish or die $DBI::errstr;
          
           };
  if($@){return "0"}else{return "1";}
}

$dbh->disconnect or die $DBI::errstr;

sub nowtime {
my ( $s,$min,$h,$d,$m,$y ) = (localtime(time()))[0,1,2,3,4,5];
$y += 1900;
$m ++;
return sprintf("%4d-%02d-%02d %02d:%02d:%02d",$y,$m,$d,$h,$min,$s);
}