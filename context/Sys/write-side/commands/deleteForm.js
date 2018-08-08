const errors = require('../../../../utils/errors.list');
const db = require('../../../../infrastructure/db');
const BaseCommand = require('../../../../utils/base-command');

const FormRepository = require('../../repositories/formRepository');

class DeleteForm extends BaseCommand {

  constructor() {
    super();
  }

  async execute(payload, user) {
    try {
      if (!payload)
        throw  errors.payloadIsNotDefined;


      let form = await new FormRepository().getFormById(payload);
      return super.execute(async () => {
          return form.FormDeleted(payload);
        }
      );

    } catch (err) {
      throw err;
    }
  }
}

module.exports = DeleteForm;
