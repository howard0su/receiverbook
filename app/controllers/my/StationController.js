const Station = require('../../models/Station');
const Receiver = require('../../models/Receiver');

class StationController {
    async index(req, res) {
        const stations = await Station.find({owner: req.user});
        res.render('my/stations.ejs', { stations });
    }
    newStation(req, res) {
        res.render('my/newStation.ejs');
    }
    async processNewStation(req, res) {
        const station = new Station({
            label:req.body.label,
            owner: req.user
        });
        await station.save();
        res.redirect(`/my/stations/${station.id}`);
    }
    async editStation(req, res) {
        const [station, receivers, unassignedReceivers] = await Promise.all([
            Station.findOne({owner: req.user, _id: req.params.id}),
            Receiver.find({claims: {$elemMatch: {owner: req.user, status: 'verified'}}, station: req.params.id}),
            Receiver.find({claims: {$elemMatch: {owner: req.user, status: 'verified'}}, station: null})
        ])
        if (!station) return res.status(404).send('station not found');
        res.render('my/editStation', { station, unassignedReceivers, receivers });
    }
    async deleteStation(req, res) {
        const receivers = await Receiver.find({station: req.params.id});
        await Promise.all(receivers.map(r => {
            r.station = undefined;
            r.save();
        }));
        await Station.deleteOne({owner: req.user, _id: req.params.id})
        res.redirect('/my/stations');
    }
    async assignReceiver(req, res) {
        const [receiver, station] = await Promise.all([
            Receiver.findOne({claims: {$elemMatch: {owner: req.user, status: 'verified'}}, _id:req.body.receiver_id}),
            Station.findOne({owner: req.user, _id:req.params.id})
        ]);
        if (!receiver) return res.status(404).send('receiver not found');
        if (!station) return res.status(404).send('station not found');

        receiver.station = station;
        await receiver.save();
        res.redirect(`/my/stations/${station.id}`)
    }
    async removeReceiver(req, res) {
        const receiver = await Receiver.findOne({claims: {$elemMatch: {owner: req.user, status: 'verified'}}, _id:req.params.receiver_id})
        if (!receiver) return res.status(404).send('receiver not found');

        receiver.station = null;
        await receiver.save();
        res.redirect(`/my/stations/${req.params.id}`)
    }
}

module.exports = StationController;