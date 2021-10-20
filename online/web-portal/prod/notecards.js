const express = require("express");
const router = express.Router();
const path = require('path');

const dockerCLI = require('docker-cli-js');
const DockerOptions = dockerCLI.Options;
const Docker = dockerCLI.Docker;
const options = new DockerOptions(
    /* machinename */ null,
    /* currentWorkingDirectory */ null,
    /* echo */ false,
   );
const docker = new Docker(options);

const multer = require('multer');

const badchars = new RegExp("[!#$%&'*+/=?^`{|}~]", "g");

const is_dev = (process.env.DEV_OR_PROD && (process.env.DEV_OR_PROD == "dev"));
var port = is_dev ? 4999 : 2999;
const port_min = port;
const port_max = port + 2000;

const docker_image = is_dev ? 'notecards-dev' : 'notecards_211019';


// show user guide
router.get("/user-guide", (req, res) => {
   res.sendFile(path.join(__dirname, 'downloads', "notecards_user_guide_v1.2.pdf"));
});

// start notecards
router.get("/start", (req, res) => {
    const resume = req.query.resume && ((req.query.resume == "1") || (req.query.resume.toLowerCase() == "true"));
    const screen_width = req.query.screen_width || 1024;
    const screen_height = req.query.screen_height || 808;
    const devmode = req.query.devmode && ((req.query.devmode == "1") || (req.query.devmode.toLowerCase() == "true"));
    const emailish = req.userprofile.email.replace(badchars, '-').replace("@", ".-.");
    port = port + 1;
    if (port > port_max) port = port_min;
    const run_cmd =
        `run -d ${is_dev ? "" : "--rm"}`
        + ` --network host`
        + ` --name ${emailish}${is_dev ? `-${Math.floor(Math.random() * 99999)}` : ``}`
        + ` --mount type=volume,source=${emailish},target=/home/nc/notefiles`
        + ` --mount type=volume,source=${emailish}_vmem,target=/home/nc/vmem`
        + (devmode ? ` --mount type=volume,source=${emailish}_source,target=/home/nc/notecards` : ` `)
        + ` --env PORT=${port}`
        + ` --entrypoint /home/nc/bin/run-notecards`
        + ` ${docker_image}`
        + (resume ? ` resume` : ` new`)
        + ` ${screen_width} ${screen_height}`
        ;
    if(is_dev) console.log(run_cmd);
    docker
        .command(`container ${is_dev ? `ls` : `kill ${emailish}`}`)
        .catch((err)=>{ if(is_dev) { console.log("Expected error after container kill: " + err); } } )
	    .finally(() =>
		    docker
	            .command(run_cmd)
	            .then(data => { res.redirect(`loading?port=${port}&target=Notecards`); })
	            .catch(err => { console.log(err); res.send(err.stderr); })
                );
});

// start xterm andsftp server
router.get("/xterm", (req, res) => {
    const devmode = req.query.devmode && ((req.query.devmode == "1") || (req.query.devmode.toLowerCase() == "true"));
    const emailish = req.userprofile.email.replace(badchars, '-').replace("@", ".-.");
    port = port + 1;
    if (port > port_max) port = port_min;
    const run_cmd =
        `run -d ${is_dev ? "" : "--rm"}`
        + ` --network host`
        + ` --name ${emailish}${is_dev ? `-${Math.floor(Math.random() * 99999)}` : ``}`
        + ` --mount type=volume,source=${emailish},target=/home/nc/notefiles`
        + ` --mount type=volume,source=${emailish}_vmem,target=/home/nc/vmem`
        + (devmode ? ` --mount type=volume,source=${emailish}_source,target=/home/nc/notecards` : ` `)
        + ` --env PORT=${port}`
        + ` --entrypoint /home/nc/bin/run-xterm`
        + ` --privileged` 
        + ` ${docker_image}`
        + ` 1024 808`
        ;
   if(is_dev) console.log(run_cmd);
   docker
        .command(`container ${is_dev ? `ls` : `kill ${emailish}`}`)
        .catch((err)=>{ if(is_dev) { console.log("Expected error after container kill: " + err); } } )
	    .finally(() =>
		    docker
	            .command(run_cmd)    
	            .then(data => { res.redirect(`loading?port=${port}&target=xterm`); })
	            .catch(err => { console.log(err); res.send(err.stderr); })
                );
});

// wait N secs, then go to client page
router.get("/loading", (req, res) => {
	const port = req.query.port;
	const target = req.query.target || "unknown";
	res.redirect(`${router.base_url}/client/go?target=${target}&port=${port}&autoconnect=1`);
});

// Upload notefile
const uploads_dir = '/tmp/uploads';

const storage = multer.diskStorage({
    destination: uploads_dir,
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});

const uploader = multer({storage : storage});


router.post(
    '/upload_notefile',
    uploader.single("notefile"),
    (req, res) => {
        try {
            const emailish = req.userprofile.email.replace(badchars, '-').replace("@", ".-.");
            const run_cmd = 
                    `run --rm`
                    + ` --mount type=volume,source=${emailish},target=/dest`
                    + ` -v ${uploads_dir}:/source`
                    + ` -w /source`
                    + ` alpine`
                    + ` mv "${req.file.originalname}" /dest`
                    ;
            if(is_dev) console.log(run_cmd);
            docker
                .command(`container ${is_dev ? `ls` : `kill ${emailish}`}`)
                .catch((err)=>{ if(is_dev) { console.log("Expected error after container kill: " + err); } } )
                .finally(() =>
                    docker
                        .command(run_cmd)
                        .then(data => { res.send(req.file.originalname); })
                        .catch(err => { console.log(err); res.send(err.stderr); })
                );
         } catch(err) {
                res.send(400);
         }
     }
);

router.get(
    '/download_list',
    (req, res) => {
        try {
            const emailish = req.userprofile.email.replace(badchars, '-').replace("@", ".-.");
            const run_cmd =
                    `run --rm`
                    + ` --mount type=volume,source=${emailish},target=/source`
                    + ` alpine`
                    + ` ls /source`
                    ;
            if(is_dev) console.log(run_cmd);
            docker
                .command(`container ${is_dev ? `ls` : `kill ${emailish}`}`)
                .catch((err)=>{ if(is_dev) { console.log("Expected error after container kill: " + err); } } )
                .finally(() =>
                    docker
                        .command(run_cmd)
                        .then(data => {
                                 const filelist = data.raw.split("\n"); 
                                 res.send(filelist);
                             })
                        .catch(err => { console.log(err); res.send(err.stderr); })
                );
         } catch(err) {
                res.send(400);
         }
    }
);

router.get(
    '/download_file',
    (req, res) => {
        try {
            const emailish = req.userprofile.email.replace(badchars, '-').replace("@", ".-.");
            const filename = req.query.file;
            const run_cmd = 
                `run --rm`
                + ` --mount type=volume,source=${emailish},target=/source`
                + ` -v ${uploads_dir}:/dest`
                + ` -w /source`
                + ` alpine`
                + ` cp ${filename} /dest`
                ;
            if(is_dev) console.log(run_cmd);
            docker
                .command(`container ${is_dev ? `ls` : `kill ${emailish}`}`)
                .catch((err)=>{ if(is_dev) { console.log("Expected error after container kill: " + err); } } )
                .finally(() => {
                    docker
                        .command(run_cmd)
                        .then(data => {
                                 res.download(`${uploads_dir}/${filename}`);
                             })
                        .catch(err => { console.log(err); res.send(err.stderr); });
                });
         } catch(err) {
                res.send(400);
         }
    }
);


router.get(
    '/reset_source',
    (req, res) => {
        const emailish = req.userprofile.email.replace(badchars, '-').replace("@", ".-.");
        const run_cmd = `volume rm ${emailish}_source`;
        if(is_dev) console.log(run_cmd);
        docker
            .command(`container ${is_dev ? `ls` : `kill ${emailish}`}`)
            .catch((err)=>{ if(is_dev) { console.log("Expected error after container kill: " + err); } } )
            .finally(() => {
                docker
                    .command(run_cmd)
	                .then(data => { res.status(200).end(); })
	                .catch(err => { console.log(err); res.send(err.stderr); });
                }
            );
    }
);


module.exports = router;
