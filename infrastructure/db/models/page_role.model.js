const Sequelize = require('sequelize');
const Page = require('./page.model');
const Role = require('./role.model');

let PageRole;
const init = (seq) => {

  PageRole = seq.define('page_role', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    access: {
      type: Sequelize.STRING,
    }
  }, {
      tableName: 'page_role',
      timestamps: false,
      underscored: true
    });

  PageRole.belongsTo(Page.model());
  PageRole.belongsTo(Role.model());

}


module.exports = {
  init,
  model: () => PageRole
};

