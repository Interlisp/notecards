const express = require("express");
var path = require('path');

const router = express.Router();

const dockerCLI = require('docker-cli-js');
const DockerOptions = dockerCLI.Options;
const Docker = dockerCLI.Docker;
const options = new DockerOptions(
    /* machinename */ null,
    /* currentWorkingDirectory */ null,
    /* echo */ true,
   );

const docker = new Docker(options);

const badchars = new RegExp("[!#$%&'*+/=?^`{|}~]", "g");

var port = (process.env.DEV_OR_PROD && (process.env.DEV_OR_PROD == "dev")) ? 6999 : 2999;
const port_min = port;
const port_max = port + 2000; 

// css and js file for xpra
const xpra_path = path.join(__dirname, '..', 'xpra');
router.use(express.static(xpra_path));

// start notecards
router.get("/start", (req, res) => {
   const emailish = req.userprofile.email.replace(badchars, '-').replace("@", ".-.");
   port = port + 1;
   if (port > port_max) port = port_min;
   docker
        .command(`container kill ${emailish}`)
	.finally(() =>
		docker
	             .command(`run -d --rm`
                              + ` --network host`
                              + ` --name ${emailish}`
                              + ` --mount type=volume,source=${emailish},target=/home/il/notecards/notefiles`
                              + ` --env PORT=${port}`
                              + ` notecards004`
                              + ` /home/il/bin/run-notecards`)
	             .then(data => { res.redirect(`loading?port=${port}`); })
	             .catch(err => { console.log(err); res.send(err.stderr); })
                );
});

// start xterm (for debugging only)
router.get("/xterm", (req, res) => {
   const emailish = req.userprofile.email.replace(badchars, '-').replace("@", ".-.");
   port = port + 1;
   if (port > port_max) port = port_min;
   docker
        .command(`container kill ${emailish}`)
	.finally(() =>
		docker
	             .command(`run -d --rm`
                              + ` --network host`
                              + ` --name ${emailish}`
                              + ` --mount type=volume,source=${emailish},target=/home/il/notecards/notefiles`
                              + ` --env PORT=${port}`
                              + ` notecards004`
                              + ` /home/il/bin/run-xterm`)
	             .then(data => { res.redirect(`loading?port=${port}`); })
	             .catch(err => { console.log(err); res.send(err.stderr); })
                );
});

// wait N secs, then go to page on xpra server
router.get("/loading", (req, res) => {
	const port = req.query.port;
	res.render("loading", {port: port, waittime: 30});
});

// load xpra HTML5 client
router.get('/xpra-client',
     (req, res, next) =>
	   { res.sendFile(path.join(xpra_path, 'index.html')); }
);


module.exports = router;




