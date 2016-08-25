function Fx(db){
	this.user = db.model("coll_fx_code",{
		code:String,
		realname:String,
		idcard:String,
		statu:Number,
		activated:Number
	},"coll_fx_code");
};

module.exports = Fx;