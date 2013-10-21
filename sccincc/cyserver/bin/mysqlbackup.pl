#!/usr/bin/perl


=head1

Author: Anthony Ettinger

License: GPL 2.0
URL: http://www.gnu.org/licenses/gpl.txt

Notes:

This script was originally written to function as a MySQL database backup
script in conjunction with the open source Perl/rsync backup program "rsnapshot".
rsnapshot can be found here: http://www.rsnapshot.org/

In order to backup a MySQL database remotely,
the necessary database user must be able
to connect remotely to the database server from
your IP number (some ISPs only allow access from localhost - you may need
to email your admin and ask for your ip to be given access)

It is extremely important that you secure the /etc/mysqlbackup file
so only YOU can read the file, 'chmod 0600 /etc/mysqlbackup',
as it will store the database passwords in plain text format.

=cut

use warnings;
use strict;
use Data::Dumper;
use DBI;
use POSIX qw(strftime);

#print "$ENV{PATH}";

## WARNING: type 'chmod 0600 /etc/mysqlbackup' ##
#file must contain 'username:password:host'
#one entry per line. Functionality is similar to /etc/passwd,
#however passwords are stored in plain text and NOT encrypted
my $mysqlbackup_passwd = '/etc/mysqlbackup';

#location of 'mysqldump' program (required)
my $mysqldump = '/usr/bin/mysqldump';
my $mysqlbackup_dir='/freeiris2/mysqlbackup/';

my $cmd=shift;

#$<=$>;
#$ENV{PATH}='/sbin;/usr/bin;/bin;';
my $dbname=shift;$dbname=~/(.*)/;$dbname=$1;
my $dbuser=shift;$dbuser=~/(.*)/;$dbuser=$1;
my $dbpwd=shift;$dbpwd=~/(.*)/;$dbpwd=$1;
my $dbhost=shift;$dbhost=~/(.*)/;$dbhost=$1;
my $backupType;
my $db_list=[];
push(@{$db_list},$dbname);
my $tobackfile;
my $upload_dir;

SWITCH:{
   if(!defined$cmd || $cmd eq '--help'){help();last SWITCH;}
   if($cmd eq '--backup') {
    $backupType=shift;$backupType=~/(.*)/;$backupType=$1;
    dump_databases($db_list,$dbuser,$dbpwd,$dbhost);
    last SWITCH;}
   if($cmd eq '--rback')  {
    $tobackfile=shift;$tobackfile=~/(.*)/;$tobackfile=$1;
    $upload_dir=shift;$upload_dir=~/(.*)/;$upload_dir=$1;
    reback($dbname,$dbuser,$dbpwd,$dbhost,$tobackfile,$upload_dir);
    last SWITCH;
    }
    
};
exit;
sub help{
  print qq~This vsion telecomm mysql backup and rebackup pragrame!
            For this help:  --help or (nothing input)
            For backup:     --backup
            For rback:      --rback filename\n~;  
    
    
}
=begin
sub main
{
	#check mode of $mysqlbackup_passwd file
	#my ($mode) = (stat($mysqlbackup_passwd))[2];
	#$mode = sprintf "%04o", $mode & 07777;

	#unless (-o $mysqlbackup_passwd && $mode eq '0600')
	#{
	#	die "Please secure '$mysqlbackup_passwd' file. Type 'chmod 0600 $mysqlbackup_passwd'.\n";
	#}

	#read in passwords from file
	read_passwd();
}

sub read_passwd
{
	open(PASSFILE, $mysqlbackup_passwd) or die "$!";

	while(<PASSFILE>)
	{
		chomp;
		my ($user, $pass, $host) = split(/:/);

		#retrieve databases with this user's privileges
		show_databases($user, $pass, $host);
	}

	close(PASSFILE);
}

sub show_databases
{
	my ($user, $pass, $host) = @_;
	my $db_list = []; #arrayref to store list of databases

	my $dbh = DBI->connect("dbi:mysql:host=$host", $user, $pass) or die DBI->errstr;

	#execute show databases query
	my $sth = $dbh->prepare("SHOW DATABASES") or die $dbh->errstr;
	$sth->execute() or die $dbh->errstr;

	#fetch results from query
	while (my $db_row = $sth->fetch)
	{
             push(@{$db_list}, $db_row->[0])  if($db_row->[0]=~/freeiris/);
		
	}

	dump_databases($db_list, $user, $pass, $host);
}
=cut
sub dump_databases
{      $<=$>;
      $ENV{PATH}='/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin';	
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

sub reback{
        my ($db,$user, $pass, $host,$filename,$file_dir)=@_;
        $<=$>;
      $ENV{PATH}='/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin';
        if(!defined$filename){die "There is no file to rebackup,are you sure,you are upload it!";}
        my $unzip_cmd="tar zxvf $file_dir/$filename.tar.gz";
        my $rback_cmd="mysql -u$user -p$pass $db<$filename.sql";
        my $rm_cmd="rm -rf $filename.sql";
        eval{
        system($unzip_cmd) == 0 or die "解压缩错误：$filename,$!";
        system($rback_cmd) == 0 or die "恢复数据库错误：$filename,$!";
        system($rm_cmd) == 0 or die "删除临时文件错误: $filename,$!";
        };
        if($@){print $@;}else{print "恭喜你：";}
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
    my $dbh = DBI->connect("dbi:mysql:database=$dbname;host=$dbhost", $dbuser, $dbpwd) or die DBI->errstr;
    my $sql="insert into dbbackup (backupTime,backupName,backupSize,backupPath,backType) values('";
       $sql.=$thistime."','".$filename."','".$filesize."','".$mysqlbackup_dir."','".$backupType."')";
    my $sth=$dbh->prepare($sql) or die $DBI::errstr;
           $sth->execute() or die $DBI::errstr;
           $sth->finish or die $DBI::errstr;
           $dbh->disconnect or die $DBI::errstr;
           };
  if($@){return "0"}else{return "1";}
}


sub nowtime {
my ( $s,$min,$h,$d,$m,$y ) = (localtime(time()))[0,1,2,3,4,5];
$y += 1900;
$m ++;
return sprintf("%4d-%02d-%02d %02d:%02d:%02d",$y,$m,$d,$h,$min,$s);
}
