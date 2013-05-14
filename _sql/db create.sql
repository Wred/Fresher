USE [Sparks]
GO
/****** Object:  Table [dbo].[CMSLanguage]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSLanguage](
	[ID] [smallint] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[Prefix] [nvarchar](2) NULL,
 CONSTRAINT [PK_BLOBLang] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSPage]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSPage](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[IDParent] [int] NOT NULL,
		[IDStructure] [int] NOT NULL,
	[OrderNumber] [int] NOT NULL,
	[IDElementTemplate] [int] NULL,
	[IDElementName] [int] NULL,
	[Reference] [nvarchar](20) NULL,
	[IDUserCreated] [int] NULL,
	[IDUserTypeMinRead] [smallint] NULL,
	[IDUserTypeMinWrite] [smallint] NULL,
	[IDUserTypeMinApprove] [smallint] NULL,
	[Recycled] [datetime] NULL,
	[IDElementDatePublish] [int] NULL,
	[IDElementDateArchive] [int] NULL,
	[IDElementApproved] [int] NULL,
 CONSTRAINT [PK_BLOBPage] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSProperties]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[CMSProperties](
	[Name] [varchar](255) NOT NULL,
	[Value] [varchar](255) NULL
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[CMSOrderItems]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSOrderItems](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[IDOrder] [bigint] NOT NULL,
	[item_name] [nvarchar](128) NOT NULL,
	[item_number] [nvarchar](50) NOT NULL,
	[quantity] [int] NOT NULL,
	[mc_gross] [real] NOT NULL,
	[code] [nvarchar](50) NOT NULL,
	[type] [nchar](1) NOT NULL,
	[price] [real] NOT NULL,
	[fileID] [int] NULL,
	[filepath] [nvarchar](max) NOT NULL,
	[paid] [nvarchar](50) NOT NULL,
	[DownloadCount] [int] NOT NULL CONSTRAINT [DF_CMSOrderItems_DownloadCount]  DEFAULT ((0)),
	[GUID] [uniqueidentifier] NOT NULL CONSTRAINT [DF_CMSOrderItems_GUID]  DEFAULT (newid()),
	[tax] [real] NULL,
	[shipping] [real] NULL,
	[handling] [real] NULL,
	[net] [real] NULL,
	[fee] [real] NULL,
	[cut] [real] NULL,
 CONSTRAINT [PK_OrderItem] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSProperty]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[CMSProperty](
	[Name] [varchar](255) NOT NULL,
	[Value] [varchar](255) NOT NULL
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[CMSPublication]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[CMSPublication](
	[ID] [smallint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](255) NOT NULL,
	[Type] [smallint] NOT NULL,
	[Folder] [varchar](255) NULL,
	[IDPageRoot] [int] NOT NULL CONSTRAINT [DF_CMSPublication_IDPageRoot]  DEFAULT ((2)),
	[IDTemplateSet] [smallint] NOT NULL CONSTRAINT [DF_CMSPublication_IDTemplateSet]  DEFAULT ((1)),
	[ForceAll] [bit] NOT NULL CONSTRAINT [DF_CMSPublication_ForceAll]  DEFAULT ((0)),
	[EnableApproval] [bit] NOT NULL CONSTRAINT [DF_CMSPublication_ForceAll1]  DEFAULT ((0)),
	[EnablePublishArchive] [bit] NOT NULL CONSTRAINT [DF_CMSPublication_ForceAll2]  DEFAULT ((0)),
	[ClearFolder] [bit] NOT NULL CONSTRAINT [DF_CMSPublication_ForceAll3]  DEFAULT ((0)),
	[CopyRes] [bit] NOT NULL CONSTRAINT [DF_CMSPublication_ForceAll4]  DEFAULT ((0)),
	[CopyDependants] [bit] NOT NULL CONSTRAINT [DF_CMSPublication_ForceAll5]  DEFAULT ((0)),
	[AbsolutePaths] [bit] NOT NULL CONSTRAINT [DF_CMSPublication_ForceAll6]  DEFAULT ((0)),
	[IDUserTypeMin] [smallint] NULL,
	[CharSet] [smallint] NULL CONSTRAINT [DF_CMSPublication_CharSet]  DEFAULT ((1)),
	[CreateINIFile] [bit] NOT NULL CONSTRAINT [DF_CMSPublication_CreateINIFile]  DEFAULT ((1)),
 CONSTRAINT [PK_CMSPublication] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[CMSPublicationDestination]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[CMSPublicationDestination](
	[IDPublication] [smallint] NOT NULL,
	[Protocol] [smallint] NOT NULL,
	[IP] [varchar](50) NOT NULL,
	[Port] [int] NULL,
	[Folder] [varbinary](255) NULL,
	[Username] [varchar](255) NULL,
	[Password] [varchar](255) NULL,
 CONSTRAINT [PK_CMSPublicationDestination] PRIMARY KEY NONCLUSTERED 
(
	[IDPublication] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[CMSPublicationPublished]    Script Date: 05/02/2012 11:05:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSPublicationPublished](
	[IDPublication] [smallint] NOT NULL,
	[IDPage] [int] NOT NULL,
	[IDLanguage] [smallint] NOT NULL,
	[Published] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSSetting]    Script Date: 05/02/2012 11:05:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSSetting](
	[Name] [nvarchar](256) NOT NULL,
	[Value] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_BLOBSettings] PRIMARY KEY CLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSStructure]    Script Date: 05/02/2012 11:05:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSStructure](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](255) NULL CONSTRAINT [DF_CMSStructure_Name]  DEFAULT (N'new'),
	[IDPageDefault] [int] NULL,
	[Icon] [nvarchar](255) NULL CONSTRAINT [DF_CMSStructure_Icon]  DEFAULT (N'new.gif'),
	[OrderNumber] [smallint] NOT NULL,
	[Recycled] [datetime] NULL,
 CONSTRAINT [PK_BLOBStruct] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSTemplateSet]    Script Date: 05/02/2012 11:05:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSTemplateSet](
	[ID] [smallint] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Folder] [nvarchar](255) NULL,
 CONSTRAINT [PK_CMSTemplateSet] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSUserPermissions]    Script Date: 05/02/2012 11:05:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[CMSUserPermissions](
	[ID] [smallint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](255) NOT NULL,
	[IDUserTypeMin] [smallint] NULL,
 CONSTRAINT [PK_CMSUserPermissions] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[CMSUserType]    Script Date: 05/02/2012 11:05:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[CMSUserType](
	[ID] [smallint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](255) NOT NULL,
	[OrderNumber] [smallint] NULL,
 CONSTRAINT [PK_BLOBUserType] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[CMSOrders]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSOrders](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[DateCreated] [datetime] NOT NULL CONSTRAINT [DF_Order_Date]  DEFAULT (getdate()),
	[UserID] [int] NULL,
	[txn_id] [nvarchar](20) NOT NULL,
	[payer_email] [nvarchar](128) NULL,
	[first_name] [nvarchar](64) NULL,
	[last_name] [nvarchar](64) NULL,
	[payment_status] [nvarchar](50) NULL,
	[payment_date] [nvarchar](28) NULL,
	[payer_status] [nvarchar](50) NULL,
	[status] [nvarchar](50) NULL,
	[IDLastRequest] [bigint] NULL,
	[mc_gross] [real] NULL,
	[mc_currency] [nvarchar](3) NULL,
	[address_status] [nvarchar](50) NULL,
	[address_name] [nvarchar](128) NULL,
	[address_street] [nvarchar](200) NULL,
	[address_city] [nvarchar](40) NULL,
	[address_state] [nvarchar](40) NULL,
	[address_country] [nvarchar](64) NULL,
	[address_country_code] [nchar](2) NULL,
	[address_zip] [nvarchar](20) NULL,
	[memo] [nvarchar](255) NULL,
	[DateConfirmed] [datetime] NULL,
	[DateShipped] [datetime] NULL,
	[fee] [real] NULL,
	[tax] [real] NULL,
	[shipping] [real] NULL,
	[handling] [real] NULL,
	[net] [real] NULL,
	[cut] [real] NULL,
	[taxID] [int] NULL,
 CONSTRAINT [PK_Order] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSElementType]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSElementType](
	[ID] [smallint] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Supported] [bit] NOT NULL CONSTRAINT [DF_BLOBType_Supported]  DEFAULT ((1)),
 CONSTRAINT [PK_BLOBType] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSOrderRequests]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSOrderRequests](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[OrderID] [bigint] NOT NULL,
	[Date] [datetime] NOT NULL CONSTRAINT [DF_CMSOrderRequests_Date]  DEFAULT (getdate()),
	[Data] [nvarchar](max) NOT NULL,
	[Host] [nvarchar](max) NOT NULL,
	[IP] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_CMSOrderTransaction] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSElementTypeBoolean]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSElementTypeBoolean](
	[IDElementRef] [int] NOT NULL,
	[Boolean] [bit] NOT NULL CONSTRAINT [DF_CMSElementTypeBoolean_Boolean]  DEFAULT ((0)),
 CONSTRAINT [PK_CMSElementTypeBoolean] PRIMARY KEY NONCLUSTERED 
(
	[IDElementRef] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSElementTypeDate]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSElementTypeDate](
	[IDElementRef] [int] NOT NULL,
	[Date] [datetime] NULL,
 CONSTRAINT [PK_CMSElementTypeDate] PRIMARY KEY NONCLUSTERED 
(
	[IDElementRef] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSElementTypeTemplate]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSElementTypeTemplate](
	[IDElementRef] [int] NOT NULL,
	[URL] [nvarchar](255) NOT NULL,
	[IDTemplateSet] [smallint] NOT NULL,
	[OutputName] [nvarchar](255) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSFile]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[CMSFile](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[URL] [varchar](255) NOT NULL,
	[Name] [varchar](255) NULL,
	[Description] [text] NULL,
	[IDUserTypeMinRead] [smallint] NULL,
	[IDUserTypeMinWrite] [smallint] NULL,
	[IDUserCreated] [int] NULL,
 CONSTRAINT [PK_CMSFile] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[CMSUser]    Script Date: 05/02/2012 11:05:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSUser](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL CONSTRAINT [DF_BLOBUser_ID]  DEFAULT (newid()),
	[Username] [nvarchar](20) NOT NULL,
	[Password] [nvarchar](200) NOT NULL,
	[Firstname] [nvarchar](200) NULL,
	[Lastname] [nvarchar](200) NULL,
	[IDLanguage] [smallint] NOT NULL,
	[IDUserType] [smallint] NULL,
	[Valid] [bit] NOT NULL CONSTRAINT [DF_BLOBUser_Valid]  DEFAULT ((0)),
	[Email] [nvarchar](200) NULL,
	[IDPublication] [smallint] NOT NULL CONSTRAINT [DF_CMSUser_IDPublication]  DEFAULT ((1)),
	[LastLogin] [datetime] NULL CONSTRAINT [DF_CMSUser_LastLogin_1]  DEFAULT (getdate()),
	[LastAction] [datetime] NULL CONSTRAINT [DF_CMSUser_LastAction_1]  DEFAULT (getdate()),
	[IDLanguageAdmin] [smallint] NOT NULL CONSTRAINT [DF_CMSUser_IDLanguageAdmin]  DEFAULT ((1)),
 CONSTRAINT [PK_BLOBUser] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSElementRef]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSElementRef](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[IDElement] [int] NOT NULL,
	[IDLanguage] [smallint] NULL,
	[DateModified] [datetime] NOT NULL CONSTRAINT [DF_BLOBLangRef_DateModified]  DEFAULT (getdate()),
	[UserModified] [int] NOT NULL,
	[isCurrent] [bit] NOT NULL CONSTRAINT [DF_CMSElementRef_isCurrent]  DEFAULT ((0)),
 CONSTRAINT [PK_BLOBLangRef] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSElement]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSElement](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[IDElementType] [smallint] NOT NULL,
	[IDPage] [int] NULL,
	[IDStructureElement] [int] NULL,
	[LanguageDependent] [bit] NOT NULL CONSTRAINT [DF_BLOB_LangDependent]  DEFAULT ((0)),
 CONSTRAINT [PK_BLOB] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSStructureElement]    Script Date: 05/02/2012 11:05:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSStructureElement](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[IDStructure] [int] NOT NULL,
	[IDElementTypeDefault] [int] NOT NULL,
	[LanguageDependentDefault] [bit] NOT NULL CONSTRAINT [DF_BLOBStructElement_DefaultLangDependent]  DEFAULT ((1)),
	[OrderNumber] [smallint] NOT NULL,
	[Reserved] [bit] NOT NULL CONSTRAINT [DF_CMSStructureElement_Reserved]  DEFAULT ((0)),
	[Recycled] [datetime] NULL,
 CONSTRAINT [PK_BLOBStructElement] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSElementTypeExternal]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSElementTypeExternal](
	[IDElementRef] [int] NOT NULL,
	[URL] [nvarchar](255) NOT NULL,
	[DOMElementRef] [nvarchar](255) NULL,
 CONSTRAINT [PK_BLOBContentExternal] PRIMARY KEY CLUSTERED 
(
	[IDElementRef] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSElementTypeFile]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[CMSElementTypeFile](
	[IDElementRef] [int] NOT NULL,
	[IDFile] [int] NULL,
	[URL] [varchar](255) NOT NULL,
 CONSTRAINT [PK_BLOBContentFile] PRIMARY KEY CLUSTERED 
(
	[IDElementRef] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[CMSElementTypeList]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[CMSElementTypeList](
	[IDElementRef] [int] NOT NULL,
	[String] [varchar](255) NOT NULL,
	[OrderNumber] [int] NOT NULL,
 CONSTRAINT [PK_CMSElementTypeList] PRIMARY KEY CLUSTERED 
(
	[IDElementRef] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[CMSElementTypeMedia]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSElementTypeMedia](
	[IDElementRef] [int] NOT NULL,
	[IDFile] [int] NULL,
	[Height] [int] NULL,
	[Width] [int] NULL,
	[MIMEType] [nvarchar](255) NULL,
	[Path] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_BLOBContentImage] PRIMARY KEY NONCLUSTERED 
(
	[IDElementRef] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSElementTypeNumber]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSElementTypeNumber](
	[IDElementRef] [int] NOT NULL,
	[Number] [float] NULL,
 CONSTRAINT [PK_BLOBContentNumber] PRIMARY KEY NONCLUSTERED 
(
	[IDElementRef] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSElementTypePointer]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSElementTypePointer](
	[IDElementRef] [int] NOT NULL,
	[IDElement] [int] NULL,
 CONSTRAINT [PK_BLOBContentPointer] PRIMARY KEY NONCLUSTERED 
(
	[IDElementRef] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSElementTypeRichText]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSElementTypeRichText](
	[IDElementRef] [int] NOT NULL,
	[Text] [text] NOT NULL,
 CONSTRAINT [PK_CMSElementTypeRichText] PRIMARY KEY CLUSTERED 
(
	[IDElementRef] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSElementTypeString]    Script Date: 05/02/2012 11:05:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSElementTypeString](
	[IDElementRef] [int] NOT NULL,
	[String] [nvarchar](4000) NOT NULL,
 CONSTRAINT [PK_BLOBContentText] PRIMARY KEY NONCLUSTERED 
(
	[IDElementRef] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSUserLog]    Script Date: 05/02/2012 11:05:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSUserLog](
	[IDUser] [int] NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Value] [text] NULL,
	[Date] [datetime] NOT NULL CONSTRAINT [DF_BLOBUserLog_Date]  DEFAULT (getdate())
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CMSUserSetting]    Script Date: 05/02/2012 11:05:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CMSUserSetting](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[IDUser] [int] NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Value] [text] NULL,
	[Date] [datetime] NOT NULL CONSTRAINT [DF_CMSUserSetting_Date]  DEFAULT (getdate()),
 CONSTRAINT [PK_CMSUserSetting] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[VElementDefaultPage]    Script Date: 05/02/2012 11:05:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VElementDefaultPage]
AS
SELECT CMSElement.ID, CMSElement.IDPage,
    CMSPage.IDStructure, CMSStructure.IDPageDefault,
    CMSPage_1.IDElementTemplate AS IDElementTemplateDefault,
    CMSPage_1.IDElementName AS IDElementNameDefault,
    CMSElement.IDStructureElement
FROM CMSStructure INNER JOIN
    CMSPage ON
    CMSStructure.ID = CMSPage.IDStructure INNER JOIN
    CMSElement ON
    CMSPage.ID = CMSElement.IDPage INNER JOIN
    CMSPage CMSPage_1 ON
    CMSStructure.IDPageDefault = CMSPage_1.ID
GO
/****** Object:  View [dbo].[VPage]    Script Date: 05/02/2012 11:05:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VPage]
AS
SELECT     dbo.CMSPage.ID, dbo.CMSPage.IDParent, dbo.CMSPage.IDStructure, dbo.CMSPage.OrderNumber, dbo.CMSPage.IDElementName, 
                      dbo.CMSPage.Reference, dbo.CMSPage.Recycled, dbo.CMSStructure.Icon
FROM         dbo.CMSPage INNER JOIN
                      dbo.CMSStructure ON dbo.CMSPage.IDStructure = dbo.CMSStructure.ID
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'VPage'
GO
/****** Object:  View [dbo].[VStructureElementByPage]    Script Date: 05/02/2012 11:05:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/****** Object:  View dbo.VStructureElementByPage    Script Date: 10/2/2002 9:34:48 PM ******/
/****** Object:  View dbo.VStructureElementByPage    Script Date: 10/19/2001 4:31:37 PM *****










*/
CREATE VIEW [dbo].[VStructureElementByPage]
AS
SELECT     dbo.CMSStructureElement.ID, dbo.CMSStructure.ID AS IDStructure, dbo.CMSPage.ID AS IDPage, dbo.CMSStructureElement.Name,
                      dbo.CMSStructure.Name AS StructureName, dbo.CMSStructureElement.IDElementTypeDefault, dbo.CMSStructureElement.LanguageDependentDefault,
                      dbo.CMSStructureElement.OrderNumber
FROM         dbo.CMSStructureElement INNER JOIN
                      dbo.CMSStructure ON dbo.CMSStructureElement.IDStructure = dbo.CMSStructure.ID INNER JOIN
                      dbo.CMSPage ON dbo.CMSStructure.ID = dbo.CMSPage.IDStructure
GO
/****** Object:  View [dbo].[VElementByStructureElement]    Script Date: 05/02/2012 11:05:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VElementByStructureElement]
AS
SELECT CMSElement.ID, CMSStructureElement.Name,
    CMSElement.IDStructureElement, CMSElement.IDPage,
    CMSElement.IDElementType,
    CMSStructureElement.IDStructure,
    CMSStructureElement.IDElementTypeDefault,
    CMSStructureElement.LanguageDependentDefault
FROM CMSElement LEFT OUTER JOIN
    CMSStructureElement ON
    CMSElement.IDStructureElement = CMSStructureElement.ID
GO
/****** Object:  View [dbo].[VSearch]    Script Date: 05/02/2012 11:05:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VSearch]
AS
SELECT CMSElement.ID, CMSStructureElement.Name,
    CMSElement.IDStructureElement, CMSElement.IDPage,
    CMSElement.IDElementType,
    CMSStructureElement.IDStructure,
    CMSElementRef.ID AS IDElementRef,
    CMSElementRef.IDLanguage, CMSElementRef.UserModified,
    CMSElementRef.DateModified,
    CMSElement.LanguageDependent,
    CMSElementRef.isCurrent
FROM CMSElement INNER JOIN
    CMSElementRef ON
    CMSElement.ID = CMSElementRef.IDElement LEFT OUTER JOIN
    CMSStructureElement ON
    CMSElement.IDStructureElement = CMSStructureElement.ID
WHERE (CMSElementRef.isCurrent = 1)
GO
/****** Object:  ForeignKey [FK_BLOB_BLOBPage]    Script Date: 05/02/2012 11:05:19 ******/
ALTER TABLE [dbo].[CMSElement]  WITH CHECK ADD  CONSTRAINT [FK_BLOB_BLOBPage] FOREIGN KEY([IDPage])
REFERENCES [dbo].[CMSPage] ([ID])
GO
ALTER TABLE [dbo].[CMSElement] CHECK CONSTRAINT [FK_BLOB_BLOBPage]
GO
/****** Object:  ForeignKey [FK_BLOB_BLOBStructElement]    Script Date: 05/02/2012 11:05:19 ******/
ALTER TABLE [dbo].[CMSElement]  WITH CHECK ADD  CONSTRAINT [FK_BLOB_BLOBStructElement] FOREIGN KEY([IDStructureElement])
REFERENCES [dbo].[CMSStructureElement] ([ID])
GO
ALTER TABLE [dbo].[CMSElement] CHECK CONSTRAINT [FK_BLOB_BLOBStructElement]
GO
/****** Object:  ForeignKey [FK_BLOBLangRef_BLOB]    Script Date: 05/02/2012 11:05:19 ******/
ALTER TABLE [dbo].[CMSElementRef]  WITH CHECK ADD  CONSTRAINT [FK_BLOBLangRef_BLOB] FOREIGN KEY([IDElement])
REFERENCES [dbo].[CMSElement] ([ID])
GO
ALTER TABLE [dbo].[CMSElementRef] CHECK CONSTRAINT [FK_BLOBLangRef_BLOB]
GO
/****** Object:  ForeignKey [FK_BLOBLangRef_BLOBLang]    Script Date: 05/02/2012 11:05:19 ******/
ALTER TABLE [dbo].[CMSElementRef]  WITH CHECK ADD  CONSTRAINT [FK_BLOBLangRef_BLOBLang] FOREIGN KEY([IDLanguage])
REFERENCES [dbo].[CMSLanguage] ([ID])
GO
ALTER TABLE [dbo].[CMSElementRef] CHECK CONSTRAINT [FK_BLOBLangRef_BLOBLang]
GO
/****** Object:  ForeignKey [FK_CMSElementRef_CMSUser]    Script Date: 05/02/2012 11:05:19 ******/
ALTER TABLE [dbo].[CMSElementRef]  WITH CHECK ADD  CONSTRAINT [FK_CMSElementRef_CMSUser] FOREIGN KEY([UserModified])
REFERENCES [dbo].[CMSUser] ([ID])
GO
ALTER TABLE [dbo].[CMSElementRef] CHECK CONSTRAINT [FK_CMSElementRef_CMSUser]
GO
/****** Object:  ForeignKey [FK_CMSElementTypeExternal_CMSElementRef]    Script Date: 05/02/2012 11:05:19 ******/
ALTER TABLE [dbo].[CMSElementTypeExternal]  WITH CHECK ADD  CONSTRAINT [FK_CMSElementTypeExternal_CMSElementRef] FOREIGN KEY([IDElementRef])
REFERENCES [dbo].[CMSElementRef] ([ID])
GO
ALTER TABLE [dbo].[CMSElementTypeExternal] CHECK CONSTRAINT [FK_CMSElementTypeExternal_CMSElementRef]
GO
/****** Object:  ForeignKey [FK_BLOBContentURL_BLOBLangRef]    Script Date: 05/02/2012 11:05:19 ******/
ALTER TABLE [dbo].[CMSElementTypeFile]  WITH CHECK ADD  CONSTRAINT [FK_BLOBContentURL_BLOBLangRef] FOREIGN KEY([IDElementRef])
REFERENCES [dbo].[CMSElementRef] ([ID])
GO
ALTER TABLE [dbo].[CMSElementTypeFile] CHECK CONSTRAINT [FK_BLOBContentURL_BLOBLangRef]
GO
/****** Object:  ForeignKey [FK_CMSElementTypeList_CMSElementRef]    Script Date: 05/02/2012 11:05:19 ******/
ALTER TABLE [dbo].[CMSElementTypeList]  WITH CHECK ADD  CONSTRAINT [FK_CMSElementTypeList_CMSElementRef] FOREIGN KEY([IDElementRef])
REFERENCES [dbo].[CMSElementRef] ([ID])
GO
ALTER TABLE [dbo].[CMSElementTypeList] CHECK CONSTRAINT [FK_CMSElementTypeList_CMSElementRef]
GO
/****** Object:  ForeignKey [FK_BLOBContentImage_BLOBLangRef]    Script Date: 05/02/2012 11:05:19 ******/
ALTER TABLE [dbo].[CMSElementTypeMedia]  WITH CHECK ADD  CONSTRAINT [FK_BLOBContentImage_BLOBLangRef] FOREIGN KEY([IDElementRef])
REFERENCES [dbo].[CMSElementRef] ([ID])
GO
ALTER TABLE [dbo].[CMSElementTypeMedia] CHECK CONSTRAINT [FK_BLOBContentImage_BLOBLangRef]
GO
/****** Object:  ForeignKey [FK_BLOBContentNumber_BLOBLangRef]    Script Date: 05/02/2012 11:05:19 ******/
ALTER TABLE [dbo].[CMSElementTypeNumber]  WITH CHECK ADD  CONSTRAINT [FK_BLOBContentNumber_BLOBLangRef] FOREIGN KEY([IDElementRef])
REFERENCES [dbo].[CMSElementRef] ([ID])
GO
ALTER TABLE [dbo].[CMSElementTypeNumber] CHECK CONSTRAINT [FK_BLOBContentNumber_BLOBLangRef]
GO
/****** Object:  ForeignKey [FK_BLOBContentPointer_BLOBLangRef]    Script Date: 05/02/2012 11:05:19 ******/
ALTER TABLE [dbo].[CMSElementTypePointer]  WITH CHECK ADD  CONSTRAINT [FK_BLOBContentPointer_BLOBLangRef] FOREIGN KEY([IDElementRef])
REFERENCES [dbo].[CMSElementRef] ([ID])
GO
ALTER TABLE [dbo].[CMSElementTypePointer] CHECK CONSTRAINT [FK_BLOBContentPointer_BLOBLangRef]
GO
/****** Object:  ForeignKey [FK_CMSElementTypeRichText_CMSElementRef]    Script Date: 05/02/2012 11:05:19 ******/
ALTER TABLE [dbo].[CMSElementTypeRichText]  WITH CHECK ADD  CONSTRAINT [FK_CMSElementTypeRichText_CMSElementRef] FOREIGN KEY([IDElementRef])
REFERENCES [dbo].[CMSElementRef] ([ID])
GO
ALTER TABLE [dbo].[CMSElementTypeRichText] CHECK CONSTRAINT [FK_CMSElementTypeRichText_CMSElementRef]
GO
/****** Object:  ForeignKey [FK_BLOBContentText_BLOBLangRef]    Script Date: 05/02/2012 11:05:19 ******/
ALTER TABLE [dbo].[CMSElementTypeString]  WITH CHECK ADD  CONSTRAINT [FK_BLOBContentText_BLOBLangRef] FOREIGN KEY([IDElementRef])
REFERENCES [dbo].[CMSElementRef] ([ID])
GO
ALTER TABLE [dbo].[CMSElementTypeString] CHECK CONSTRAINT [FK_BLOBContentText_BLOBLangRef]
GO
/****** Object:  ForeignKey [FK_BLOBStructElement_BLOBStruct]    Script Date: 05/02/2012 11:05:20 ******/
ALTER TABLE [dbo].[CMSStructureElement]  WITH CHECK ADD  CONSTRAINT [FK_BLOBStructElement_BLOBStruct] FOREIGN KEY([IDStructure])
REFERENCES [dbo].[CMSStructure] ([ID])
GO
ALTER TABLE [dbo].[CMSStructureElement] CHECK CONSTRAINT [FK_BLOBStructElement_BLOBStruct]
GO
/****** Object:  ForeignKey [FK_CMSUser_CMSLanguage]    Script Date: 05/02/2012 11:05:20 ******/
ALTER TABLE [dbo].[CMSUser]  WITH CHECK ADD  CONSTRAINT [FK_CMSUser_CMSLanguage] FOREIGN KEY([IDLanguage])
REFERENCES [dbo].[CMSLanguage] ([ID])
GO
ALTER TABLE [dbo].[CMSUser] CHECK CONSTRAINT [FK_CMSUser_CMSLanguage]
GO
/****** Object:  ForeignKey [FK_CMSUser_CMSUserType]    Script Date: 05/02/2012 11:05:20 ******/
ALTER TABLE [dbo].[CMSUser]  WITH CHECK ADD  CONSTRAINT [FK_CMSUser_CMSUserType] FOREIGN KEY([IDUserType])
REFERENCES [dbo].[CMSUserType] ([ID])
GO
ALTER TABLE [dbo].[CMSUser] CHECK CONSTRAINT [FK_CMSUser_CMSUserType]
GO
/****** Object:  ForeignKey [FK_BLOBUserLog_BLOBUser]    Script Date: 05/02/2012 11:05:20 ******/
ALTER TABLE [dbo].[CMSUserLog]  WITH CHECK ADD  CONSTRAINT [FK_BLOBUserLog_BLOBUser] FOREIGN KEY([IDUser])
REFERENCES [dbo].[CMSUser] ([ID])
GO
ALTER TABLE [dbo].[CMSUserLog] CHECK CONSTRAINT [FK_BLOBUserLog_BLOBUser]
GO
/****** Object:  ForeignKey [FK_CMSUserSetting_CMSUser]    Script Date: 05/02/2012 11:05:20 ******/
ALTER TABLE [dbo].[CMSUserSetting]  WITH CHECK ADD  CONSTRAINT [FK_CMSUserSetting_CMSUser] FOREIGN KEY([IDUser])
REFERENCES [dbo].[CMSUser] ([ID])
GO
ALTER TABLE [dbo].[CMSUserSetting] CHECK CONSTRAINT [FK_CMSUserSetting_CMSUser]
GO
