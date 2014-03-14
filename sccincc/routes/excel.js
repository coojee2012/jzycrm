var nodeExcel = require('excel-export');
exports.orderrecords = function(req, res) {
	var conf = {};
	conf.stylesXmlFile = "./public/excel/styles.xml";
	conf.title='工单记录导出标题';
	conf.cols = [{
		caption: 'string',
		type: 'string',
		beforeCellWrite: function(row, cellData) {
			return cellData.toUpperCase();
		},
		width: 28.7109375
	}, {
		caption: 'date',
		type: 'date',
		beforeCellWrite: function() {
			var originDate = new Date(Date.UTC(1899, 11, 30));
			return function(row, cellData, eOpt) {
				if (eOpt.rowNum % 2) {
					eOpt.styleIndex = 1;
				} else {
					eOpt.styleIndex = 2;
				}
				if (cellData === null) {
					eOpt.cellType = 'string';
					return 'N/A';
				} else
					return (cellData - originDate) / (24 * 60 * 60 * 1000);
			}
		}()
	}, {
		caption: 'bool',
		type: 'bool'
	}, {
		caption: 'number',
		type: 'number'
	}];
	conf.rows = [
	    ['标题'],
		['pi', new Date(Date.UTC(2013, 4, 1)), true, 3.14],
		["e", new Date(2012, 4, 1), false, 2.7182],
		["M&M<>'", new Date(Date.UTC(2013, 6, 9)), false, 1.61803],
		["null date", null, true, 1.414]
	];
	var result = nodeExcel.execute(conf);
	res.setHeader('Content-Type', 'application/vnd.openxmlformats');
	res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
	//console.log(result);
	res.end(result, 'binary');
};
