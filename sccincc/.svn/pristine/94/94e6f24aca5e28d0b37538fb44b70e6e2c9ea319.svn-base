-- phpMyAdmin SQL Dump
-- version 3.3.5
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2011 年 04 月 19 日 15:24
-- 服务器版本: 5.0.77
-- PHP 版本: 5.2.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `freeiris2`
--

-- --------------------------------------------------------

--
-- 表的结构 `admin`
--

CREATE TABLE IF NOT EXISTS `admin` (
  `adminid` varchar(80) NOT NULL,
  `passwd` varchar(80) NOT NULL,
  `remark` varchar(255) NOT NULL default '',
  `level` varchar(255) NOT NULL default '4',
  `cretime` datetime NOT NULL default '0000-00-00 00:00:00',
  PRIMARY KEY  (`adminid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `ami_event`
--

CREATE TABLE IF NOT EXISTS `ami_event` (
  `id` int(16) NOT NULL auto_increment,
  `cretime` datetime NOT NULL default '0000-00-00 00:00:00',
  `event` varchar(255) default NULL,
  `event2` varchar(255) default NULL,
  `event3` varchar(255) default NULL,
  `event4` varchar(255) default NULL,
  PRIMARY KEY  (`id`),
  KEY `cretime` (`cretime`)
) ENGINE=MEMORY DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `autotables`
--

CREATE TABLE IF NOT EXISTS `autotables` (
  `tablename` varchar(50) NOT NULL,
  `fieldname` varchar(50) NOT NULL,
  `showname` varchar(50) NOT NULL,
  `fieldtype` varchar(50) NOT NULL,
  `typevalue` varchar(50) default NULL,
  `isuse` varchar(10) NOT NULL,
  `fieldwidth` varchar(50) NOT NULL default '100',
  `showorder` int(50) default NULL,
  `ispop` varchar(50) NOT NULL default 'yes',
  `ismust` varchar(20) NOT NULL default 'no',
  `issearch` varchar(20) NOT NULL default 'no',
  `isvtype` varchar(50) NOT NULL default 'no',
  `isone` varchar(30) NOT NULL default 'no',
  `isstatic` varchar(30) NOT NULL default 'no',
  `staticvalue` varchar(100) default NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `billinginvoice`
--

CREATE TABLE IF NOT EXISTS `billinginvoice` (
  `id` int(12) NOT NULL auto_increment,
  `cdrid` int(11) NOT NULL,
  `cretime` datetime NOT NULL,
  `calldate` datetime NOT NULL,
  `accountcode` varchar(255) default NULL,
  `src` varchar(80) NOT NULL default '',
  `dst` varchar(80) NOT NULL default '',
  `billsec` int(10) NOT NULL,
  `billroundsec` int(10) NOT NULL,
  `persecond` int(12) NOT NULL,
  `percost` double(24,6) NOT NULL,
  `cost` double(24,6) NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `accountcode` (`accountcode`),
  KEY `cdrid` (`cdrid`),
  KEY `calldate` (`calldate`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3383 ;

-- --------------------------------------------------------

--
-- 表的结构 `billinginvoice_history`
--

CREATE TABLE IF NOT EXISTS `billinginvoice_history` (
  `id` int(12) NOT NULL,
  `cdrid` int(11) NOT NULL,
  `cretime` datetime NOT NULL,
  `calldate` datetime NOT NULL,
  `accountcode` varchar(255) default NULL,
  `src` varchar(80) NOT NULL default '',
  `dst` varchar(80) NOT NULL default '',
  `billsec` int(10) NOT NULL,
  `billroundsec` int(10) NOT NULL,
  `persecond` int(12) NOT NULL,
  `percost` double(24,6) NOT NULL,
  `cost` double(24,6) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `billingrate`
--

CREATE TABLE IF NOT EXISTS `billingrate` (
  `id` int(12) NOT NULL auto_increment,
  `destnation` varchar(64) NOT NULL default '',
  `dst_prefix` varchar(64) NOT NULL,
  `persecond` int(12) NOT NULL default '60',
  `percost` double(24,4) NOT NULL default '0.0000',
  PRIMARY KEY  (`id`),
  KEY `dst_prefix` (`dst_prefix`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `callevent`
--

CREATE TABLE IF NOT EXISTS `callevent` (
  `extensionnumber` varchar(20) NOT NULL,
  `callernumber` varchar(50) default NULL,
  `callednumber` varchar(50) default NULL,
  `uid` varchar(20) default NULL,
  `creattime` datetime default NULL,
  `status` varchar(20) default NULL,
  `routerdype` int(10) NOT NULL default '0',
  `parked` varchar(20) NOT NULL,
  PRIMARY KEY  (`extensionnumber`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `callsession`
--

CREATE TABLE IF NOT EXISTS `callsession` (
  `id` varchar(32) NOT NULL,
  `accountcode` varchar(20) NOT NULL default '',
  `callernumber` varchar(64) NOT NULL default '',
  `extension` varchar(64) NOT NULL default '',
  `routerline` int(1) NOT NULL default '0',
  `cretime` datetime NOT NULL,
  `frist_cdruniqueid` varchar(64) NOT NULL default '',
  PRIMARY KEY  (`id`),
  KEY `accountcode` (`accountcode`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `callsession_acts`
--

CREATE TABLE IF NOT EXISTS `callsession_acts` (
  `actid` int(16) NOT NULL auto_increment,
  `callsessionid` varchar(64) NOT NULL,
  `cdruniqueid` varchar(64) NOT NULL default '',
  `acttime` datetime NOT NULL,
  `function` varchar(64) NOT NULL,
  `var0key` varchar(255) NOT NULL default '',
  `var0value` varchar(255) NOT NULL default '',
  `var1key` varchar(255) NOT NULL default '',
  `var1value` varchar(255) NOT NULL default '',
  `var2key` varchar(255) NOT NULL default '',
  `var2value` varchar(255) NOT NULL default '',
  `var3key` varchar(255) NOT NULL default '',
  `var3value` varchar(255) NOT NULL default '',
  `extradata` text NOT NULL,
  PRIMARY KEY  (`actid`),
  KEY `callsessionid` (`callsessionid`),
  KEY `cdruniqueid` (`cdruniqueid`),
  KEY `acttime` (`acttime`),
  KEY `function` (`function`),
  KEY `var0key` (`var0key`),
  KEY `var1key` (`var0key`),
  KEY `var2key` (`var0key`),
  KEY `var3key` (`var0key`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=918405 ;

-- --------------------------------------------------------

--
-- 表的结构 `callsession_acts_history`
--

CREATE TABLE IF NOT EXISTS `callsession_acts_history` (
  `actid` int(16) NOT NULL,
  `callsessionid` varchar(64) NOT NULL,
  `cdruniqueid` varchar(64) NOT NULL default '',
  `acttime` datetime NOT NULL,
  `function` varchar(64) NOT NULL,
  `var0key` varchar(255) NOT NULL default '',
  `var0value` varchar(255) NOT NULL default '',
  `var1key` varchar(255) NOT NULL default '',
  `var1value` varchar(255) NOT NULL default '',
  `var2key` varchar(255) NOT NULL default '',
  `var2value` varchar(255) NOT NULL default '',
  `var3key` varchar(255) NOT NULL default '',
  `var3value` varchar(255) NOT NULL default '',
  `extradata` text NOT NULL,
  PRIMARY KEY  (`actid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `callsession_history`
--

CREATE TABLE IF NOT EXISTS `callsession_history` (
  `id` varchar(32) NOT NULL,
  `accountcode` varchar(20) NOT NULL default '',
  `callernumber` varchar(64) NOT NULL default '',
  `extension` varchar(64) NOT NULL default '',
  `routerline` int(1) NOT NULL default '0',
  `cretime` datetime NOT NULL,
  `frist_cdruniqueid` varchar(64) NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `ccusers`
--

CREATE TABLE IF NOT EXISTS `ccusers` (
  `loginname` varchar(20) NOT NULL,
  `username` varchar(50) NOT NULL,
  `usercard` varchar(20) NOT NULL,
  `authlevel` varchar(20) NOT NULL,
  `userpwd` varchar(30) NOT NULL,
  `useraccount` varchar(30) NOT NULL,
  `usermemo` varchar(100) NOT NULL,
  `usercretime` datetime NOT NULL,
  `department` varchar(20) default '-1',
  `mobile` varchar(50) default NULL,
  `userid` int(30) NOT NULL auto_increment,
  `extPrefix` varchar(10) default NULL,
  `newmsgs` varchar(1000) default NULL,
  `oldmsgs` varchar(5000) default NULL,
  `usersex` int(10) NOT NULL default '1',
  PRIMARY KEY  (`userid`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=126 ;

-- --------------------------------------------------------

--
-- 表的结构 `cdr`
--

CREATE TABLE IF NOT EXISTS `cdr` (
  `id` int(11) NOT NULL auto_increment,
  `calldate` datetime NOT NULL default '0000-00-00 00:00:00',
  `clid` varchar(80) NOT NULL default '',
  `src` varchar(80) NOT NULL default '',
  `dst` varchar(80) NOT NULL default '',
  `dcontext` varchar(80) NOT NULL default '',
  `channel` varchar(80) NOT NULL default '',
  `dstchannel` varchar(80) NOT NULL default '',
  `lastapp` varchar(80) NOT NULL default '',
  `lastdata` varchar(80) NOT NULL default '',
  `duration` int(11) NOT NULL default '0',
  `billsec` int(11) NOT NULL default '0',
  `disposition` varchar(45) NOT NULL default '',
  `amaflags` int(11) NOT NULL default '0',
  `accountcode` varchar(20) NOT NULL default '',
  `userfield` varchar(255) NOT NULL default '',
  `uniqueid` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`id`),
  KEY `amaflags` (`amaflags`),
  KEY `calldate` (`calldate`),
  KEY `accountcode` (`accountcode`),
  KEY `dcontext` (`dcontext`),
  KEY `src` (`src`),
  KEY `dst` (`dst`),
  KEY `disposition` (`disposition`),
  KEY `uniqueid` (`uniqueid`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=594531 ;

-- --------------------------------------------------------

--
-- 表的结构 `cdr_history`
--

CREATE TABLE IF NOT EXISTS `cdr_history` (
  `id` int(11) NOT NULL,
  `calldate` datetime NOT NULL default '0000-00-00 00:00:00',
  `clid` varchar(80) NOT NULL default '',
  `src` varchar(80) NOT NULL default '',
  `dst` varchar(80) NOT NULL default '',
  `dcontext` varchar(80) NOT NULL default '',
  `channel` varchar(80) NOT NULL default '',
  `dstchannel` varchar(80) NOT NULL default '',
  `lastapp` varchar(80) NOT NULL default '',
  `lastdata` varchar(80) NOT NULL default '',
  `duration` int(11) NOT NULL default '0',
  `billsec` int(11) NOT NULL default '0',
  `disposition` varchar(45) NOT NULL default '',
  `amaflags` int(11) NOT NULL default '0',
  `accountcode` varchar(20) NOT NULL default '',
  `userfield` varchar(255) NOT NULL default '',
  `uniqueid` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `checkservice`
--

CREATE TABLE IF NOT EXISTS `checkservice` (
  `id` varchar(30) NOT NULL,
  `agtnum` varchar(20) NOT NULL,
  `point` varchar(10) NOT NULL,
  `crttime` datetime NOT NULL,
  `cdrid` varchar(30) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `conference`
--

CREATE TABLE IF NOT EXISTS `conference` (
  `id` int(12) NOT NULL auto_increment,
  `confno` varchar(32) NOT NULL,
  `pincode` varchar(32) NOT NULL default '',
  `playwhenevent` int(1) NOT NULL default '0',
  `mohwhenonlyone` int(1) NOT NULL default '0',
  `cretime` datetime NOT NULL default '0000-00-00 00:00:00',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `confno` (`confno`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

-- --------------------------------------------------------

--
-- 表的结构 `contactinfo`
--

CREATE TABLE IF NOT EXISTS `contactinfo` (
  `contactid` int(10) NOT NULL auto_increment,
  `customid` int(10) NOT NULL,
  `name` varchar(20) NOT NULL,
  `age` int(10) NOT NULL,
  `sex` varchar(10) NOT NULL,
  `QQ` varchar(20) NOT NULL,
  `MSN` varchar(30) NOT NULL,
  `mphone` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `zhiwei` varchar(20) NOT NULL,
  `memo` varchar(200) NOT NULL,
  `tphone` varchar(30) NOT NULL,
  `exten` varchar(20) character set latin1 default NULL,
  `creattime` date NOT NULL,
  PRIMARY KEY  (`contactid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=31 ;

-- --------------------------------------------------------

--
-- 表的结构 `custominfo`
--

CREATE TABLE IF NOT EXISTS `custominfo` (
  `id` int(11) NOT NULL auto_increment COMMENT 'ID',
  `item1` text,
  `item2` text,
  `item3` text,
  `item4` text,
  `item5` text,
  `item6` text,
  `item7` text,
  `item_auth` text,
  `item9` text,
  `item10` text,
  `item11` text,
  `item12` text,
  `item13` text,
  `item14` text,
  `item15` text,
  `item16` text,
  `item17` text,
  `item_date1` date default '0000-00-00',
  `item18` text,
  `item19` text,
  `item20` text,
  `item_date2` date default '0000-00-00',
  `item21` text,
  `item22` text,
  `item23` text,
  `item24` text,
  `item25` text,
  `item26` text,
  `item27` text,
  `item28` text,
  `item29` text,
  `item_datetime1` datetime default '0000-00-00 00:00:00',
  `item30` text,
  PRIMARY KEY  (`id`),
  FULLTEXT KEY `fax` (`item15`),
  FULLTEXT KEY `group` (`item9`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=114 ;

-- --------------------------------------------------------

--
-- 表的结构 `databook`
--

CREATE TABLE IF NOT EXISTS `databook` (
  `dbookid` int(11) NOT NULL auto_increment,
  `dbooktxt` varchar(30) NOT NULL,
  PRIMARY KEY  (`dbookid`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

-- --------------------------------------------------------

--
-- 表的结构 `dbbackup`
--

CREATE TABLE IF NOT EXISTS `dbbackup` (
  `backupID` int(100) NOT NULL auto_increment,
  `backupTime` datetime NOT NULL,
  `backupSize` varchar(50) NOT NULL,
  `backupName` varchar(50) NOT NULL,
  `backupPath` varchar(50) NOT NULL,
  `downloadMemo` varchar(50) NOT NULL,
  `restoreMemo` varchar(50) NOT NULL,
  `backType` varchar(20) NOT NULL,
  PRIMARY KEY  (`backupID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 COMMENT='记录数据库备份与恢复信息' AUTO_INCREMENT=419 ;

-- --------------------------------------------------------

--
-- 表的结构 `dbookchild`
--

CREATE TABLE IF NOT EXISTS `dbookchild` (
  `databookid` int(20) NOT NULL,
  `localtypetxt` varchar(30) NOT NULL,
  `localtypeid` int(20) NOT NULL auto_increment,
  `memo` varchar(50) NOT NULL,
  `ismutil` varchar(10) NOT NULL default '1',
  PRIMARY KEY  (`localtypeid`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=43 ;

-- --------------------------------------------------------

--
-- 表的结构 `extengroup`
--

CREATE TABLE IF NOT EXISTS `extengroup` (
  `groupid` int(4) NOT NULL,
  `groupname` varchar(20) NOT NULL,
  `remark` text,
  `cretime` datetime default NULL,
  PRIMARY KEY  (`groupid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `extengroup_assign`
--

CREATE TABLE IF NOT EXISTS `extengroup_assign` (
  `groupid` int(4) NOT NULL,
  `accountcode` varchar(20) NOT NULL,
  PRIMARY KEY  (`groupid`,`accountcode`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `extension`
--

CREATE TABLE IF NOT EXISTS `extension` (
  `accountcode` varchar(20) NOT NULL,
  `cretime` datetime default NULL,
  `password` varchar(32) NOT NULL default '',
  `deviceproto` varchar(32) NOT NULL,
  `devicenumber` varchar(32) NOT NULL,
  `devicestring` varchar(32) NOT NULL,
  `fristchecked` int(1) NOT NULL default '0',
  `transfernumber` varchar(32) NOT NULL default '',
  `dndinfo` varchar(10) NOT NULL default '',
  `diallocal_failed` varchar(64) NOT NULL default '',
  `info_name` varchar(100) NOT NULL default '',
  `info_email` varchar(30) default NULL,
  `info_detail` text,
  `info_remark` text,
  `doymicaccount` varchar(20) NOT NULL,
  PRIMARY KEY  (`accountcode`),
  KEY `devicenumber` (`devicenumber`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `faq`
--

CREATE TABLE IF NOT EXISTS `faq` (
  `faqid` int(11) NOT NULL auto_increment,
  `faqf` varchar(20) NOT NULL,
  `faqtitle` varchar(100) NOT NULL,
  `faqtext` varchar(10000) default NULL,
  `crtime` datetime NOT NULL,
  PRIMARY KEY  (`faqid`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=61 ;

-- --------------------------------------------------------

--
-- 表的结构 `faxqueue`
--

CREATE TABLE IF NOT EXISTS `faxqueue` (
  `id` int(12) NOT NULL auto_increment,
  `accountcode` varchar(20) NOT NULL default '',
  `number` varchar(255) NOT NULL default '',
  `filename` varchar(255) NOT NULL,
  `cretime` datetime default NULL,
  `mode` int(1) NOT NULL,
  `status` int(1) NOT NULL default '0',
  `retry` int(1) NOT NULL default '0',
  `sendannounce` int(1) NOT NULL default '3',
  `mailprocessed` int(1) NOT NULL default '0',
  `fax_status` varchar(255) NOT NULL default '',
  `fax_statusstr` varchar(255) NOT NULL default '',
  `fax_error` varchar(255) NOT NULL default '',
  `fax_pages` varchar(255) NOT NULL default '',
  `fax_bitrate` varchar(255) NOT NULL default '',
  `fax_remotestationid` varchar(255) NOT NULL default '',
  `fax_resolution` varchar(255) NOT NULL default '',
  `fax_ecm` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`id`),
  KEY `accountcode` (`accountcode`),
  KEY `mode` (`mode`),
  KEY `status` (`status`),
  KEY `mailprocessed` (`mailprocessed`),
  KEY `cretime` (`cretime`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `forlostnum`
--

CREATE TABLE IF NOT EXISTS `forlostnum` (
  `lostcallid` int(11) NOT NULL auto_increment,
  `extension` varchar(20) NOT NULL default '',
  `lostnumber` varchar(20) default NULL,
  `certime` datetime NOT NULL default '0000-00-00 00:00:00',
  `reback` varchar(10) default NULL,
  `whoback` varchar(20) NOT NULL,
  `backtime` datetime NOT NULL,
  KEY `lostcallid` (`lostcallid`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=742 ;

-- --------------------------------------------------------

--
-- 表的结构 `hasnoticed`
--

CREATE TABLE IF NOT EXISTS `hasnoticed` (
  `pushcount` varchar(20) NOT NULL,
  `ancid` varchar(20) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `ivraction`
--

CREATE TABLE IF NOT EXISTS `ivraction` (
  `id` int(12) NOT NULL auto_increment,
  `ivrnumber` varchar(32) NOT NULL,
  `ordinal` int(12) NOT NULL default '0',
  `actmode` int(2) NOT NULL,
  `args` text NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=53 ;

-- --------------------------------------------------------

--
-- 表的结构 `ivrmenu`
--

CREATE TABLE IF NOT EXISTS `ivrmenu` (
  `id` int(12) NOT NULL auto_increment,
  `ivrnumber` varchar(32) NOT NULL,
  `ivrname` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `cretime` datetime NOT NULL default '0000-00-00 00:00:00',
  `readonly` int(1) NOT NULL default '0',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `ivrnumber` (`ivrnumber`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=25 ;

-- --------------------------------------------------------

--
-- 表的结构 `ivruserinput`
--

CREATE TABLE IF NOT EXISTS `ivruserinput` (
  `id` int(12) NOT NULL auto_increment,
  `ivrnumber` varchar(32) NOT NULL,
  `general` int(1) NOT NULL default '0',
  `general_type` varchar(255) NOT NULL default '',
  `general_args` varchar(255) NOT NULL default '',
  `input` varchar(32) NOT NULL default '',
  `gotoivrnumber` varchar(32) NOT NULL,
  `gotoivractid` varchar(12) NOT NULL default '',
  PRIMARY KEY  (`id`),
  KEY `ivrnumber` (`ivrnumber`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=102 ;

-- --------------------------------------------------------

--
-- 表的结构 `leftmenmu`
--

CREATE TABLE IF NOT EXISTS `leftmenmu` (
  `menmuid` int(20) NOT NULL auto_increment,
  `menmuname` varchar(50) NOT NULL,
  `fmid` int(20) NOT NULL default '-1',
  `maddr` varchar(100) NOT NULL,
  `menmucls` varchar(30) NOT NULL,
  `bgicos` varchar(30) NOT NULL,
  PRIMARY KEY  (`menmuid`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=57 ;

-- --------------------------------------------------------

--
-- 表的结构 `localnumber`
--

CREATE TABLE IF NOT EXISTS `localnumber` (
  `number` varchar(32) NOT NULL,
  `typeof` varchar(255) NOT NULL default '',
  `assign` varchar(255) NOT NULL,
  PRIMARY KEY  (`number`,`assign`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `notice`
--

CREATE TABLE IF NOT EXISTS `notice` (
  `ancid` int(20) NOT NULL auto_increment,
  `anctitle` varchar(20) NOT NULL,
  `ancnote` varchar(100) NOT NULL,
  `anctype` varchar(20) NOT NULL,
  `ancauth` varchar(20) NOT NULL,
  `anccretime` datetime NOT NULL,
  `pushtime` datetime NOT NULL,
  `isanc` varchar(10) NOT NULL,
  PRIMARY KEY  (`ancid`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

-- --------------------------------------------------------

--
-- 表的结构 `outgoing`
--

CREATE TABLE IF NOT EXISTS `outgoing` (
  `id` int(12) NOT NULL auto_increment,
  `name` varchar(255) NOT NULL,
  `concurrent` int(4) NOT NULL default '1',
  `outgoing_callerid` varchar(32) NOT NULL default '',
  `outgoing_waittime` int(10) NOT NULL default '30',
  `numbercount` int(10) NOT NULL,
  `calledcount` int(10) NOT NULL default '0',
  `cretime` datetime NOT NULL default '0000-00-00 00:00:00',
  `startime` datetime NOT NULL,
  `localnumber` varchar(32) NOT NULL,
  `tune` int(1) NOT NULL default '0',
  PRIMARY KEY  (`id`),
  KEY `startime` (`startime`),
  KEY `tune` (`tune`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `outgoing_members`
--

CREATE TABLE IF NOT EXISTS `outgoing_members` (
  `id` int(12) NOT NULL auto_increment,
  `outgoingid` int(12) NOT NULL,
  `number` varchar(64) NOT NULL,
  `status` int(1) NOT NULL default '0',
  PRIMARY KEY  (`id`),
  KEY `status` (`status`),
  KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `popaddr`
--

CREATE TABLE IF NOT EXISTS `popaddr` (
  `yesorno` varchar(20) NOT NULL,
  `addr` varchar(100) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `queue`
--

CREATE TABLE IF NOT EXISTS `queue` (
  `id` int(12) NOT NULL auto_increment,
  `queuenumber` varchar(32) NOT NULL,
  `queuename` varchar(255) NOT NULL,
  `announce` varchar(255) NOT NULL default '',
  `playring` int(1) NOT NULL default '0',
  `saymember` int(1) NOT NULL default '0',
  `queuetimeout` int(11) NOT NULL default '300',
  `failedon` varchar(255) NOT NULL,
  `members` text NOT NULL,
  `cretime` datetime NOT NULL default '0000-00-00 00:00:00',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `queuenumber` (`queuenumber`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

-- --------------------------------------------------------

--
-- 表的结构 `recordfiles`
--

CREATE TABLE IF NOT EXISTS `recordfiles` (
  `id` int(12) NOT NULL auto_increment,
  `filename` varchar(100) NOT NULL,
  `extname` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL,
  `associate` varchar(100) NOT NULL,
  `calltype` varchar(20) NOT NULL,
  `extennum` varchar(20) NOT NULL,
  `folder` varchar(20) NOT NULL,
  `doymicac` varchar(20) NOT NULL,
  KEY `id` (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=114158 ;

-- --------------------------------------------------------

--
-- 表的结构 `roleauth`
--

CREATE TABLE IF NOT EXISTS `roleauth` (
  `roleid` varchar(10) NOT NULL,
  `roledesc` varchar(50) NOT NULL,
  `menmuauth` varchar(100) NOT NULL,
  `optionauth` varchar(50) NOT NULL,
  UNIQUE KEY `roleid` (`roleid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `router`
--

CREATE TABLE IF NOT EXISTS `router` (
  `id` int(12) NOT NULL auto_increment,
  `proirety` int(12) NOT NULL default '0',
  `createmode` int(1) NOT NULL default '0',
  `routerline` int(1) NOT NULL default '0',
  `routername` varchar(255) NOT NULL default '',
  `optextra` varchar(255) default NULL,
  `lastwhendone` int(1) NOT NULL default '0',
  `match_callergroup` varchar(255) NOT NULL default '',
  `match_callerid` varchar(255) NOT NULL default '',
  `match_callerlen` varchar(255) NOT NULL default '',
  `match_callednum` varchar(255) NOT NULL default '',
  `match_calledlen` varchar(255) NOT NULL default '',
  `replace_callerid` varchar(255) NOT NULL default '',
  `replace_calledtrim` varchar(255) NOT NULL default '',
  `replace_calledappend` varchar(255) NOT NULL default '',
  `process_mode` int(4) NOT NULL default '0',
  `process_defined` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20 ;

-- --------------------------------------------------------

--
-- 表的结构 `serassess`
--

CREATE TABLE IF NOT EXISTS `serassess` (
  `serviceid` int(11) NOT NULL,
  `memo` varchar(200) NOT NULL,
  `assesser` varchar(20) NOT NULL,
  `crtime` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `servicenote`
--

CREATE TABLE IF NOT EXISTS `servicenote` (
  `callsessionID` varchar(30) NOT NULL,
  `customid` varchar(20) NOT NULL,
  `item1` text,
  `item_datetime1` datetime default '0000-00-00 00:00:00',
  `item_auth` text,
  `item2` text,
  `item3` text,
  `item4` text,
  `serviceid` int(20) NOT NULL auto_increment,
  `item5` text,
  `item7` text,
  `item8` text,
  `item9` text,
  `item10` text,
  PRIMARY KEY  (`serviceid`),
  UNIQUE KEY `callsessionID` (`callsessionID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=70 ;

-- --------------------------------------------------------

--
-- 表的结构 `shortcut`
--

CREATE TABLE IF NOT EXISTS `shortcut` (
  `useraccount` varchar(30) NOT NULL,
  `menmuids` varchar(30) NOT NULL,
  PRIMARY KEY  (`useraccount`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的结构 `sysautomontrigger`
--

CREATE TABLE IF NOT EXISTS `sysautomontrigger` (
  `id` int(12) NOT NULL auto_increment,
  `triggername` varchar(255) NOT NULL,
  `recordout` int(1) NOT NULL default '0',
  `recordin` int(1) NOT NULL default '0',
  `recordqueue` int(1) NOT NULL default '0',
  `keepfortype` int(1) NOT NULL default '0',
  `keepforargs` varchar(255) NOT NULL default '',
  `members` text NOT NULL,
  `cretime` datetime default NULL,
  PRIMARY KEY  (`id`),
  KEY `recordout` (`recordout`),
  KEY `recordin` (`recordin`),
  KEY `recordqueue` (`recordqueue`),
  KEY `cretime` (`cretime`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

-- --------------------------------------------------------

--
-- 表的结构 `trunk`
--

CREATE TABLE IF NOT EXISTS `trunk` (
  `id` int(12) NOT NULL auto_increment,
  `trunkname` varchar(255) NOT NULL,
  `trunkproto` varchar(32) NOT NULL,
  `trunkprototype` varchar(32) NOT NULL,
  `trunkdevice` varchar(100) NOT NULL,
  `trunkremark` text,
  `cretime` datetime default NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `trunkname` (`trunkname`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

-- --------------------------------------------------------

--
-- 表的结构 `voicefiles`
--

CREATE TABLE IF NOT EXISTS `voicefiles` (
  `id` int(12) NOT NULL auto_increment,
  `filename` varchar(255) NOT NULL,
  `extname` varchar(255) NOT NULL default '',
  `folder` varchar(255) NOT NULL default '',
  `cretime` datetime default NULL,
  `description` varchar(255) NOT NULL default '',
  `label` varchar(32) NOT NULL,
  `associate` varchar(255) NOT NULL default '',
  `args` varchar(255) NOT NULL default '',
  `readonly` int(1) NOT NULL default '0',
  `mailprocessed` int(1) NOT NULL default '0',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `label` (`label`,`folder`,`filename`),
  KEY `cretime` (`cretime`),
  KEY `mailprocessed` (`mailprocessed`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=89 ;
