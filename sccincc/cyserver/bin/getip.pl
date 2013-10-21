#!/usr/bin/perl -w
# Create a user agent object
  use LWP::UserAgent;
  my $ua = LWP::UserAgent->new;
  $ua->agent("MyApp/0.1 ");

  # Create a request
  my $req = HTTP::Request->new(POST => 'http://125.64.213.31/Admin/GetIp.aspx?save=save&id=100&name=JZY');
  $req->content_type('application/x-www-form-urlencoded');
  $req->content('query=libwww-perl&mode=dist');

  # Pass request to the user agent and get a response back
  while(1){
  my $res = $ua->request($req);
  my $timenow=nowtime();
  # Check the outcome of the response
  if ($res->is_success) {
      if(-e 'sendip.log'){
        open (SENDIP,'>>sendip.log') or die 'can not open log files';
        print SENDIP "OK,$timenow \n";
        close(SENDIP) or die 'close file error';
      }else{
        open(SENDIP,">sendip.log") or die 'can not open log files';
        print SENDIP "OK,$timenow \n";
        close(SENDIP) or die 'close file error';
        system("chmod 777 sendip.log")==0 or die $!;
      }
      #print "OK";
      #print $res->content;
  }
  else {
        if(-e 'sendip.log'){
        open (SENDIP,'>>sendip.log') or die 'can not open log files';
        print SENDIP $res->status_line,$timenow ,"\n";
        close(SENDIP) or die 'close file error';
      }else{
        open(SENDIP,">sendip.log") or die 'can not open log files';
        print SENDIP $res->status_line,$timenow ,"\n";
        close(SENDIP) or die 'close file error';
        system("chmod 777 sendip.log")==0 or die $!;
      }
      #print $res->status_line, "\n";
  }
  sleep(600);
  }
sub nowtime {
my ( $s,$min,$h,$d,$m,$y ) = (localtime(time()))[0,1,2,3,4,5];
$y += 1900;
$m ++;
return sprintf("%4d-%02d-%02d %02d:%02d:%02d",$y,$m,$d,$h,$min,$s);
}
