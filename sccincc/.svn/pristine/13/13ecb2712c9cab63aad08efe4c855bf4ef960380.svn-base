#!/usr/bin/perl
use strict;
use FindBin qw($Bin);
use lib "$Bin/../lib/";
use Config::IniFiles;
use DBI;
use POSIX qw(strftime);

my $cmdstr=shift;
if(!defined$cmdstr || $cmdstr eq ''){$cmdstr="everyweek"};

my $cfg = Config::IniFiles->new( -file => "$Bin/../cyserver.conf" );

if($cmdstr=~/day/){$cfg->newval('mysqlbackup','dayback','1');}else{$cfg->newval('mysqlbackup','dayback','2');}
if($cmdstr=~/week/){$cfg->newval('mysqlbackup','weekback','1');}else{$cfg->newval('mysqlbackup','weekback','2');}
if($cmdstr=~/moh/){$cfg->newval('mysqlbackup','mohback','1');}else{$cfg->newval('mysqlbackup','mohback','2');}
 $cfg->WriteConfig("$Bin/../cyserver.conf");

