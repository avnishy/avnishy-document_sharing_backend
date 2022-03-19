const config = require("../config/db.config.js");
const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

//Optional For Debigging
sequelize.authenticate()
.then(() => {
    console.log('connected..')
})
.catch(err => {
    console.log('Error'+ err)
})

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
//Document 
db.document = require('./documentModel.js')(sequelize, DataTypes)
db.reviews = require('./reviewModel.js')(sequelize, DataTypes)

//Users
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
//optional For Debugging
db.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!')
})

//Relations Between Users
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

//1 to many relationship in Documnet and Comment/Review
db.document.hasMany(db.reviews, {
  foreignKey: 'document_id',
  as: 'review'
})

db.reviews.belongsTo(db.document, {
  foreignKey: 'document_id',
  as: 'document'
})

db.ROLES = ["user", "admin", "reviewer"];
module.exports = db;