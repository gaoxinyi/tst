function Tst(db){
	this.order = db.model("coll_order",{
		_id:String,
		queue:Number,
		openId:String,
		yswfCode:String,
		goodsId:String,
		total:Number,
		remark:String,
		sync:{type:String,default:"0"},
		createDate:{type:Number,default:Date.now},
		isPay:{type:String,default:"0"},
		wxPayCode:String,
		payTime:String,
		amount:Number,
		unitprice:Number,
		original:Number,
		shipping:{type:Number,default:0},
		addressCode:String,
		payType:{type:String,default:"kq"},
	},"coll_order");

	this.payLog = db.model("coll_pay_log",{
		wxPayCode:String,
		payType:{type:String,default:"kq"},
		openId:String,
		totalFee:Number,
		orderCode:String,
		createDate:{type:Number,default:Date.now},
		payTime:String,
		sync:{type:String,default:"0"},
		payResult:Boolean
	},"coll_pay_log");
};

module.exports = Tst;
