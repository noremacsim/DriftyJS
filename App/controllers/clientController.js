const path = require("path");
const {Client} = require(path.join(__dirname, '../../Core/models/'));
const {ClientGroups} = require(path.join(__dirname, '../../Core/models/'));
const {Groups} = require(path.join(__dirname, '../../Core/models/'));

module.exports = {

    view: async (request, h) => {
        const clients = await Client.findAll({ where: { UserId: global.userID } });
        return h.simsView('clients', {clients: clients, activePage: 'clients'});
    },

    edit: async (request, h) => {
        const clientID = request.params.clientID;
        let client = [];
        let clientGroups = [];
        if (clientID) {
            client = await Client.findOne({ where: { id: clientID, UserId: global.userID } });
            clientGroups = await ClientGroups.findAll({ where: { ClientId: clientID }, attributes: ["GroupId"], raw: true, nest: true })
                .then(function(clientGroups) {
                    return clientGroups.map(function(clientGroups) { return clientGroups.GroupId; })
                });
        }
        const groups = await Groups.findAll({ where: { UserId: global.userID } });
        return h.simsView('editclient', {client: client, clientGroups: clientGroups, groups: groups, activePage: 'client'});
    },

    saveEdit: async (request, h) => {
        let clientID = request.params.clientID
        let {username, email, clientGroups, activeClient, trial, exp_date} = request.payload;

        let active = false
        if (activeClient) {
            active = true;
        }

        if (!trial) {
            trial = false;
        }

        if (clientID) {
            const updated = await Client.update(
                {
                    username: username,
                    email: email,
                    active: active,
                    trial: trial,
                    exp_date: exp_date,
                },
                {
                    where: {id: clientID, UserId: global.userID}
                }
            );
        } else {
            const newClient = await Client.create(
                {
                    username: username,
                    email: email,
                    active: active,
                    UserId: global.userID,
                    trial: trial,
                    exp_date: exp_date,
                }
            );
            clientID = newClient.id;
        }

        await ClientGroups.destroy({ where: { ClientId: clientID } });

        if (ClientGroups) {
            for (const groupId of clientGroups) {
                await ClientGroups.create({
                    ClientId: clientID,
                    GroupId: groupId,
                });
            }
        }

        return 'test';
    },

    deleteUser: async(request, h) => {
        let clientID = request.params.clientID
        await ClientGroups.destroy({ where: { clientId: clientID } });
        await Client.destroy({ where: { id: clientID, UserId: global.userID } });
        return true;
    },
}
