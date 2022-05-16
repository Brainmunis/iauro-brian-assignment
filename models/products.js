var mongoose = require("mongoose");
const utils = require("../helpers/util");


const schema = new mongoose.Schema(
  {
    uid: { type: String },
    user_uid: { type: Number },
    user_type: { type: String },
    name : { type: String },
    show : { type: Boolean },
    description :{ type: String },
    price : { type: Number},
    offers : [],
    ratings : []
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

schema.pre("save", async function (next) {
  var self = this;
  if (!self.uid) {
    self.uid = utils.generateUid("prod", 10);
    self.show = true;
    return next();
  } else {
    return next();
  }
});

schema.statics = {
    _create : function(data){
        let product = {
            user_uid: data.user_uid,
            user_type: data.user_type,
            name : data.name,
            show : data.show,
            description :data.description,
            price : data.price,
        }
        return this.create(product)
    },
    lists : async function(user_uid, user_type, name, show, { orderBy, skip, limit, sortDirection}){
        let findQuery = {
            user_uid
        }
        if(user_type === "admin"){
            findQuery = {};
        }
        if(name){
            findQuery['name'] = name
        }
        if(typeof show === 'boolean'){
            findQuery["show"] = show
        }
        const total = await this.count(findQuery);
        const items = await this.aggregate([
            {
                $match : findQuery
            },
            {
                $sort : {
                    [orderBy] : sortDirection
                }
            },
            {
                $skip : skip
            },
            {
                $limit : limit
            },
            {
                $lookup: {
                    from: 'users',
                    let: { user_uid: '$user_uid' },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $eq: ['$$user_uid', '$uid'],
                            },
                        },
                    },
                    {
                        $project: { 
                            uid : 1,
                            name : 1,
                            email_address : 1,
                            user_type : 1     
                        },
                    },
                    ],
                    as: 'user',
                },
            },
            {
                $unwind: {
                    path: `$user`,
                    preserveNullAndEmptyArrays: true,
                }
            }
        ])
        return {
            items,
            total
        }
    },
    _deleteOne : function(productId, user_uid, user_type){
        let deleteQuery = {
            uid : productId,
            user_uid
        }
        if(user_type === "admin"){
            deleteQuery = {
                uid : productId
            }
        }
        return this.findOneAndDelete(deleteQuery)
    },
    getProductById : function(productId, user_uid, user_type){
        let fetchQuery = {
            uid : productId,
            user_uid
        }
        if(user_type === "admin"){
            fetchQuery = {
                uid : productId
            }
        }
        return this.findOne(fetchQuery);
    },
    _updateOne : function(productId, user_type, user_uid, dataToUpdate){
        let findQuery = {
            user_uid,
            uid : productId
        };
        if(user_type === "admin"){
            findQuery = {
                uid : productId
            }
        }
        return this.findOneAndUpdate(findQuery, dataToUpdate, { new : true}).lean();
    }
}


module.exports = {
  name: "Product",
  schema: schema,
};
