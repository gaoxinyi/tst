function Fx(db){
	this.user = db.model("coll_fx_code",{
		code:String,
		realname:String,
		idcard:String,
		statu:Number,
		activated:Number
	},"coll_fx_code");

	this.card = db.model("coll_card",{
		_id:String,
		code:String,
		name:String,
		sex:String,
		birth_date:String,
		address:String,
		phone:String,
		nationality:String,
		postalcode:String,
		card_type:String,
		card_no:String,
		card_date:String,
		card_cmp:String,
		imgs:String,
		sync:{type:Number,default:0},
		create_date:{type:Number,default:Date.now},
	},"coll_card")
};

module.exports = Fx;