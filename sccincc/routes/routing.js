var routes = {};

function authentication(req, res, next) {

	if (!req.session.user) {

		req.session.error = '请先登陆';

		return res.redirect('/login');
	}

	next();

}
module.exports = routes;
routes.index = [


	{
		urlreg: '/',
		file: '/routes/index',
		method: 'get',
		fn: 'index'
	},

	{
		urlreg: '/',
		file: '/routes/index',
		method: 'post',
		fn: 'post'
	}

];
routes.login = [

	{
		urlreg: '/login',
		file: '/routes/login',
		method: 'get',
		fn: 'index'
	}
];
routes.common = [

	{
		urlreg: '/common/contacts',
		file: '/routes/common',
		method: 'get',
		fn: 'contacts'
	}
];
routes.selectdb = [{
		urlreg: '/selectdb',
		file: '/routes/selectdb',
		method: 'all',
		fn: 'all'
	}, {
		urlreg: '/selectdb/orderchart',
		file: '/routes/selectdb',
		method: 'all',
		fn: 'orderchart'
	}, {
		urlreg: '/selectdb/paidanchart',
		file: '/routes/selectdb',
		method: 'all',
		fn: 'paidanchart'
	}, {
		urlreg: '/selectdb/pagingsearch',
		file: '/routes/selectdb',
		method: 'all',
		fn: 'pagingsearch'
	}, {
		urlreg: '/selectdb/callreportchart',
		file: '/routes/selectdb',
		method: 'all',
		fn: 'callreportchart'
	}

];
routes.asami = [

	{
		urlreg: '/asami/getconfig',
		file: '/routes/asami',
		method: 'all',
		fn: 'getconfig'
	},

	{
		urlreg: '/asami/getconfigjson',
		file: '/routes/asami',
		method: 'all',
		fn: 'getconfigjson'
	},

	{
		urlreg: '/asami/createconfig',
		file: '/routes/asami',
		method: 'all',
		fn: 'createconfig'
	},

	{
		urlreg: '/asami/coreshowchannels',
		file: '/routes/asami',
		method: 'all',
		fn: 'coreshowchannels'
	},

	{
		urlreg: '/asami/extensionstate',
		file: '/routes/asami',
		method: 'all',
		fn: 'extensionstate'
	},

	{
		urlreg: '/asami/command',
		file: '/routes/asami',
		method: 'all',
		fn: 'command'
	},

	{
		urlreg: '/asami/status',
		file: '/routes/asami',
		method: 'all',
		fn: 'status'
	},

	{
		urlreg: '/asami/hangup',
		file: '/routes/asami',
		method: 'all',
		fn: 'hangup'
	},

	{
		urlreg: '/asami/DadOn',
		file: '/routes/asami',
		method: 'all',
		fn: 'DadOn'
	},

	{
		urlreg: '/asami/transfer',
		file: '/routes/asami',
		method: 'all',
		fn: 'transfer'
	},

	{
		urlreg: '/asami/packCall',
		file: '/routes/asami',
		method: 'all',
		fn: 'packCall'
	},

	{
		urlreg: '/asami/unPark',
		file: '/routes/asami',
		method: 'all',
		fn: 'unPark'
	},

	{
		urlreg: '/asami/checkService',
		file: '/routes/asami',
		method: 'all',
		fn: 'checkService'
	},

	{
		urlreg: '/asami/GetCallInfo',
		file: '/routes/asami',
		method: 'all',
		fn: 'GetCallInfo'
	},

	{
		urlreg: '/asami/hangupexten',
		file: '/routes/asami',
		method: 'all',
		fn: 'hangupexten'
	},

	{
		urlreg: '/asami/ping',
		file: '/routes/asami',
		method: 'all',
		fn: 'ping'
	},

	{
		urlreg: '/asami/dialout',
		file: '/routes/asami',
		method: 'all',
		fn: 'dialout'
	},

	{
		urlreg: '/asami/sippeers',
		file: '/routes/asami',
		method: 'all',
		fn: 'sippeers'
	}

];

routes.chart = [

	{
		urlreg: '/chart/callsession',
		file: '/routes/chart',
		method: 'get',
		fn: 'callsessionget'
	},

	{
		urlreg: '/chart/callsession',
		file: '/routes/chart',
		method: 'post',
		fn: 'callsessionpost'
	},

	{
		urlreg: '/chart/ordercharts',
		file: '/routes/chart',
		method: 'get',
		fn: 'orderchartsget'
	},

	{
		urlreg: '/chart/ordercharts',
		file: '/routes/chart',
		method: 'post',
		fn: 'orderchartspost'
	}, {
		urlreg: '/chart/paidancharts',
		file: '/routes/chart',
		method: 'get',
		fn: 'paidanchartsget'
	},

	{
		urlreg: '/chart/paidancharts',
		file: '/routes/chart',
		method: 'post',
		fn: 'paidanchartspost'
	}, {
		urlreg: '/chart/callsessiondatetimes',
		file: '/routes/chart',
		method: 'post',
		fn: 'callsessiondatetimes'
	}, {
		urlreg: '/chart/callreports',
		file: '/routes/chart',
		method: 'get',
		fn: 'callreportsget'
	}


];
routes.SoundPlayer = [

	{
		urlreg: '/SoundPlayer',
		file: '/routes/SoundPlayer',
		method: 'all',
		fn: 'SoundPlayer'
	}

];
routes.screenpop = [

	{
		urlreg: '/screenpop/index',
		file: '/routes/screenpop',
		method: 'get',
		fn: 'get'
	},

	{
		urlreg: '/screenpop/index',
		file: '/routes/screenpop',
		method: 'post',
		fn: 'post'
	}

];
routes.RemindReacords = [

	{
		urlreg: '/RemindReacords/index',
		file: '/routes/RemindReacords',
		method: 'get',
		fn: 'get'
	},

	{
		urlreg: '/RemindReacords/index',
		file: '/routes/RemindReacords',
		method: 'post',
		fn: 'post'
	}
];
//自动添加于：2013-07-17 18:43:33
routes.AreaCode = [{
	urlreg: '/AreaCode',
	file: '/routes/AreaCode',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/AreaCode',
	file: '/routes/AreaCode',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/AreaCode/edit',
	file: '/routes/AreaCode',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/AreaCode/edit',
	file: '/routes/AreaCode',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/AreaCode/detail',
	file: '/routes/AreaCode',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/AreaCode/del',
	file: '/routes/AreaCode',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/AreaCode/create',
	file: '/routes/AreaCode',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/AreaCode/create',
	file: '/routes/AreaCode',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.ComplaintCode = [{
	urlreg: '/ComplaintCode',
	file: '/routes/ComplaintCode',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/ComplaintCode',
	file: '/routes/ComplaintCode',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/ComplaintCode/edit',
	file: '/routes/ComplaintCode',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/ComplaintCode/edit',
	file: '/routes/ComplaintCode',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/ComplaintCode/detail',
	file: '/routes/ComplaintCode',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/ComplaintCode/del',
	file: '/routes/ComplaintCode',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/ComplaintCode/create',
	file: '/routes/ComplaintCode',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/ComplaintCode/create',
	file: '/routes/ComplaintCode',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.ComplaintRecords = [{
		urlreg: '/ComplaintRecords',
		file: '/routes/ComplaintRecords',
		method: 'get',
		fn: 'get'
	}, {
		urlreg: '/ComplaintRecords',
		file: '/routes/ComplaintRecords',
		method: 'post',
		fn: 'post'
	},

	{
		urlreg: '/ComplaintRecords/addPiShi',
		file: '/routes/ComplaintRecords',
		method: 'post',
		fn: 'addPiShi'
	},

	{
		urlreg: '/ComplaintRecords/addHuiFang',
		file: '/routes/ComplaintRecords',
		method: 'post',
		fn: 'addHuiFang'
	},

	{
		urlreg: '/ComplaintRecords/addChuLi',
		file: '/routes/ComplaintRecords',
		method: 'post',
		fn: 'addChuLi'
	},

	{
		urlreg: '/ComplaintRecords/getTouShu',
		file: '/routes/ComplaintRecords',
		method: 'post',
		fn: 'getTouShu'
	}, {
		urlreg: '/ComplaintRecords/edit',
		file: '/routes/ComplaintRecords',
		method: 'post',
		fn: 'editpost'
	}, {
		urlreg: '/ComplaintRecords/edit',
		file: '/routes/ComplaintRecords',
		method: 'get',
		fn: 'editget'
	}, {
		urlreg: '/ComplaintRecords/detail',
		file: '/routes/ComplaintRecords',
		method: 'get',
		fn: 'detail'
	}, {
		urlreg: '/ComplaintRecords/del',
		file: '/routes/ComplaintRecords',
		method: 'post',
		fn: 'del'
	}, {
		urlreg: '/ComplaintRecords/create',
		file: '/routes/ComplaintRecords',
		method: 'post',
		fn: 'createpost'
	}, {
		urlreg: '/ComplaintRecords/create',
		file: '/routes/ComplaintRecords',
		method: 'get',
		fn: 'createget'
	}
];
//自动添加于：2013-07-17 18:43:33
routes.ConsultCode = [{
	urlreg: '/ConsultCode',
	file: '/routes/ConsultCode',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/ConsultCode',
	file: '/routes/ConsultCode',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/ConsultCode/edit',
	file: '/routes/ConsultCode',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/ConsultCode/edit',
	file: '/routes/ConsultCode',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/ConsultCode/detail',
	file: '/routes/ConsultCode',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/ConsultCode/del',
	file: '/routes/ConsultCode',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/ConsultCode/create',
	file: '/routes/ConsultCode',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/ConsultCode/create',
	file: '/routes/ConsultCode',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.ConsultRecords = [{
	urlreg: '/ConsultRecords',
	file: '/routes/ConsultRecords',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/ConsultRecords',
	file: '/routes/ConsultRecords',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/ConsultRecords/edit',
	file: '/routes/ConsultRecords',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/ConsultRecords/edit',
	file: '/routes/ConsultRecords',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/ConsultRecords/detail',
	file: '/routes/ConsultRecords',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/ConsultRecords/del',
	file: '/routes/ConsultRecords',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/ConsultRecords/create',
	file: '/routes/ConsultRecords',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/ConsultRecords/create',
	file: '/routes/ConsultRecords',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.CustomInfo = [{
	urlreg: '/CustomInfo',
	file: '/routes/CustomInfo',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/CustomInfo',
	file: '/routes/CustomInfo',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/CustomInfo/edit',
	file: '/routes/CustomInfo',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/CustomInfo/edit',
	file: '/routes/CustomInfo',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/CustomInfo/detail',
	file: '/routes/CustomInfo',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/CustomInfo/del',
	file: '/routes/CustomInfo',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/CustomInfo/create',
	file: '/routes/CustomInfo',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/CustomInfo/create',
	file: '/routes/CustomInfo',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.DepInfo = [{
	urlreg: '/DepInfo',
	file: '/routes/DepInfo',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/DepInfo',
	file: '/routes/DepInfo',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/DepInfo/edit',
	file: '/routes/DepInfo',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/DepInfo/edit',
	file: '/routes/DepInfo',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/DepInfo/detail',
	file: '/routes/DepInfo',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/DepInfo/del',
	file: '/routes/DepInfo',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/DepInfo/create',
	file: '/routes/DepInfo',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/DepInfo/create',
	file: '/routes/DepInfo',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.Faq = [{
	urlreg: '/Faq',
	file: '/routes/Faq',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/Faq',
	file: '/routes/Faq',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/Faq/edit',
	file: '/routes/Faq',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/Faq/edit',
	file: '/routes/Faq',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/Faq/detail',
	file: '/routes/Faq',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/Faq/del',
	file: '/routes/Faq',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/Faq/create',
	file: '/routes/Faq',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/Faq/create',
	file: '/routes/Faq',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.FaqCode = [{
	urlreg: '/FaqCode',
	file: '/routes/FaqCode',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/FaqCode',
	file: '/routes/FaqCode',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/FaqCode/edit',
	file: '/routes/FaqCode',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/FaqCode/edit',
	file: '/routes/FaqCode',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/FaqCode/detail',
	file: '/routes/FaqCode',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/FaqCode/del',
	file: '/routes/FaqCode',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/FaqCode/create',
	file: '/routes/FaqCode',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/FaqCode/create',
	file: '/routes/FaqCode',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.MenmuGroup = [{
	urlreg: '/MenmuGroup',
	file: '/routes/MenmuGroup',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/MenmuGroup',
	file: '/routes/MenmuGroup',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/MenmuGroup/edit',
	file: '/routes/MenmuGroup',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/MenmuGroup/edit',
	file: '/routes/MenmuGroup',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/MenmuGroup/detail',
	file: '/routes/MenmuGroup',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/MenmuGroup/del',
	file: '/routes/MenmuGroup',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/MenmuGroup/create',
	file: '/routes/MenmuGroup',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/MenmuGroup/create',
	file: '/routes/MenmuGroup',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.Menmus = [{
	urlreg: '/Menmus',
	file: '/routes/Menmus',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/Menmus',
	file: '/routes/Menmus',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/Menmus/edit',
	file: '/routes/Menmus',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/Menmus/edit',
	file: '/routes/Menmus',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/Menmus/detail',
	file: '/routes/Menmus',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/Menmus/del',
	file: '/routes/Menmus',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/Menmus/create',
	file: '/routes/Menmus',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/Menmus/create',
	file: '/routes/Menmus',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.OrderRecords = [{
		urlreg: '/OrderRecords',
		file: '/routes/OrderRecords',
		method: 'get',
		fn: 'get'
	}, {
		urlreg: '/OrderRecords',
		file: '/routes/OrderRecords',
		method: 'post',
		fn: 'post'
	}, {
		urlreg: '/OrderRecords/edit',
		file: '/routes/OrderRecords',
		method: 'post',
		fn: 'editpost'
	}, {
		urlreg: '/OrderRecords/edit',
		file: '/routes/OrderRecords',
		method: 'get',
		fn: 'editget'
	}, {
		urlreg: '/OrderRecords/detail',
		file: '/routes/OrderRecords',
		method: 'get',
		fn: 'detail'
	}, {
		urlreg: '/OrderRecords/del',
		file: '/routes/OrderRecords',
		method: 'post',
		fn: 'del'
	},

	{
		urlreg: '/OrderRecords/getPhone',
		file: '/routes/OrderRecords',
		method: 'post',
		fn: 'getPhone'
	},

	{
		urlreg: '/OrderRecords/getOrder',
		file: '/routes/OrderRecords',
		method: 'post',
		fn: 'getOrder'
	},

	{
		urlreg: '/OrderRecords/paiDan',
		file: '/routes/OrderRecords',
		method: 'post',
		fn: 'paiDan'
	},

	{
		urlreg: '/OrderRecords/huiFang',
		file: '/routes/OrderRecords',
		method: 'post',
		fn: 'huiFang'
	},

	{
		urlreg: '/OrderRecords/create',
		file: '/routes/OrderRecords',
		method: 'post',
		fn: 'createpost'
	}, {
		urlreg: '/OrderRecords/create',
		file: '/routes/OrderRecords',
		method: 'get',
		fn: 'createget'
	}
];
//自动添加于：2013-07-17 18:43:33
routes.OrderType = [{
	urlreg: '/OrderType',
	file: '/routes/OrderType',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/OrderType',
	file: '/routes/OrderType',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/OrderType/edit',
	file: '/routes/OrderType',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/OrderType/edit',
	file: '/routes/OrderType',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/OrderType/detail',
	file: '/routes/OrderType',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/OrderType/del',
	file: '/routes/OrderType',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/OrderType/create',
	file: '/routes/OrderType',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/OrderType/create',
	file: '/routes/OrderType',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.RoelMenmuRlations = [{
	urlreg: '/RoelMenmuRlations',
	file: '/routes/RoelMenmuRlations',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/RoelMenmuRlations',
	file: '/routes/RoelMenmuRlations',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/RoelMenmuRlations/edit',
	file: '/routes/RoelMenmuRlations',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/RoelMenmuRlations/edit',
	file: '/routes/RoelMenmuRlations',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/RoelMenmuRlations/detail',
	file: '/routes/RoelMenmuRlations',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/RoelMenmuRlations/del',
	file: '/routes/RoelMenmuRlations',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/RoelMenmuRlations/create',
	file: '/routes/RoelMenmuRlations',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/RoelMenmuRlations/create',
	file: '/routes/RoelMenmuRlations',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.SysLog = [{
	urlreg: '/SysLog',
	file: '/routes/SysLog',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/SysLog',
	file: '/routes/SysLog',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/SysLog/edit',
	file: '/routes/SysLog',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/SysLog/edit',
	file: '/routes/SysLog',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/SysLog/detail',
	file: '/routes/SysLog',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/SysLog/del',
	file: '/routes/SysLog',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/SysLog/create',
	file: '/routes/SysLog',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/SysLog/create',
	file: '/routes/SysLog',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.UserInfo = [{
		urlreg: '/UserInfo',
		file: '/routes/UserInfo',
		method: 'get',
		fn: 'get'
	}, {
		urlreg: '/UserInfo',
		file: '/routes/UserInfo',
		method: 'post',
		fn: 'post'
	}, {
		urlreg: '/UserInfo/edit',
		file: '/routes/UserInfo',
		method: 'post',
		fn: 'editpost'
	}, {
		urlreg: '/UserInfo/edit',
		file: '/routes/UserInfo',
		method: 'get',
		fn: 'editget'
	}, {
		urlreg: '/UserInfo/detail',
		file: '/routes/UserInfo',
		method: 'get',
		fn: 'detail'
	}, {
		urlreg: '/UserInfo/del',
		file: '/routes/UserInfo',
		method: 'post',
		fn: 'del'
	},

	{
		urlreg: '/UserInfo/EngineerList',
		file: '/routes/UserInfo',
		method: 'all',
		fn: 'EngineerList'
	},

	{
		urlreg: '/UserInfo/editEngineer',
		file: '/routes/UserInfo',
		method: 'get',
		fn: 'editEngineerGet'
	},

	{
		urlreg: '/UserInfo/editEngineer',
		file: '/routes/UserInfo',
		method: 'post',
		fn: 'editEngineerPost'
	},

	{
		urlreg: '/UserInfo/createEngineer',
		file: '/routes/UserInfo',
		method: 'get',
		fn: 'createEngineerGet'
	}, {
		urlreg: '/UserInfo/createEngineer',
		file: '/routes/UserInfo',
		method: 'post',
		fn: 'createEngineerPost'
	}, {
		urlreg: '/UserInfo/create',
		file: '/routes/UserInfo',
		method: 'post',
		fn: 'createpost'
	}, {
		urlreg: '/UserInfo/create',
		file: '/routes/UserInfo',
		method: 'get',
		fn: 'createget'
	}
];
//自动添加于：2013-07-17 18:43:33
routes.UserRole = [{
	urlreg: '/UserRole',
	file: '/routes/UserRole',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/UserRole',
	file: '/routes/UserRole',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/UserRole/edit',
	file: '/routes/UserRole',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/UserRole/edit',
	file: '/routes/UserRole',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/UserRole/detail',
	file: '/routes/UserRole',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/UserRole/del',
	file: '/routes/UserRole',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/UserRole/create',
	file: '/routes/UserRole',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/UserRole/create',
	file: '/routes/UserRole',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.actionmodes = [{
	urlreg: '/actionmodes',
	file: '/routes/actionmodes',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/actionmodes',
	file: '/routes/actionmodes',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/actionmodes/edit',
	file: '/routes/actionmodes',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/actionmodes/edit',
	file: '/routes/actionmodes',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/actionmodes/detail',
	file: '/routes/actionmodes',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/actionmodes/del',
	file: '/routes/actionmodes',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/actionmodes/create',
	file: '/routes/actionmodes',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/actionmodes/create',
	file: '/routes/actionmodes',
	method: 'get',
	fn: 'createget'
}];

//自动添加于：2013-07-17 18:46:17
routes.WarterStopInfo = [{
	urlreg: '/WarterStopInfo',
	file: '/routes/WarterStopInfo',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/WarterStopInfo',
	file: '/routes/WarterStopInfo',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/WarterStopInfo/edit',
	file: '/routes/WarterStopInfo',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/WarterStopInfo/edit',
	file: '/routes/WarterStopInfo',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/WarterStopInfo/detail',
	file: '/routes/WarterStopInfo',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/WarterStopInfo/del',
	file: '/routes/WarterStopInfo',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/WarterStopInfo/create',
	file: '/routes/WarterStopInfo',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/WarterStopInfo/create',
	file: '/routes/WarterStopInfo',
	method: 'get',
	fn: 'createget'
}, {
	urlreg: '/WarterStopInfo/huifu',
	file: '/routes/WarterStopInfo',
	method: 'post',
	fn: 'huifu'
}];

//自动添加于：2013-07-17 18:46:17
routes.wateruses = [{
	urlreg: '/wateruses',
	file: '/routes/wateruses',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/wateruses',
	file: '/routes/wateruses',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/wateruses/edit',
	file: '/routes/wateruses',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/wateruses/edit',
	file: '/routes/wateruses',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/wateruses/detail',
	file: '/routes/wateruses',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/wateruses/del',
	file: '/routes/wateruses',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/wateruses/create',
	file: '/routes/wateruses',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/wateruses/create',
	file: '/routes/wateruses',
	method: 'get',
	fn: 'createget'
}];

//自动添加于：2013-07-17 18:43:33
routes.callevent = [{
	urlreg: '/callevent',
	file: '/routes/callevent',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/callevent',
	file: '/routes/callevent',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/callevent/edit',
	file: '/routes/callevent',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/callevent/edit',
	file: '/routes/callevent',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/callevent/detail',
	file: '/routes/callevent',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/callevent/del',
	file: '/routes/callevent',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/callevent/create',
	file: '/routes/callevent',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/callevent/create',
	file: '/routes/callevent',
	method: 'get',
	fn: 'createget'
}];


//自动添加于：2013-07-17 18:43:33
routes.callsession = [{
	urlreg: '/callsession',
	file: '/routes/callsession',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/callsession',
	file: '/routes/callsession',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/callsession/edit',
	file: '/routes/callsession',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/callsession/edit',
	file: '/routes/callsession',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/callsession/detail',
	file: '/routes/callsession',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/callsession/del',
	file: '/routes/callsession',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/callsession/create',
	file: '/routes/callsession',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/callsession/create',
	file: '/routes/callsession',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.callsession_acts = [{
	urlreg: '/callsession_acts',
	file: '/routes/callsession_acts',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/callsession_acts',
	file: '/routes/callsession_acts',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/callsession_acts/edit',
	file: '/routes/callsession_acts',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/callsession_acts/edit',
	file: '/routes/callsession_acts',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/callsession_acts/detail',
	file: '/routes/callsession_acts',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/callsession_acts/del',
	file: '/routes/callsession_acts',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/callsession_acts/create',
	file: '/routes/callsession_acts',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/callsession_acts/create',
	file: '/routes/callsession_acts',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.cdr = [{
	urlreg: '/cdr',
	file: '/routes/cdr',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/cdr',
	file: '/routes/cdr',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/cdr/edit',
	file: '/routes/cdr',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/cdr/edit',
	file: '/routes/cdr',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/cdr/detail',
	file: '/routes/cdr',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/cdr/del',
	file: '/routes/cdr',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/cdr/create',
	file: '/routes/cdr',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/cdr/create',
	file: '/routes/cdr',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.checkservice = [{
	urlreg: '/checkservice',
	file: '/routes/checkservice',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/checkservice',
	file: '/routes/checkservice',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/checkservice/edit',
	file: '/routes/checkservice',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/checkservice/edit',
	file: '/routes/checkservice',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/checkservice/detail',
	file: '/routes/checkservice',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/checkservice/del',
	file: '/routes/checkservice',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/checkservice/create',
	file: '/routes/checkservice',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/checkservice/create',
	file: '/routes/checkservice',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.extension = [{
	urlreg: '/extension',
	file: '/routes/extension',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/extension',
	file: '/routes/extension',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/extension/edit',
	file: '/routes/extension',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/extension/edit',
	file: '/routes/extension',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/extension/detail',
	file: '/routes/extension',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/extension/del',
	file: '/routes/extension',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/extension/create',
	file: '/routes/extension',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/extension/create',
	file: '/routes/extension',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.conference = [{
	urlreg: '/conference',
	file: '/routes/conference',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/conference',
	file: '/routes/conference',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/conference/edit',
	file: '/routes/conference',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/conference/edit',
	file: '/routes/conference',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/conference/detail',
	file: '/routes/conference',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/conference/del',
	file: '/routes/conference',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/conference/create',
	file: '/routes/conference',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/conference/create',
	file: '/routes/conference',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.forlostnum = [{
	urlreg: '/forlostnum',
	file: '/routes/forlostnum',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/forlostnum',
	file: '/routes/forlostnum',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/forlostnum/edit',
	file: '/routes/forlostnum',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/forlostnum/edit',
	file: '/routes/forlostnum',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/forlostnum/detail',
	file: '/routes/forlostnum',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/forlostnum/del',
	file: '/routes/forlostnum',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/forlostnum/create',
	file: '/routes/forlostnum',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/forlostnum/create',
	file: '/routes/forlostnum',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.hardcard = [{
	urlreg: '/hardcard',
	file: '/routes/hardcard',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/hardcard',
	file: '/routes/hardcard',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/hardcard/edit',
	file: '/routes/hardcard',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/hardcard/edit',
	file: '/routes/hardcard',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/hardcard/detail',
	file: '/routes/hardcard',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/hardcard/del',
	file: '/routes/hardcard',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/hardcard/create',
	file: '/routes/hardcard',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/hardcard/create',
	file: '/routes/hardcard',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.ivraction = [{
	urlreg: '/ivraction',
	file: '/routes/ivraction',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/ivraction',
	file: '/routes/ivraction',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/ivraction/edit',
	file: '/routes/ivraction',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/ivraction/edit',
	file: '/routes/ivraction',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/ivraction/detail',
	file: '/routes/ivraction',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/ivraction/del',
	file: '/routes/ivraction',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/ivraction/create',
	file: '/routes/ivraction',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/ivraction/create',
	file: '/routes/ivraction',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.ivrmenu = [{
	urlreg: '/ivrmenu',
	file: '/routes/ivrmenu',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/ivrmenu',
	file: '/routes/ivrmenu',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/ivrmenu/edit',
	file: '/routes/ivrmenu',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/ivrmenu/edit',
	file: '/routes/ivrmenu',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/ivrmenu/detail',
	file: '/routes/ivrmenu',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/ivrmenu/del',
	file: '/routes/ivrmenu',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/ivrmenu/create',
	file: '/routes/ivrmenu',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/ivrmenu/create',
	file: '/routes/ivrmenu',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.ivruserinput = [{
	urlreg: '/ivruserinput',
	file: '/routes/ivruserinput',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/ivruserinput',
	file: '/routes/ivruserinput',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/ivruserinput/edit',
	file: '/routes/ivruserinput',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/ivruserinput/edit',
	file: '/routes/ivruserinput',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/ivruserinput/detail',
	file: '/routes/ivruserinput',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/ivruserinput/del',
	file: '/routes/ivruserinput',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/ivruserinput/create',
	file: '/routes/ivruserinput',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/ivruserinput/create',
	file: '/routes/ivruserinput',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.localnumber = [{
	urlreg: '/localnumber',
	file: '/routes/localnumber',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/localnumber',
	file: '/routes/localnumber',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/localnumber/edit',
	file: '/routes/localnumber',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/localnumber/edit',
	file: '/routes/localnumber',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/localnumber/detail',
	file: '/routes/localnumber',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/localnumber/del',
	file: '/routes/localnumber',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/localnumber/create',
	file: '/routes/localnumber',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/localnumber/create',
	file: '/routes/localnumber',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.queue = [{
	urlreg: '/queue',
	file: '/routes/queue',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/queue',
	file: '/routes/queue',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/queue/edit',
	file: '/routes/queue',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/queue/edit',
	file: '/routes/queue',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/queue/detail',
	file: '/routes/queue',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/queue/del',
	file: '/routes/queue',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/queue/create',
	file: '/routes/queue',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/queue/create',
	file: '/routes/queue',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.recordfiles = [{
	urlreg: '/recordfiles',
	file: '/routes/recordfiles',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/recordfiles',
	file: '/routes/recordfiles',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/recordfiles/edit',
	file: '/routes/recordfiles',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/recordfiles/edit',
	file: '/routes/recordfiles',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/recordfiles/detail',
	file: '/routes/recordfiles',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/recordfiles/del',
	file: '/routes/recordfiles',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/recordfiles/create',
	file: '/routes/recordfiles',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/recordfiles/create',
	file: '/routes/recordfiles',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.router = [{
	urlreg: '/router',
	file: '/routes/router',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/router',
	file: '/routes/router',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/router/edit',
	file: '/routes/router',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/router/edit',
	file: '/routes/router',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/router/detail',
	file: '/routes/router',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/router/del',
	file: '/routes/router',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/router/create',
	file: '/routes/router',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/router/create',
	file: '/routes/router',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.trunk = [{
	urlreg: '/trunk',
	file: '/routes/trunk',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/trunk',
	file: '/routes/trunk',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/trunk/edit',
	file: '/routes/trunk',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/trunk/edit',
	file: '/routes/trunk',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/trunk/detail',
	file: '/routes/trunk',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/trunk/del',
	file: '/routes/trunk',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/trunk/create',
	file: '/routes/trunk',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/trunk/create',
	file: '/routes/trunk',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.voicefiles = [{
	urlreg: '/voicefiles',
	file: '/routes/voicefiles',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/voicefiles',
	file: '/routes/voicefiles',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/voicefiles/edit',
	file: '/routes/voicefiles',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/voicefiles/edit',
	file: '/routes/voicefiles',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/voicefiles/detail',
	file: '/routes/voicefiles',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/voicefiles/del',
	file: '/routes/voicefiles',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/voicefiles/create',
	file: '/routes/voicefiles',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/voicefiles/create',
	file: '/routes/voicefiles',
	method: 'get',
	fn: 'createget'
}];
//自动添加于：2013-07-17 18:43:33
routes.Sms = [{
	urlreg: '/Sms',
	file: '/routes/Sms',
	method: 'get',
	fn: 'get'
}, {
	urlreg: '/Sms',
	file: '/routes/Sms',
	method: 'post',
	fn: 'post'
}, {
	urlreg: '/Sms/edit',
	file: '/routes/Sms',
	method: 'post',
	fn: 'editpost'
}, {
	urlreg: '/Sms/edit',
	file: '/routes/Sms',
	method: 'get',
	fn: 'editget'
}, {
	urlreg: '/Sms/detail',
	file: '/routes/Sms',
	method: 'get',
	fn: 'detail'
}, {
	urlreg: '/Sms/del',
	file: '/routes/Sms',
	method: 'post',
	fn: 'del'
}, {
	urlreg: '/Sms/create',
	file: '/routes/Sms',
	method: 'post',
	fn: 'createpost'
}, {
	urlreg: '/Sms/create',
	file: '/routes/Sms',
	method: 'get',
	fn: 'createget'
}, {
	urlreg: '/Sms/AddSmsInfo',
	file: '/routes/Sms',
	method: 'post',
	fn: 'AddSmsInfo'
}];