function finish(req, res) {

    res.render(
        './layouts/tickets/finish', {
            titulo: "Your tickets are on its way!",
            event_name: req.session.event_name,



        }
    );

}

module.exports =  {
    finish
}