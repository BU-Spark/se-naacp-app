function mongoError (errorHeader, reason="There was an error!", raw="None", comments="None" ) {
    return {
        error: errorHeader,
        reason: reason,
        raw:raw,
        comments: comments,
    }
}

module.exports = { mongoError }
