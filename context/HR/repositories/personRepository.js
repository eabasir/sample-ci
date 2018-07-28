
const Person = require('../../../infrastructure/db/models/person.model');
const IPerson = require('../write-side/aggregates/person');

/**
 * QUERY RELATED REPOSOTIROES:
 */


/** COMMAND RELATED REPOSITORIES:
 * If a domain model is being requested by repositoris it should be returnd as an instance of domain model (new IPerson())
 * e.g: IPerson  = require ('../write-side/aggregates/person.js')
 * 
 * **/

findOrCreatePerson = async (person_info) => {
    let isCompleteData = true;
    ['firstname', 'surname', 'title', 'national_code'].forEach(el => {
        if (!person_info[el])
            isCompleteData = false;
    });
    if (!isCompleteData)
        throw new Error('person data is incomplete');

    const query = {
        firstname: person_info.firstname,
        surname: person_info.surname,
        title: person_info.title,
        national_code: person_info.national_id,
    };

    let person;
    if (!person_info.person_id) {
        person = await Person.model().create(query);
    } else {
        query['id'] = person_info.person_id;
        person = await Person.model().update(query);
    }

    return new IPerson(person.id);
};

addressAssignedToPerson = async (address, person_id) => {
    if (!person_id)
        throw new Error('person id is not set');

    ['province', 'city', 'street', 'district', 'postal_code'].forEach(el => {
        if (!address[el])
        return;
    })
};


module.exports = {
    findOrCreatePerson,
    addressAssignedToPerson,
};