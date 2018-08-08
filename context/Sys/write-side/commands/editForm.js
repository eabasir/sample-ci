const errors = require('../../../../utils/errors.list');
const db = require('../../../../infrastructure/db');
const BaseCommand = require('../../../../utils/base-command');

const FormRepository = require('../../repositories/formRepository');

class EditForm extends BaseCommand {

  constructor() {
    super();
  }

  async execute(payload, user) {
    try {
      if (!payload)
        throw  errors.payloadIsNotDefined;
      ['name','formFieldList'].forEach(el => {
        if (!payload[el])
          throw errors.incompleteData;
        if (el === 'formFieldList' && !el.length)
          throw errors.incompleteData;
      });

      payload.formFieldList.forEach(el => {
        ['title', 'answerShowType'].forEach(item => {
          if (el[item] === null)
            throw errors.incompleteData;
        })
      });

      payload.formFieldList.forEach(el => {
        if (el.answerShowType !== 'متنی') {
          if (el.answerSource !== 'داینامیک') {
            if (!el.staticAnswerArray || !el.staticAnswerArray.length) {
              throw errors.incompleteData;
            }
          }
          else
          {
            if (!el.answerView)
              throw errors.incompleteData;
          }
        }
      });


      let form = await new FormRepository().getFormById(payload.formId);
      return super.execute(async () => {
          form.assignFormBasicInfo(payload, user);
          form.assignFormFields(payload.formFieldList);
          await form.formUpdated(form.id);
          return form.getId();
        }
      );

    } catch (err) {
      throw err;
    }
  }
}

module.exports = EditForm;
