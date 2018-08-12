const error = require('../../../../utils/errors.list');
const BaseCommand = require('../../../../utils/base-command');
const PersonRepository = require('../../repositories/personRepository');

// this does 'updatePerson' and 'updatePersonRoles' in one place
// but for defining a new personnel, rather than updating one
class DefinePersonnel extends BaseCommand {
    constructor() {
        super();
    }

    async execute(payload, user) {
        try {
            if (!payload)
                throw error.payloadIsNotDefined;
            if (!payload.person)
                throw error.incompleteData;
            const completeInfo = [
                'firstname',
                'surname',
                'title',
                'national_code',
                'birth_date',
            ].every(el => payload.person[el]);

            const completeAddress = [
                'province',
                'city',
                'street',
                'district',
                'postal_code'
            ].every(el => payload.person.address[el]);

            if (!completeInfo || !completeAddress)
                throw error.incompleteData;

            if (!Array.isArray(payload.roles) || !payload.roles.length)
                throw new Error('roles are not valid');

            const personRepo = new PersonRepository();
            let person = await personRepo.findOrCreatePerson(payload.person.person_id);
            person.assignPersonInfo(payload.person);
            person.assignAddress(payload.person.address);
            await person.personAdded();
            await person.newRolesAssigned(payload.roles);
            return person.getId();
        } catch (err) {
            throw err;
        }
    }
}

module.exports = DefinePersonnel;