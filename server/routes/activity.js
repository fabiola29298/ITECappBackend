/*
ACCIONES PARA LOS TIPOS DE ActivityS
admin: create, read, update, delete - get, post, put, delete
user: read and create feedback**
invited: read
*/
const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const Activity = require('../models/activity');
//const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

let salto = bcrypt.genSaltSync(10);
// GET para mostrar

app.get('/activity',
    function(req, res) {
        let desde = req.query.desde || 0;
        desde = Number(desde);

        let limite = req.query.limite || 150;
        limite = Number(limite);


        Activity.find({ status: true })
            .skip(desde)
            .limit(limite)
            .populate('person', '_id name last_name degree description url_image career ')

        .exec((err, activity) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            //regresar el objeto
            Activity.count({ status: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    activity,
                    cuantos: conteo
                });
            });



        })
    });
// POST para crear registros
app.post('/activity', function(req, res) {
    let body = req.body;

    let activity = new Activity({
        person: body.person,
        name: body.name,
        type: body.type,
        date: body.date,
        description: body.description,
        start_time: body.start_time,
        end_time: body.end_time,
        classroom: body.classroom,
        block_campus: body.block_campus
    });

    activity.save((err, activityDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            activity: activityDB
        });
    });
});
// PUT Para actualizar registros
app.put('/activity/:id', function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['person', 'name', 'type', 'date', 'description', 'start_time', 'end_time', 'classroom', 'block_campus']);

    Activity.findByIdAndUpdate(id, body, { new: true }, (err, activityDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            activity: activityDB
        });
    });
});
//DELETE cambiar de status a false
app.delete('/activity/:id', function(req, res) {
    let id = req.params.id;

    let cambiaStatus = {
        status: false
    }

    Activity.findByIdAndUpdate(id, cambiaStatus, { new: true }, (err, activityDelete) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!activityDelete) {
            return res, status(400).json({
                ok: false,
                err: {
                    message: 'Actividad no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            activity: activityDelete
        });
    });
});


// ===========================
//  Buscar por tipo
// ===========================
app.get('/activity/buscar/tipo/:termino', (req, res) => {

    let termino = req.params.termino;
    // creando expresion regular, y 'i' para no afectar cuando usas mayusculas
    let regex = new RegExp(termino, 'i');

    Activity.find({ type: regex })
        .populate('person', '_id name last_name degree description url_image career ')
        .exec((err, activityDB) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                activity: activityDB
            })

        })


});
// ===========================
//  Buscar por nombre
// ===========================
app.get('/activity/buscar/name/:termino', (req, res) => {

    let termino = req.params.termino;
    // creando expresion regular, y 'i' para no afectar cuando usas mayusculas
    let regex = new RegExp(termino, 'i');

    Activity.find({ name: regex })
        .populate('person', '_id name last_name degree description url_image career ')
        .exec((err, activityDB) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                activity: activityDB
            })

        })


});

// ===========================
//  Buscar por id
// ===========================
app.get('/activity/buscar/id/:id', (req, res) => {

    let termino = req.params.id;
    // creando expresion regular, y 'i' para no afectar cuando usas mayusculas
    //let regex = new RegExp(termino, 'i');

    Activity.find({ _id: termino })
        .populate('person', '_id name last_name degree description url_image career ')
        .exec((err, activityDB) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                activity: activityDB
            })

        })


});
// ===========================
//  Buscar por fecha
// ===========================
app.get('/activity/buscar/date/:date', (req, res) => {

    let termino = req.params.date;
    // creando expresion regular, y 'i' para no afectar cuando usas mayusculas
    let regex = new RegExp(termino, 'i');

    Activity.find({ date: regex })
        .populate('person', '_id name last_name degree description url_image career ')
        .sort('date ASC')
        .exec((err, activityDB) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                activity: activityDB
            })

        })


});
module.exports = app;