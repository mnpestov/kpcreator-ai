const { Op } = require('sequelize');
const sequelize = require('../db');
const { Kp, List, Row, Contractor, Event, MenuItem } = require('../models/models');

async function cleanupSmokeData() {
    try {
        await sequelize.authenticate();

        let rowsDeleted = 0;
        let listsDeleted = 0;
        let kpsDeleted = 0;

        // Find KPs containing [SMOKE] in listTitle (and optionally eventPlace just in case)
        const kps = await Kp.findAll({
            where: {
                [Op.or]: [
                    { listTitle: { [Op.like]: '%[SMOKE]%' } },
                    // In case the prompt meant "eventPlace" when writing "eventTitle"
                    { eventPlace: { [Op.like]: '%[SMOKE]%' } }
                ]
            }
        });

        const kpIds = kps.map(kp => kp.id);

        if (kpIds.length > 0) {
            // Find Lists matching the KP ids
            const lists = await List.findAll({
                where: { kpId: kpIds }
            });

            const listIds = lists.map(list => list.id);

            if (listIds.length > 0) {
                // 1. Delete Rows
                rowsDeleted = await Row.destroy({
                    where: { listId: listIds }
                });

                // 2. Delete Lists
                listsDeleted = await List.destroy({
                    where: { id: listIds }
                });
            }

            // 3. Delete KPs
            kpsDeleted = await Kp.destroy({
                where: { id: kpIds }
            });
        }

        // 4. Delete Contractors
        const contractorsDeleted = await Contractor.destroy({
            where: {
                companyName: { [Op.like]: '%[SMOKE]%' }
            }
        });

        // 5. Delete Events
        const eventsDeleted = await Event.destroy({
            where: {
                title: { [Op.like]: '%[SMOKE]%' }
            }
        });

        // 6. Delete MenuItems
        const menuItemsDeleted = await MenuItem.destroy({
            where: {
                title: { [Op.like]: '%[SMOKE]%' }
            }
        });

        console.log('[SMOKE CLEANUP]');
        console.log(`Rows deleted: ${rowsDeleted}`);
        console.log(`Lists deleted: ${listsDeleted}`);
        console.log(`KPs deleted: ${kpsDeleted}`);
        console.log(`Contractors deleted: ${contractorsDeleted}`);
        console.log(`Events deleted: ${eventsDeleted}`);
        console.log(`MenuItems deleted: ${menuItemsDeleted}`);

    } catch (error) {
        console.error('An error occurred during cleanup:', error);
    } finally {
        await sequelize.close();
    }
}

cleanupSmokeData();
