const { Kp, List, Row, Contractor, Event, User } = require('../models/models');

/**
 * Strictly for loading data from the database with a full include graph.
 * No calculations or formatting here.
 */
const loadKpByNumber = async (kpNumber) => {
    return await Kp.findOne({
        where: { kpNumber: String(kpNumber) },
        include: [
            {
                model: Contractor,
                as: 'contractor'
            },
            {
                model: Event,
                as: 'event',
                attributes: ['id', 'title']
            },
            {
                model: User,
                as: 'manager',
                attributes: ['id', 'name', 'job', 'email', 'tel']
            },
            {
                model: List,
                attributes: [
                    'id',
                    'startEvent', 'endEvent',
                    'startTimeStartEvent', 'endTimeStartEvent',
                    'startTimeEndEvent', 'endTimeEndEvent',
                    'eventPlace', 'countOfPerson', 'listTitle'
                ],
                include: [
                    {
                        model: Row,
                        attributes: [
                            'id',
                            'countOfProduct', 'priceOfProduct',
                            'product', 'composition', 'productWeight',
                            'typeOfProduct', 'order'
                        ],
                        separate: true,
                        order: [['order', 'ASC'], ['id', 'ASC']],
                    }
                ]
            }
        ],
        order: [
            [{ model: List }, 'id', 'ASC'],
        ],
    });
};

module.exports = {
    loadKpByNumber
};
