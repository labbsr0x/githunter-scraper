'use strict';

const config = require("../../../config");

module.exports = {
    ...config,
    path: "/pulls",
    filterClosedQS: "q=is%3Apr+is%3Aclosed",
    filterOpenQS: "q=is%3Aopen+is%3Apr"
}