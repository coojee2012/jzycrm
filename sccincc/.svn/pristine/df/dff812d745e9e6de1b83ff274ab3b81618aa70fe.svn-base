#!/usr/bin/perl
use FindBin qw($Bin);
use lib "$Bin/../lib/";
use strict;
use File::Basename;
use POSIX 'WNOHANG';

# AUTO FLASH
$|=1;
# SIG
$SIG{CHLD}= sub { while ( waitpid(-1,WNOHANG)>0){}};


# CONFIG BASIC
my ($GENERAL_FILE,%GENERAL);
$GENERAL_FILE = "$Bin/../cyserver.conf";
if (!-e$GENERAL_FILE) {
	&error("Can't Read $GENERAL_FILE system abort.");
	exit(0);
}
%GENERAL=%{&config_parse($GENERAL_FILE)};

# PARSE CONFIG
my %PROCESSES=%{&config_parse("$Bin/../cydaemon.conf")};

if (&check_processes($GENERAL{'general'}{'cyserver_root'}.'/logs/cydaemon.pid',$0)) {
	&error("exists cydaemon. in memory, please restart by manual...");
	exit(0);
}

# INIT STARTUP
system("echo '$$' > ".$GENERAL{'general'}{'cyserver_root'}."/logs/cydaemon.pid");

# ONCE STARTUP
foreach  (keys %PROCESSES) {
	if (exists($PROCESSES{$_}{startup}) && $PROCESSES{$_}{script_start} ne '') {

		if ($PROCESSES{$_}{enable} ne 'yes') {
			&error("STARTUP ONCE DISABLED $PROCESSES{$_}{script_start}");
		} elsif ($PROCESSES{$_}{check_type} eq 'once') {
			&run_process($PROCESSES{$_}{script_start},$PROCESSES{$_}{daemon});
			&error("STARTUP ONCE $PROCESSES{$_}{script_start}");
			sleep(1);
		} elsif (!&check_processes($PROCESSES{$_}{script_pid},$PROCESSES{$_}{daemon})) {
			&run_process($PROCESSES{$_}{script_start},$PROCESSES{$_}{daemon});
			&error("STARTUP DAEMON $PROCESSES{$_}{script_start}");
			sleep(1);
		} else {
			&error("STARTUP DAEMON EXISTS $PROCESSES{$_}{script_start}");
		}

	}
	$PROCESSES{$_}{LAST_SECOFTIME} = time();
}


#------------------------------------------------------ FORK CHILED TO BACKEND RUN
my $twofish = fork();
# father process
if ($twofish!=0) {

	# INIT STARTUP
	system("echo '$twofish' > ".$GENERAL{'general'}{'cyserver_root'}."/logs/cydaemon.pid");
	exit(1);

# chiled process
} else {

	#------------------------------------------------------ BEGIN LOOP
	while (1) {
		# ALL PROCESSES
		foreach my $current_prc (keys %PROCESSES) {
			# TIMEOUT
			if (($PROCESSES{$current_prc}{LAST_SECOFTIME}+$PROCESSES{$current_prc}{per}) <= time()) {
				$PROCESSES{$current_prc}{LAST_SECOFTIME} = time();

				#-ONCE
				if ($PROCESSES{$current_prc}{check_type} eq 'once' && $PROCESSES{$current_prc}{enable} eq 'yes') {
					&run_process($PROCESSES{$current_prc}{script_start},$PROCESSES{$current_prc}{daemon});
					&error("ONCE $PROCESSES{$current_prc}{script_start}.");

				#-DAEMON IF NO EXISTS
				} elsif ($PROCESSES{$current_prc}{check_type} eq 'daemon' && $PROCESSES{$current_prc}{enable} eq 'yes') {
					if (!&check_processes($PROCESSES{$current_prc}{script_pid},$PROCESSES{$current_prc}{daemon})) {
						&run_process($PROCESSES{$current_prc}{script_start},$PROCESSES{$current_prc}{daemon});
						&error("DAEMON STARTUP $PROCESSES{$current_prc}{script_start}.");
					}

				}

			}
		}
		sleep(1); # stamp

		#check file command
		if (-e$GENERAL{'general'}{'cyserver_root'}.'/logs/cydaemon_restart') {
			unlink($GENERAL{'general'}{'cyserver_root'}.'/logs/cydaemon_restart');
			system('/etc/init.d/autocyserver restart');
		}
	}
	#------------------------------------------------------ END LOOP
}

exit(1);



#------------------------------------------------------ SUB FUNCTIONS
sub run_process
{
my	$command = shift;
my	$daemon = shift;
my      $waitbefor=shift;
my	$child = fork();
	if ($child == 0) {
		if ($daemon ne '') {
			system("killall $daemon > /dev/null 2>&1");
			system("killall $daemon > /dev/null 2>&1");
			sleep(1);
		}
		if(0+$waitbefor >0){
			sleep(0+$waitbefor);
		}
		system("$command");
		exit(1);
	}
return();
}

sub check_processes
{
my	$pid = shift;
my	$keyname = shift;
	return if ($pid eq '' && $keyname eq '');

my	$exists;

	#如果PID文件存在
	if (-e$pid) {
	my	$pid_number = `cat $pid`;		chomp($pid_number);

		#如果存在这个进程
		if (-e"/proc/$pid_number/cmdline") {
		my	$pid_cmdline = `cat /proc/$pid_number/cmdline`;
			chomp($pid_cmdline);
		my	$myname = basename($keyname);
			#如果这个进程的名字正好是指定的名字
			if ($pid_cmdline =~ /$myname/) {
				$exists = 1;
			#这个进程是其他进程(未启动)
			} else {
				$exists = 0;
			}

		#不存在这个进程(未启动)
		} else {
			$exists = 0;
		}
	}

return($exists);
}

sub config_parse
{
my	(%CONFIG,$last_section);

	open(CONF,"$_[0]") or die "Can't Open $_[0] : $!";
	while (<CONF>) {
		# trim 
		chomp($_);		$_ =~ s/\;(.*)//;
		next if ($_ eq '');

		if ($_ =~ /\[(.+)\]/) {
			$last_section=$1;
			$CONFIG{$last_section}={};
			next;
		}
		if ($_ =~ /(.+)\=(.+)/) {
		my	$key = $1;
		my	$value = $2;
			chomp($key);	$key =~ s/^\s+//;	$key =~ s/\s+$//;
			chomp($value);	$value =~ s/^\s+//;	$value =~ s/\s+$//;
			# NEW TRANS VALUE VARIABLE
			$value =~ s/\$CYROOT/$GENERAL{'general'}{'cyserver_root'}/g;
			$value =~ s/\/\//\//g;

			$CONFIG{$last_section}{$key}=$value;
		}
	}
	close(CONF);

return(\%CONFIG);
}

sub error
{
my	$msg = shift;
my	$time = localtime;

	if ($ARGV[0] eq '--logfile' || $ARGV[$#ARGV] eq '--verbose') {
		if (defined $GENERAL{'general'}{'cyserver_root'}) {
			open(SAVE,">>".$GENERAL{'general'}{'cyserver_root'}."/logs/cydaemon.log") 
				or die "Can't Write ".$GENERAL{'general'}{'cyserver_root'}."/logs/cydaemon.log : $!";
			print SAVE "[$time] $msg\n";
			close(SAVE);
		}
	}
	warn "[$time] $msg\n" if ($ARGV[0] eq '--verbose');
return();
}

1;