#!/usr/bin/perl
use warnings;
use strict;
use Data::Dumper;
use POSIX qw(strftime);

my $filename=shift;
if($filename=~/(.*vsion\.tar\.gz)/){$filename=$1;}
else{print "No such file!";exit;}
	
my $cmd="rm -r $filename";
$<=$>;
$ENV{PATH}='/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin';
eval{
system($cmd) == 0 or die "$!";
};if($@){print $@;}else
{print "sucess!"}
