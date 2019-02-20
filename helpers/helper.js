let hbs = require('hbs')
module.exports = {
    noop: function (data) {
        return hbs.SafeString(data)
    }
}
