function infoLogger (header="", info, icon = "ⓘ", color = "\x1b[36m%s\x1b[0m") {
    console.log(color, `${icon} ${header} ${info}\n`);
}

function warningLogger (header="", info, icon = "(!)", color = "\x1b[33m", ) {
    console.log(color, `${icon} ${header} ${info}\n`);
}

module.exports = { infoLogger, warningLogger }