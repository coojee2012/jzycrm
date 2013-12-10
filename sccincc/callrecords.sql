USE [hbpos7]
GO

/****** Object:  Table [dbo].[callrecords]    Script Date: 12/09/2013 22:01:59 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[callrecords](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[unid] [nvarchar](50) NULL,
	[cid] [nvarchar](50) NULL,
	[content] [nvarchar](max) NULL,
	[dostate] [int] NOT NULL,
	[donesth] [nvarchar](max) NULL,
	[agentname] [nvarchar](50) NULL,
	[exten] [nvarchar](50) NULL,
	[recordtime] [datetime] NULL,
	[updatetime] [datetime] NULL,
 CONSTRAINT [PK_callrecords] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[callrecords] ADD  CONSTRAINT [DF_callrecords_dostate]  DEFAULT ((-1)) FOR [dostate]
GO